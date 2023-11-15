import {clickTestLogOpen} from './log-helpers.js'

/// <reference types="cypress" />
// @ts-check

Cypress.Commands.add('isNull', {prevSubject:true}, (x) => {
  const message = x === null ? 'Subject is null' : `expected ${x} to be null`
  assert(x === null, message)
})

Cypress.Commands.add('isBody', {prevSubject:true}, ($el) => {
  assert($el[0] === cy.state('document').body, 'Subject is <body>')
})

export function metaTests(fn) {
  Cypress.log({displayName: ' ', message: '\n', end: true})
  Cypress.log({displayName: 'Meta asserts:', message: '', end: true})
  fn()
}

Cypress.Commands.add('metaTests', (fn) => {
  clickTestLogOpen()
  cy.then(() => {
    metaTests(fn)
  })
  cy.then(() => Cypress.log({displayName: ' ', message: '\n', end: true}))
})
