import {nofailIsActive} from './activator.js'
// @ts-check

const {queryConfig, _} = Cypress;

function parseArgs(args) {
  const queryParams = args.slice(0,args.length-1)
  const userOptions = args.at(-1)
  const options = {
    log: true,
    timeout: Cypress.config('defaultCommandTimeout'),
    ...userOptions,
    nofail: nofailIsActive(userOptions),
  }
  return [queryParams, userOptions, options]
}

function initiateLog(cmd) {
  const {queryParams, options, isSubQuery, userOptions} = cmd.queryState
  const shouldLog = isSubQuery ? false : queryConfig.handleLogging && userOptions?.log !== false
  if (!shouldLog) return 

  const log = cmd.get('logs')[0] || 
    Cypress.log({
      displayName: cmd.get('name'),
      message: queryParams.filter(Boolean),
      state: 'pending',
      timeout: options.timeout,
      consoleProps: () => ({}),
    })
  cmd.queryState = {
    ...cmd.queryState,
    log,
    baseMessage: log && (log.get('message') || queryParams?.filter(Boolean).join(', ')),
    shouldLog
  }
}

function catchOnFailError(cmd) {
  const originalOnFail = cmd.get('onFail')
  const onFailHandler = (err) => {
    originalOnFail && originalOnFail(err)
    cmd.queryState.error = err
  }
  cmd.set('onFail', onFailHandler)
}

function invokeOuterFn(cmd, outerFn, queryParams, options) {

  /* Stop Cypress runner from handling timeout and logging */
  const runnerOptions = {
    ...options, 
    timeout: options.timeout + queryConfig.runnerTimeoutBump,   
    log: queryConfig.handleLogging ? false : options.log      
  }

  /* Handle reverse options order for invoke() */
  const params = cmd.queryState.optionsFirst ? [runnerOptions, ...queryParams] : [...queryParams, runnerOptions]
  cmd.queryState.optionsFirst = null    

  const innerFn = outerFn.apply(cmd, params)
  return innerFn
}

function invokeInnerFn(innerFn, subject, expires, errorHandler) {
  let $el
  let found
  const timedOut = Date.now() > expires

  try {
    const result = innerFn(subject)  
    if (Cypress.dom.isJquery(result)) {
      /* DOM query - 
        pass back $el with length 0 to keep retrying
        or null to stop retrying when timed-out
      */
      if (result.length) {
        $el = result
        found = true
      } else {
        $el = timedOut ? null : result
        found = false
      }
    } else {
      $el = result
      found = true    
    }
  } catch (error) {
    if (timedOut && errorHandler) { 
      $el = errorHandler(error)
      found = false
    } else {
      throw error
    }
  }
  return [$el, found, timedOut]
}

function initializeState(cmd, options, userOptions, queryParams) {
  const chainerId = cmd.get('chainerId')
  const queryId = ++queryConfig.queryId
  const isSubQuery = cmd.queryState?.chainerId === chainerId

  if (isSubQuery) {
    /* 
      If this is a sub-query, e.g its() called internally by invoke()
      it should inherit the options.timeout of parent command
    */
    options.timeout = cmd.queryState?.options?.timeout || options.timeout
    // save parent query state for reverting in commandEnd
    cmd.queryState.parentState = _.cloneDeep(cmd.queryState)
  }
  cmd.queryState = {
    ...cmd.queryState,   // the query may be setting some state, e.g invoke() sets "optionsFirst"
    chainerId, 
    queryId, 
    isSubQuery,
    queryParams, 
    userOptions, 
    options
  }
}

function commandEnd(cmd) {
  if (!cmd.queryState?.options?.nofail) return
  if (cmd.queryState.shouldLog) {
    commandEndLog(cmd)
  }
  cy.off('command:end', commandEnd)
}

function commandEndLog(cmd) {
  if (cmd.queryState.skipped) {
    Cypress.emit('query:skip', cmd)
    const prev = cmd.get('prev')
    if (prev) {
      Cypress.emit('query:log', prev)
    } 
  } else {
    Cypress.emit('query:log', cmd)
  }
}

export function queryFactory(outerFn, ...args) {
  const cmd = cy.state('current')
  const [queryParams, userOptions, options] = parseArgs(args)

  if (!options.nofail) {
    const params = cmd.queryState?.optionsFirst ? [options, ...queryParams] : [...queryParams, options]
    return outerFn.apply(cmd, params)   // normal call
  }

  initializeState(cmd, options, userOptions, queryParams)
  initiateLog(cmd)
  const innerFn = invokeOuterFn(cmd, outerFn, queryParams, options)
  catchOnFailError(cmd)

  const start = Date.now()
  const expires = start + options.timeout
  let call = 0
  cy.on('command:end', commandEnd)

  const queryFn = function(subject) {
    call = ++call
    if (subject === null) {
      cmd.queryState = {
        ...cmd.queryState,
        skipped: true,
        $el: null,
        found: false,
        timedOut: false,
        call
      }
      return null  
    }

    const [$el, found, timedOut] = invokeInnerFn(innerFn, subject, expires, cmd.queryState?.errorHandler)
    cmd.queryState = {
      ...cmd.queryState,
      $el,
      found,
      elapsed: Date.now() - start,
      timedOut,
      call
    }

    return $el
  }

  return queryFn
}
