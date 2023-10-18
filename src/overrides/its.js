import {queryFactory} from '../query'

Cypress.Commands.overwriteQuery('its', function (originalFn, ...args) {
  const [path, options = {}] = args  // ensure options
  return queryFactory(this, originalFn, path, options)
})
