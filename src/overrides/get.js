import {queryFactory} from '../query/queryFactory'

Cypress.Commands.overwriteQuery('get', function (originalFn, ...args) {
  const [selector, options = {}] = args  // ensure options

  // Special handling non-existant alias
  if (selector.startsWith('@')) {
    const alias = (cy.state('aliases') || {})[selector.slice(1)]
    if (!alias) return () => null
  }

  return queryFactory(this, originalFn, selector, options)
})
