// import {queryConfig} from '../index.js'
import {parseUserOptions, getRunnerOptions} from './queryOptions.js'
const {queryConfig} = Cypress;

// function getLog(cmd, queryConfig, queryParams, options) {
//   let log
//   if (queryConfig.queryLogging) {
//     log = cy.state('current').attributes.logs[0] || 
//       Cypress.log({
//         displayName: `${cmd.get('name')}`,
//         message: queryParams.filter(Boolean),
//         // message: $utils.stringify(_.compact([filter, text])),
//         state: 'pending',
//         timeout: options.timeout,
//         consoleProps: () => ({}),
//       })
//   } 
//   return log
// }

// function getArgs(args) {
  
//   function getOptions(userOptions = {}) {
//     const options = {...userOptions}
//     options.log ??= true
//     options.timeout ??= Cypress.config('defaultCommandTimeout')
//     options.nofail = isActive(userOptions)
//     return options
//   }

//   const queryParams = args.slice(0,args.length-1)
//   const userOptions = args.at(-1)
//   const options = getOptions(userOptions)
//   return {queryParams, options}
// }

export function queryFactory(testCtx, outerFn, ...args) {
  // const {queryParams, options} = getArgs(args)
  // if (!options.nofail) {
  //   return outerFn.apply(testCtx, [...queryParams, options]) 
  // }

  const queryId = ++queryConfig.queryId
  
  const queryParams = args.slice(0,args.length-1) 
  const userOptions = args.at(-1)
  const options = parseUserOptions(userOptions)
  if (!options.softFail) {
    return outerFn.apply(testCtx, [...queryParams, userOptions]) 
  }

  const cmd = cy.state('current')

  // const log = getLog(cmd, queryConfig, queryParams, options)
  let log
  if (queryConfig.handleLoggingInQuery) {
    log = cy.state('current').attributes.logs[0] || 
      Cypress.log({
        displayName: `${cmd.get('name')}`,
        message: queryParams.filter(Boolean),
        state: 'pending',
        timeout: options.timeout,
        consoleProps: () => ({}),
      })
  } 


  // //  bump up timeout to turn it off in Cypress
  // const optionsAdjusted = {...options, timeout: options.timeout + 500}
  // // const optionsAdjusted = {...options, timeout: options.timeout + 500, log: queryConfig.queryLogging ? false : options.log}

  // const innerFn = outerFn.apply(testCtx, [...queryParams, optionsAdjusted])
  const innerFn = outerFn.apply(testCtx, [...queryParams, getRunnerOptions(options)])



  const expires = Date.now() + options.timeout

  const emitToCypressLog = (log, subject, $el, found) => {
    Cypress.emit('query:log', {
      queryParams,
      options, 
      log, 
      subject, 
      $el, 
      found,
      passed: found, 
      baseMessage: queryParams.filter(Boolean).join(', '),
      caughtError
    })
  }


  const queryFn = function(subject) {
    const $el = subject === null ? null : innerFn(subject)    // skip innerFn if previous result was null
    const found = !!$el?.length
    const timedOut = Date.now() > expires    
    emitToCypressLog(log, subject, $el, found)
    return (timedOut && !found) || subject === null ? null : $el
  }

  return queryFn
}
