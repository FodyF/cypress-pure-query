import {expectLogText, expectLogColor, expectNullSubject} from '@cypress/support/log-helpers.js'

// @ts-check

console.clear()

context('testing .its()', {defaultCommandTimeout: 200}, () => {

  beforeEach(() => {
    cy.activateLogging()
    cy.mount(`
      <div id="test-element">Element text</div>
    `)
  })

  it('{nofail:true} causes a failing query to return null', () => {
    cy.get('#test-element')
      .its('not-a-property', {nofail: true})

    cy.metaTests(({subject}) => {
      expectNullSubject(subject)
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'not-a-property (failed)')
      expectLogColor('~its', 'orange')
    })
  })

  it('a passing its() query is not affected by nofail flag', {defaultCommandTimeout:100}, () => {
    cy.get('#test-element')
      .its('length', {nofail:true})

    cy.metaTests(({subject}) => {
      expect(subject).to.eq(1)
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'length')
      expectLogColor('~its', 'lightgray')
    })
  })

  it('a fail in prev query skips .its()', () => {
    cy.get('#invalid', {nofail:true})
      .its('length', {nofail:true})

    cy.metaTests(({subject}) => {
      expectNullSubject(subject)
      expectLogText('~get', '#invalid (failed)')
      expectLogColor('~get', 'orange')
      expectLogText('~its', 'length (skipped)')
      expectLogColor('~its', 'orange')
    })
  })
})
