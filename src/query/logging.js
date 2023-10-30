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
    const {queryParams, options, log, subject, $el, found, passed, baseMessage, caughtError} = progress
    const statusTag = subject === null ? ' **(skipped)**' : passed ? '' : ' **(failed)**'
    const error = subject === null ? new NullSubjectError() 
      : found ? null : caughtError.error?.toString()
    log?.set({
      displayName: `~${log.get('displayName').replace(/~/g,'')}`,
      type: 'query',
      $el,
      visible: true, 
      consoleProps: () => {
        return {
          selector: queryParams.join(', '),
          options,
          yielded: yieldForConsole($el),
          elements: $el?.length || 0,
          error,
        }
      },
      state: passed ? 'passed' : 'warned',
      ended: true, 
      message: `${baseMessage}${statusTag}`,
    })
  } catch (error) {
    console.error('event:query:log', error.message)
  }
}

export function activateLogging() {
  queryConfig.handleLogging = true
  Cypress.on('query:log', cypressLog)
}

Cypress.Commands.add('activateLogging', () => {
  queryConfig.handleLogging = true
  Cypress.on('query:log', cypressLog)
})

export function deactivateLogging() {
  queryConfig.handleLogging = false
  Cypress.removeAllListeners('query:log')
}
Cypress.Commands.add('deactivateLogging', () => {
  deactivateLogging()
})

/**
 * Used in queryFactory to emit data to the cypressLog handler
 * @param {Cypress.Log} log 
 * @param {String[]?} queryParams 
 * @param {Object?} options 
 * @param {Cypress.Chainable<any>?} subject 
 * @param {JQuery<any>?} $el 
 * @param {Boolean} found 
 * @param {Error} caughtError 
 */
export function emitToCypressLog(log, queryParams, options, subject, $el, found, caughtError) {
  Cypress.emit('query:log', {
    queryParams,
    options, 
    log, 
    subject, 
    $el, 
    found,
    passed: found, 
    baseMessage: queryParams?.filter(Boolean).join(', '),
    caughtError
  })
}
