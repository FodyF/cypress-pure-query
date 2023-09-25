import {queryFactory} from '../query'

Cypress.Commands.overwriteQuery('find', function (originalFn, ...args) {
  let [selector, options = {}] = args  // ensure options
  return queryFactory(this, originalFn, selector, options)
})
