/// <reference types="cypress" />
// @ts-check

export const mount = (html) => {
  const testEl = Cypress.$(html).filter((i,e) => e.nodeType === 1)  // elements only, filter out mounted textnodes 
  cy.$$('body').empty()
  cy.$$('body').append(testEl)
  // @ts-ignore
  return cy.noop(testEl).as('testElements')
}
Cypress.Commands.add('mount', mount)

const append = (subject, html, delay = 100) => {
  const testEl = Cypress.$(html).filter((i,e) => e.nodeType === 1)
  setTimeout(() => {
    subject.append(testEl)
  }, delay)
  // @ts-ignore
  return cy.noop(testEl).as('testElements')
}
Cypress.Commands.add('appendChild', {prevSubject:true}, append)

const after = (subject, html, delay = 100) => {
  const testEl = Cypress.$(html).filter((i,e) => e.nodeType === 1)
  setTimeout(() => {
    subject.after(testEl)
  }, delay)
  // @ts-ignore
  return cy.noop(testEl).as('testElements')
}
Cypress.Commands.add('appendAfter', {prevSubject:true}, after)

Cypress.Commands.add('isNull', {prevSubject:true}, (x) => expect(x).to.eq(null))
