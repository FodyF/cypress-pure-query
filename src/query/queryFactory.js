
let activators = [
  (options) => options.nofail,      
  () => Cypress.env('nofail'),    
]

function isActive(options) {
  return activators.some(activator => activator(options))
}

function getOptions(userOptions = {}) {
  const options = {...userOptions}
  options.log ??= true
  options.timeout ??= Cypress.config('defaultCommandTimeout')
  options.nofail = isActive(userOptions)
  return options
}

function getArgs(args) {
  const queryParams = args.slice(0,args.length-1)
  const userOptions = args.at(-1)
  const options = getOptions(userOptions)
  return {queryParams, options}
}

export function queryFactory(testCtx, outerFn, ...args) {
  const {queryParams, options} = getArgs(args)
  if (!options.nofail) {
    return outerFn.apply(testCtx, [...queryParams, options]) 
  }

  //  bump up timeout to turn it off in Cypress
  const optionsAdjusted = {...options, timeout: options.timeout + 500, log:false}
  const innerFn = outerFn.apply(testCtx, [...queryParams, optionsAdjusted])
  const expires = Date.now() + options.timeout

  const queryFn = function(subject) {
    const $el = subject === null ? null : innerFn(subject)    // skip innerFn if previous result was null
    const found = !!$el?.length
    const timedOut = Date.now() > expires    
    return (timedOut && !found) || subject === null ? null : $el
  }

  return queryFn
}
