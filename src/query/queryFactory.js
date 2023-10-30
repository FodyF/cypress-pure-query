import {activatorHandler} from './nofailActivator.js'
import {emitToCypressLog} from './logging.js'
const {queryConfig} = Cypress;

function catchOnFailError(testCtx) {
  const wrapper = {}
  const originalOnFail = testCtx.get('onFail')
  const onFailHandler = (err) => {
    originalOnFail && originalOnFail(err)
    wrapper.error = err
  }
  testCtx.set('onFail', onFailHandler)
  return wrapper
}

function parseParameters(args) {
  const queryParams = args.slice(0,args.length-1) 
  const userOptions = args.at(-1)
  const options = {...userOptions}
  options.log ??= true
  options.timeout ??= Cypress.config('defaultCommandTimeout')
  options.nofail = activatorHandler.nofailIsActive(userOptions)
  return [queryParams, options]
}

function intiateLog(queryParams, options, cmd) {
  let log
  if (queryConfig.handleLogging) {
    log = cy.state('current').attributes.logs[0] || 
      Cypress.log({
        displayName: `${cmd.get('name')}`,
        message: queryParams.filter(Boolean),
        state: 'pending',
        timeout: options.timeout,
        consoleProps: () => ({}),
      })
  } 
  return log
}

function invokeInnerFn(innerFn, subject, errorHandler) {
  let $el, found
  if (subject === null) {        // skip innerFn if previous result was null
    $el = null
    found = false
  } else {
    try {
      $el = innerFn(subject)   
      found = !!(Cypress.dom.isJquery($el) ? $el?.length : $el)
    } catch (error) {
      if (errorHandler) {
        $el = errorHandler(error)
        found = false
      } else {
        throw error
      }
    }
  }
  return [$el, found]
}

export function queryFactory(testCtx, outerFn, ...args) {
  const [queryParams, options] = parseParameters(args)

  if (!options.nofail) {
    return outerFn.apply(testCtx, [...queryParams, args.at(-1)])   // normal call
  }

  const cmd = cy.state('current')
  cmd.nofail = true                                  // for .within()
  const log = intiateLog(queryParams, options, cmd)

  const runnerOptions = {
    ...options, 
    timeout: options.timeout + queryConfig.runnerTimeoutBump,    // control timeout from here
    log: queryConfig.handleLogging ? false : options.log         // logging here only
  }
  const innerFn = outerFn.apply(testCtx, [...queryParams, runnerOptions])

  const caughtError = catchOnFailError(testCtx)

  const expires = Date.now() + options.timeout

  const queryFn = function(subject) {
    const timedOut = Date.now() > expires
    if (timedOut) {
      Cypress.emit('query:timedout')
    }

    const [$el, found] = invokeInnerFn(innerFn, subject, options.nofailErrorHandler)


       

    if (queryConfig.handleLogging) {
      emitToCypressLog(log, queryParams, options, subject, $el, found, caughtError)
    }

    // const failedOnTimeout = timedOut && !found
    // const defaultValue = options.nofailDefault !== undefined ? options.nofailDefault : null
    // return (failedOnTimeout || subject === null) ? defaultValue : $el

    
    return (timedOut || subject === null) ? null : $el
  }

  return queryFn
}
