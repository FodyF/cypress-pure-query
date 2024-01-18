
const {_} = Cypress

function updateQueryState(cmd, originalFn, args) {
  return Cypress.Promise.try(async function() {
    await originalFn.apply(this, args)
    cmd.queryState.assertionPassed = true
  })
  .catch(function() {
    cmd.queryState.assertionPassed = false
  })
}

function checkFail(cmd) {
  const {timedOut, assertionPassed} = cmd.queryState
  if (timedOut && assertionPassed === false) {
    throw cmd.queryState.error
  }
} 

async function shouldFnNofail(originalFn, ...args) {
  const cmd = cy.state('current')
  let nofail = cmd.queryState?.userOptions?.nofail

  /* normal call */
  if (!nofail) return originalFn.apply(this, args)  

  await updateQueryState(cmd, originalFn, args)
  checkFail(cmd)

  return originalFn.apply(this, args)
}

Cypress.Commands.overwrite('should', shouldFnNofail)
Cypress.Commands.overwrite('and', shouldFnNofail)
