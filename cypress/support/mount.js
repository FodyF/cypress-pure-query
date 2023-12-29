
/// <reference types="cypress" />
// @ts-check

export const mount = (html) => {
  const testEl = Cypress.$(html).filter((i,e) => e.nodeType === 1)  // elements only, filter out mounted textnodes 
  cy.$$('body').empty()
  cy.$$('body').append(testEl)
  return cy.wrap(testEl, {log:false}).as('testElements')
}
Cypress.Commands.add('mount', mount)

const append = (subject, html, delay = 0) => {
  const testEl = Cypress.$(html).filter((i,e) => e.nodeType === 1)
  setTimeout(() => {
    subject.append(testEl)
  }, delay)
  return cy.wrap(testEl, {log:false}).as('testElements')
}
Cypress.Commands.add('appendChild', {prevSubject:true}, append)

const after = (subject, html, delay = 0) => {
  const testEl = Cypress.$(html).filter((i,e) => e.nodeType === 1)
  setTimeout(() => {
    subject.after(testEl)
  }, delay)
  return cy.wrap(testEl, {log:false}).as('testElements')
}
Cypress.Commands.add('appendAfter', {prevSubject:true}, after)
