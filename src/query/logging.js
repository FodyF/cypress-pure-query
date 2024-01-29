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
 * @param {{ queryState: { shouldLog?: any; assertionPassed?: any; baseMessage?: any; error?: any; log?: any; $el?: any; found?: any; queryParams?: any; options?: any; }; }} cmd
 */
function cypressLog(cmd) {
  if (!cmd.queryState?.shouldLog) return

  try {
    const {log, $el, found, queryParams = [], options = {}} = cmd.queryState
    const passed = cmd.queryState?.assertionPassed || found
    const baseMessage = cmd.queryState.baseMessage
    const status = passed ? 'passed' : 'warned'
    const statusTag = passed ? '' : '**(failed)**'
    const error = found ? null : cmd.queryState.error?.toString()
    doLog(log, queryParams, options, $el, error, baseMessage, status, statusTag)
  } catch (error) {
    console.error('event:query:log', error.message)
  }
}

/**
 * @param {{ queryState: { shouldLog?: any; assertionPassed?: any; baseMessage?: any; log?: any; queryParams?: any; options?: any; }; }} cmd
 */
function cypressLogSkip(cmd) {
  if (!cmd.queryState?.shouldLog) return

  try {
    const {log, queryParams = [], options = {}} = cmd.queryState
    const passed = cmd.queryState?.assertionPassed
    const baseMessage = cmd.queryState?.baseMessage || queryParams?.filter(Boolean).join(', ').trim()
    const status = passed ? 'passed' : 'warned'
    const statusTag = '**(skipped)**'
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
    message: `${baseMessage} ${statusTag}`.trim(),
  })
}

export function activateLogging() {
  queryConfig.handleLogging = true  
  Cypress.removeAllListeners('query:log')
  Cypress.removeAllListeners('query:skip')
  Cypress.on('query:log', (cmd) => {
    cypressLog(cmd)
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
