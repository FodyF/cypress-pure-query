// @ts-check
import {activatorHandler} from './nofailActivator.js'

const {queryConfig} = Cypress;

/**
 * @param {{ timeout?: Number; log?: Boolean;  nofail?: Boolean; }} [userOptions] 
 */
export function parseUserOptions(userOptions = {}) {
  const options = {...userOptions}
  options.log ??= true
  options.timeout ??= Cypress.config('defaultCommandTimeout')
  options.nofail = activatorHandler.nofailIsActive(userOptions)
  return options
}

/**
 * @param {{ timeout?: any; log?: any; }} [options]
 */
export function getRunnerOptions(options) {
  return {
    ...options, 
    timeout: options.timeout + queryConfig.runnerTimeoutBump, 
    log: queryConfig.handleLogging ? false : options.log
  }
}
