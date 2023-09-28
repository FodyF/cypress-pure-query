import {queryFactory} from '../query'

Cypress.Commands.overwriteQuery('focused', function (originalFn, ...args) {
  const [options = {}] = args  // ensure options
  return queryFactory(this, originalFn, options)
})
