import {emitToCypressLog} from './logging.js'
import {activatorHandler} from './nofailActivator.js'
// @ts-check

const {queryConfig,_} = Cypress;

function parseArgs(args) {
  const queryParams = args.slice(0,args.length-1)
  const userOptions = args.at(-1)
  const options = {
    log: true,
    timeout: Cypress.config('defaultCommandTimeout'),
    nofail: activatorHandler.nofailIsActive(userOptions),
    ...userOptions
  }
  return [queryParams, options]
}

function intiateLog(queryParams, options, cmd) {
  let log
  if (queryConfig.handleLogging && !(options.log === false)) {
    log = cmd.get('logs')[0] || 
      Cypress.log({
        displayName: cmd.get('name'),
        message: queryParams.filter(Boolean),
        state: 'pending',
        timeout: options.timeout,
        consoleProps: () => ({}),
      })
  }
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

function invokeInnerFn(innerFn, subject, timedOut, errorHandler) {
  let $el = null
  let found = false

  /* skip innerFn if previous result was null */
  if (subject === null) {        
    return [$el, found]          
  } 

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
      /* its() or invoke() -
        if we reach here, there hasn't been an error 
        can just return result 
      */
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
  return [$el, found]
}

export function queryFactory(outerFn, ...args) {
  const [queryParams, options] = parseArgs(args)
  const cmd = cy.state('current')

  if (!options.nofail) {
    return outerFn.apply(cmd, args)   // normal call
  }

  /* 
    If this is a sub-query, e.g its() called internally by invoke()
    it should inherit the options.timeout of parent cmd
  */
  options.timeout = cmd.queryState?.options?.timeout || options.timeout

  /* Save query state to cmd */
  cmd.queryState = {
    ...cmd.queryState,
    queryId: ++queryConfig.queryId,
    options
  }

  let log = intiateLog(queryParams, options, cmd)
  const innerFn = invokeOuterFn(cmd, outerFn, queryParams, options)
  const caughtError = catchOnFailError(cmd)
  const expires = Date.now() + options.timeout

  const queryFn = function(subject) {
    const timedOut = Date.now() > expires
    const [$el, found] = invokeInnerFn(innerFn, subject, timedOut, cmd.queryState?.errorHandler)
    if (queryConfig.handleLogging) {   
      emitToCypressLog(log, queryParams, options, subject, $el, found, caughtError)
    }
    return subject === null ? null : $el
  }

  return queryFn
}

