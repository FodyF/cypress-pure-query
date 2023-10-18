import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'

console.clear()

// @ts-ignore

describe('testing .its()', {defaultCommandTimeout: 200}, () => {

  beforeEach(() => {
    cy.activateLogging()
    cy.mount(`
      <div id="parent">
        <p>parent test</p>
        <div id="child">child text</div>
      </div>
    `)
  })

  it.only('{nofail:true} causes a failing query to return null', {defaultCommandTimeout:100}, () => {
    cy.get('#parent')
    .its('nonproperty', {nofail:true, nofailDefault: 0})
    .should('eq', 0)
    .metaTests(() => {
      expectLogText('get', '#parent')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'nonproperty (failed)')
      expectLogColor('~its', 'orange')
    })
  })

  it.only('normal function is not affected by nofail flag', {defaultCommandTimeout:100}, () => {
    cy.get('#parent')
    .its('length', {nofail:true})
    .should('eq', 1)
    .metaTests(() => {
      expectLogText('get', '#parent')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'length (failed)')
      expectLogColor('~its', 'orange')
    })
  })

  it('nofail before .its() skips', () => {
    cy.get('#invalid', {nofail:true})
      .its('length')
      .then(() => {
        expectLogText('~get', '#invalid (failed)')
        expectLogColor('~get', 'orange')
        expectLogText('~its', '(skipped)')
        expectLogColor('~its', 'orange')
      })
  })

  // it('nofail before .within() passes null as subject after .within()', () => {
  //   cy.get('#invalid', {nofail:true})
  //   .within(() => {
  //     cy.get('#child')
  //   })
  //   .isNull()
  //   .then(() => {
  //     expectLogText('~within', '(skipped)')
  //     expectLogColor('~within', 'orange')
  //   })
  // })
})