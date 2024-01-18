// @ts-check

const originalFn = cy.commandFns.within

function withinNofail(...args) {
  let [subject, options = {}, fn] = args  // ensure options

  let userOptions = options
  if (Cypress._.isUndefined(fn)) {
    fn = userOptions
    userOptions = {}
  }
  options = Cypress._.defaults({}, userOptions, { log: true })

  const cmd = cy.state('current')
  const prevCmd = cmd.get('prev')
  const prevCmdNofail = prevCmd.queryState?.userOptions?.nofail
  const skippingNullSubject = subject === null && prevCmdNofail
  const withinScope = skippingNullSubject ? cy.$$('body') : subject
  originalFn(withinScope, options, fn)

  if (skippingNullSubject && Cypress.queryConfig.handleLogging) {
    const log = cy.state('current').attributes.logs[0]
    log.set({
      displayName: '~within',
      type: 'skipped',
      ended: true,
      state: 'warned',
    })
    Cypress.emit('query:skip', {
      cmd,
      queryParams: [],
      options, 
      log, 
    })
  }
  return subject
}

/* Cypress.Commands.overwrite() does not seem to work for within() */
cy.addCommand({
  name: 'within',
  fn: withinNofail,
  type: 'child',
  prevSubject: ['element', 'document', null]
})
