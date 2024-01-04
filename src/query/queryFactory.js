import {nofailIsActive} from './activator.js'
import {shouldLog} from './logging.js'
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

function initiateLog(queryParams, options, cmd) {
  let log
  if(!shouldLog(cmd, queryConfig)) {
    return
  }
  log = cmd.get('logs')[0] || 
    Cypress.log({
      displayName: cmd.get('name'),
      message: queryParams.filter(Boolean),
      state: 'pending',
      timeout: options.timeout,
      consoleProps: () => ({}),
    })
  return log
}

function catchOnFailError(cmd) {
  const wrapper = {}
  const originalOnFail = cmd.get('onFail')
  const onFailHandler = (err) => {
    originalOnFail && originalOnFail(err)
    wrapper.error = err
  }
  cmd.set('onFail', onFailHandler)
  return wrapper
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

export function queryFactory(outerFn, ...args) {
  const cmd = cy.state('current')
  const chainerId = cmd.get('chainerId')
  const queryId = ++queryConfig.queryId
  const isSubQuery = cmd.queryState?.chainerId === chainerId

  const [queryParams, userOptions, options] = parseArgs(args)

  if (!options.nofail) {
    const params = cmd.queryState?.optionsFirst ? [options, ...queryParams] : [...queryParams, options]
    return outerFn.apply(cmd, params)   // normal call
  }

  /* 
    If this is a sub-query, e.g its() called internally by invoke()
    it should inherit the options.timeout of parent cmd
  */
  options.timeout = cmd.queryState?.options?.timeout || options.timeout

  let log
  const shouldLog = isSubQuery ? false : queryConfig.handleLogging && userOptions.log !== false
  if (shouldLog) {
    log = initiateLog(queryParams, options, cmd)
  }

  /* Save query state to cmd */
  if (isSubQuery) {
    cmd.queryState.subQuery = {
      queryId,
      queryParams,
      userOptions: cmd.queryState.userOptions,  // preserve for nested queries e.g .contains()
      options
    }
  } else {
    cmd.queryState = {
      ...cmd.queryState,
      chainerId,
      queryId,
      isSubQuery,
      queryParams,
      userOptions,  
      options, 
      log,
      baseMessage: log?.get('message') || queryParams?.filter(Boolean).join(', '),
      shouldLog
    }
  }

  const innerFn = invokeOuterFn(cmd, outerFn, queryParams, options)
  const caughtError = catchOnFailError(cmd)
  const start = Date.now()
  const expires = start + options.timeout

  let call = 0

  function updateLog(cmd) {
    const log = cmd.queryState.log || cmd.get('logs')[0]
    const {$el, found} = cmd.queryState
    const passed = cmd.queryState?.assertionPassed || found
    Cypress.emit('query:log', {
      cmd,
      queryParams,
      options, 
      log, 
      $el, 
      found,
      passed,
      caughtError
    })
  }

  function commandEndLog(cmd) {
    if (!cmd.queryState?.options?.nofail) return

    if (!cmd.queryState.shouldLog) {
      cy.off('command:end', commandEndLog)
      return
    }

    const {skipped} = cmd.queryState
    if (skipped) {
      Cypress.emit('query:skip', {
        cmd,
        queryParams,
        options, 
        log, 
      })
      const prev = cmd.get('prev')
      if (prev) {
        updateLog(prev) 
      } 
      cy.off('command:end', commandEndLog)
      return
    }

    updateLog(cmd)

    cy.off('command:end', commandEndLog)
  }
  cy.on('command:end', commandEndLog)



  const queryFn = function(subject) {
    call = ++call
    if (subject === null) {
      cmd.queryState.skipped = true
      cmd.queryState.$el = null
      cmd.queryState.found = false
      cmd.queryState.timedOut = false
      return null  
    }

    const [$el, found, timedOut] = invokeInnerFn(innerFn, subject, expires, cmd.queryState?.errorHandler)
    cmd.queryState.$el = $el
    cmd.queryState.found = found
    cmd.queryState.timedOut = timedOut
    cmd.queryState.error = caughtError.error

    return $el
  }

  return queryFn
}

