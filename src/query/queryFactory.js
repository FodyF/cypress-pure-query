import {parseUserOptions, getRunnerOptions} from './queryOptions.js'
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

export function queryFactory(testCtx, outerFn, ...args) {

  const queryParams = args.slice(0,args.length-1) 
  const userOptions = args.at(-1)
  const options = parseUserOptions(userOptions)
  if (!options.nofail) {
    return outerFn.apply(testCtx, [...queryParams, userOptions]) 
  }

  const cmd = cy.state('current')
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

  const innerFn = outerFn.apply(testCtx, [...queryParams, getRunnerOptions(options)])
  const caughtError = catchOnFailError(testCtx)
  const expires = Date.now() + options.timeout

  const queryFn = function(subject) {

    const $el = subject === null ? null : innerFn(subject)    // skip innerFn if previous result was null
    const found = !!$el?.length
    const timedOut = Date.now() > expires

    queryConfig.handleLogging && emitToCypressLog(log, queryParams, options, subject, $el, found, caughtError)

    const failedOnTimeout = timedOut && !found
    const defaultValue = options.nofailDefault !== undefined ? options.nofailDefault : null
    return (failedOnTimeout || subject === null) ? defaultValue : $el
  }

  return queryFn
}
