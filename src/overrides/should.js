// import {shouldFn} from '../../_ref/cypress-should-fn.js'

const {_} = Cypress

Cypress.Commands.overwrite('should', async function (originalFn, ...args) {

  const cmd = cy.state('current')
  const nofail = cmd.queryState?.userOptions?.nofail
  if (!nofail) return originalFn.apply(this, args)  // normal call

  /*
    Send assertion result back to queryState of preceding command
  */
  const [subject, assertion, assertionValue] = args

  let result
  await Cypress.Promise.try(async function() {
    await originalFn(subject, assertion, assertionValue)    
    cmd.queryState.assertionPassed = true
    result = true
  })
  .catch(function(error) {
    cmd.queryState.assertionPassed = false
    result = false
  })

  return originalFn.apply(this, args)
})
