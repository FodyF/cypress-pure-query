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

/**
 * @param {{ 
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
  if (!queryConfig.handleLogging) return

  try {
    const {queryParams, options, log, $el, found, passed, baseMessage, caughtError} = progress
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
*   queryParams: String[]?; 
*   options: Object?; 
*   log: Cypress.QueryLog; 
* }} progress
*/
function cypressLogSkip(progress) {
  if (!queryConfig.handleLogging) return

  try {
    const {queryParams, options, log} = progress
    const baseMessage = queryParams?.filter(Boolean).join(', ')
    const status = 'warned'
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
  Cypress.on('query:log', cypressLog)
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

/**
 * Used in queryFactory to emit data to the cypressLog handler
 * @param {Cypress.Log} log 
 * @param {String[]?} queryParams 
 * @param {Object?} options 
 * @param {any?} $el 
 * @param {Boolean} found 
 * @param {Error} caughtError 
 */
export function emitToCypressLog(log, queryParams, options, $el, found, caughtError) {
  Cypress.emit('query:log', {
    queryParams,
    options, 
    log, 
    $el, 
    found,
    passed: found, 
    baseMessage: queryParams?.filter(Boolean).join(', '),
    caughtError
  })
}
/**
 * Used in queryFactory to log query as skipped
 * @param {Cypress.Log} log 
 * @param {String[]?} queryParams 
 * @param {Object?} options 
 */
export function emitToCypressLogSkip(log, queryParams, options) {
  Cypress.emit('query:skip', {
    queryParams,
    options, 
    log, 
  })
}