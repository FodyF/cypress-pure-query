import {queryFactory} from '../query'
// @ts-check

const {_} = Cypress

Cypress.Commands.overwriteQuery('its', (originalFn, ...args) => {
  let [path, options = {}] = args  // ensure options

  /* Suppress: "cy.its() waited for the specified property ... to exist" */
  const errorHandler = (error) => {
    if (error.name === 'CypressError') { 
      return null
    } 
    throw error  
  }
  
  const cmd = cy.state('current')
  cmd.queryState = {
    ...cmd.queryState, 
    commandFn: originalFn.name,
    optionsFirst: false,
    errorHandler
  }

  const innerFn = queryFactory(originalFn, path, options)

  /* Allow a null return value */
  cmd.set('ensureExistenceFor', null)                          

  return (subject) => {
    const innerResult = innerFn(subject)
    return innerResult
  } 
})
