import {queryFactory} from '../query'
// @ts-check

Cypress.Commands.overwriteQuery('get', (originalFn, ...args) => {
  const [selector, options = {}] = args  // ensure options

  // Special handling non-existant alias
  if (selector.startsWith('@')) {
    const alias = (cy.state('aliases') || {})[selector.slice(1)]
    if (!alias) return () => null
  }

  return queryFactory(originalFn, selector, options)
})
