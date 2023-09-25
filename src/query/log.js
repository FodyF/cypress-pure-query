const {queryConfig, _, $} = Cypress
queryConfig.handleLoggingInQuery = true

class NullSubjectError extends Error {
  constructor(message) {
    super(message)
    this.name = "NullSubjectError"
  }
}

const yieldForConsole = ($el) => {
  return $el?.length > 1 ? $el.toArray() : 
    $el?.length === 1 ? $el.get(0) :
    '--nothing--'
}

Cypress.on('query:log', (progress) => {
  if (!queryConfig.handleLoggingInQuery) return

  try {
    const {queryParams, options, log, subject, $el, found, passed, baseMessage, caughtError} = progress
    const tag = subject === null ? ' **(skipped)**' : passed ? '' : ' **(failed)**'
    const error = subject === null ? new NullSubjectError() 
      : found ? null : caughtError.error?.toString()

    log?.set({
      displayName: `~${log.get('displayName').replace(/~/g,'')}`,
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
      message: `${baseMessage}${tag}`,
    })
  } catch (error) {
    console.error('event:query:log', error.message)
  }
})
