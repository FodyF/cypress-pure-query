import {queryFactory} from '../query'
// @ts-check

Cypress.Commands.overwriteQuery('focused', (originalFn, ...args) => {
  const [options = {}] = args  // ensure options
  return queryFactory(originalFn, options)
})
