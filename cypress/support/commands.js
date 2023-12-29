import {clickTestLogOpen, clickTestLogClosed, logsInChain} from './log-helpers.js'
/// <reference types="cypress" />
// @ts-check

const {_} = Cypress

Cypress.Commands.add('isNull', {prevSubject:true}, (x) => {
  const message = x === null ? 'Subject is null' : `expected ${x} to be null`
  assert(x === null, message)
})

Cypress.Commands.add('isBody', {prevSubject:true}, ($el) => {
  assert($el[0] === cy.state('document').body, 'Subject is <body>')
})

export function metaTests(fn, subject, lastCmd) {
  Cypress.log({displayName: ' ', message: '\n', end: true})
  Cypress.log({displayName: 'Meta asserts:', message: '', end: true})
  fn(subject, lastCmd)
}

Cypress.Commands.add('metaTests', (fn) => {
  clickTestLogOpen()
  cy.then(() => {
    const lastCmd = cy.state('current').get('prev').get('prev')
    const subject = lastCmd.queryState?.$el
    const chain = cy.queue.queueables.filter(c => c.get('chainerId') === lastCmd.get('chainerId'))
    const logs = logsInChain()
    metaTests(fn, {subject, lastCmd, chain, logs})
  })
  cy.then(() => Cypress.log({displayName: ' ', message: '\n', end: true}))
  cy.then(() => clickTestLogClosed())
})

// Cypress.Commands.add('metaTests', {prevSubject: 'optional'}, (subject, fn) => {

//   if (!_.isFunction(fn)) {
//     fn = subject
//     subject = undefined
//   }
//   clickTestLogOpen()
//   cy.then(() => {
//     metaTests(fn, subject)
//   })
//   cy.then(() => Cypress.log({displayName: ' ', message: '\n', end: true}))
// })
