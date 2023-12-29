/// <reference types="cypress" />
// @ts-check

const {queryConfig, _, $} = Cypress

class NullSubjectError extends Error {
  constructor(message) {
    super(message)
    this.name = "NullSubjectError"
  }
}

const yieldForConsole = ($el) => {
  return Cypress.dom.isJquery($el) ? ($el.length > 1 ? $el.toArray() : $el.get(0))
    : $el || '--nothing--'
}

export function shouldLog(cmd, queryConfig) {
  return queryConfig.handleLogging && cmd.queryState?.userOptions?.log !== false
}

/**
 * @param {{ 
 *   cmd: Cypress.Query,
 *   queryParams: String[]?; 
 *   options: Object?; 
 *   log: Cypress.QueryLog; 
 *   subject: Cypress.Chainable<any>?; 
 *   $el: JQuery<any>?; 
 *   found: Boolean; 
 *   passed: Boolean; 
 *   baseMessage: string; 
 *   caughtError: { error?: Error}; 
 * }} progress
 */
function cypressLog(progress) {
  const {cmd, queryParams, options, log, $el, found, passed, caughtError} = progress
  const baseMessage = cmd.queryState.baseMessage

  if (!shouldLog(cmd, queryConfig)) return

  try {
    const statusTag = passed ? '' : ' **(failed)**'
    const error = found ? null : caughtError.error?.toString()
    const status = passed ? 'passed' : 'warned'
    doLog(log, queryParams, options, $el, error, baseMessage, status, statusTag)
  } catch (error) {
    console.error('event:query:log', error.message)
  }
}
/**
 * @param {{ 
  *   cmd: Cypress.Query,
  *   queryParams: String[]?; 
  *   options: Object?; 
  *   log: Cypress.QueryLog; 
  * }} progress
*/
function cypressLogSkip(progress) {
  const {cmd, queryParams, options, log} = progress
  if (!shouldLog(cmd, queryConfig)) return

  try {
    const passed = cmd.queryState?.assertionPassed
    const baseMessage = cmd.queryState?.baseMessage || queryParams?.filter(Boolean).join(', ')
    const status = passed ? 'passed' : 'warned'
    const statusTag = ' **(skipped)**'
    const error = new NullSubjectError() 
    const $el = null
    doLog(log, queryParams, options, $el, error, baseMessage, status, statusTag)
  } catch (error) {
    console.error('event:query:skip', error.message)
  }
}

function doLog(log, queryParams, options, $el, error, baseMessage, status, statusTag) {
  const name = log?.get('displayName') || log?.get('name')
  log?.set({
    displayName: `~${name.replace(/~/g,'')}`,
    type: 'query',
    $el,
    visible: true, 
    consoleProps: () => {
      return {
        selector: queryParams.join(', '),
        options,
        yielded: yieldForConsole(null),
        elements: 0,
        error,
      }
    },
    state: status,
    ended: true, 
    message: `${baseMessage}${statusTag}`,
  })
}

export function activateLogging() {
  queryConfig.handleLogging = true  
  Cypress.removeAllListeners('query:log')
  Cypress.removeAllListeners('query:skip')
  Cypress.on('query:log', (progress) => {
    cypressLog(progress)
  })
  Cypress.on('query:skip', cypressLogSkip)
}
Cypress.Commands.add('activateLogging', () => {
  activateLogging()
})

export function deactivateLogging() {
  queryConfig.handleLogging = false
  Cypress.removeAllListeners('query:log')
  Cypress.removeAllListeners('query:skip')
}
Cypress.Commands.add('deactivateLogging', () => {
  deactivateLogging()
})
