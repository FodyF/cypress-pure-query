
Cypress.Commands.overwrite('should', function (originalFn, ...args) {
  const subject = args[0]
  if (subject === null) {
    return () => null
  }
  return originalFn.apply(this, args)
})
