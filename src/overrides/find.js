import {queryFactory} from '../query'
// @ts-check

Cypress.Commands.overwriteQuery('find', (originalFn, ...args) => {
  let [selector, options = {}] = args  // ensure options
  return queryFactory(originalFn, selector, options)
})
