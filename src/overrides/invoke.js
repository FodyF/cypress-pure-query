import {queryFactory} from '../query'
// @ts-check

const {_} = Cypress

Cypress.Commands.overwriteQuery('invoke', (originalFn, ...args) => {
  let [options, path, functionArgs] = args

  if (!_.isObject(options)) {
    functionArgs = path
    path = options
    options = {}
  }
 
  const cmd = cy.state('current')
  cmd.queryState = { 
    ...cmd.queryState,
    commandFn: originalFn.name,
    optionsFirst: true,
  }  

  const innerFn = queryFactory(originalFn, path, functionArgs, options)

  return (subject) => {
    const innerResult = innerFn(subject)
    return innerResult
  } 
})
