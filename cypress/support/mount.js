
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

const addToHead = (script) => {
  const head = cy.$$('body').prev() //cy.$$('head', parent.document)
  // console.log('head', head)
  head.append(script)
}
Cypress.Commands.add('addToHead', addToHead)
