// import {registerActivator, activators, resetActivators} from '@src/query'
import * as src from '@src/index'
const {registerActivator, activators, resetActivators} = src

console.clear()

beforeEach(() => {
  resetActivators()
})

it('adds a named activator to the handler', () => {
  assert(Object.keys(activators).length === 2, 'Initially two activators')
  const newActivator = () => {} 
  registerActivator(newActivator)
  assert(Object.keys(activators).length === 3, 'Now three activators')
  assert(activators['newActivator'], 'New named activator in map')
})

it('adds an anonymous activator to the handler', () => {
  assert(Object.keys(activators).length === 2, 'Initially two activators')
  registerActivator(() => {})
  assert(Object.keys(activators).length === 3, 'Now three activators')
  assert(activators['activator2'], 'New named activator in map')
})

it('does not add same named activator twice', () => {
  assert(Object.keys(activators).length === 2, 'Initially two activators')
  const newActivator = () => {} 
  registerActivator(newActivator)
  registerActivator(newActivator)
  assert(Object.keys(activators).length === 3, 'Now three activators')
})

it('previously loaded query sees new activator', () => {
  const alwaysOn = () => true 
  registerActivator(alwaysOn)

  cy.get('#doesnotexist', {timeout: 100})  
    .isNull()
})

