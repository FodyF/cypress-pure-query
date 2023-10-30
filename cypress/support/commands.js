import {clickTestLogOpen} from './log-helpers.js'

/// <reference types="cypress" />
// @ts-check

export const mount = (html) => {
  const testEl = Cypress.$(html).filter((i,e) => e.nodeType === 1)  // elements only, filter out mounted textnodes 
  cy.$$('body').empty()
  cy.$$('body').append(testEl)
  // @ts-ignore - noop not exposed by Cypress
  return cy.noop(testEl).as('testElements')
}
Cypress.Commands.add('mount', mount)

const append = (subject, html, delay = 0) => {
  const testEl = Cypress.$(html).filter((i,e) => e.nodeType === 1)
  setTimeout(() => {
    subject.append(testEl)
  }, delay)
  // @ts-ignore - noop not exposed by Cypress
  return cy.noop(testEl).as('testElements')
}
Cypress.Commands.add('appendChild', {prevSubject:true}, append)

const after = (subject, html, delay = 0) => {
  const testEl = Cypress.$(html).filter((i,e) => e.nodeType === 1)
  setTimeout(() => {
    subject.after(testEl)
  }, delay)
  // @ts-ignore - noop not exposed by Cypress
  return cy.noop(testEl).as('testElements')
}
Cypress.Commands.add('appendAfter', {prevSubject:true}, after)

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
