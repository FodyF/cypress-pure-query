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

export function metaTests(fn, ...args) {
  Cypress.log({displayName: ' ', message: '\n', end: true})
  Cypress.log({displayName: 'Meta asserts:', message: '', end: true})
  fn(...args)
}

Cypress.Commands.add('metaTests', (fn) => {
  clickTestLogOpen()
  const metaTestsWrapper = cy.state('current')
  cy.then(() => {
    const chainerId = metaTestsWrapper.get('prev').get('chainerId')
    const chain = cy.queue.queueables.filter(cmd => cmd.get('chainerId') === chainerId)
    const lastQuery = chain.filter(cmd => cmd.get('type') !== 'assertion' ).slice(-1)[0]
    const subject = lastQuery.queryState?.$el
    const logs = logsInChain()
    metaTests(fn, {subject, lastQuery, chain, logs})
  })
  cy.then(() => Cypress.log({displayName: ' ', message: '\n', end: true}))
  cy.then(() => clickTestLogClosed())
})
