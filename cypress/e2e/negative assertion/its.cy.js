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

  it('failing its() passes with negative assertion', () => {
    cy.get('#test-element')
      .its('not-a-property', {nofail: true})
      .should('not.exist')

    cy.metaTests(({subject}) => {
      expect(subject).to.be.undefined
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'not-a-property')
      expectLogColor('~its', 'lightgray')
    })
  })

  it('passing its() fails with negative assertion', {defaultCommandTimeout:100}, (done) => {
    cy.on('fail', (error) => {
      const msg = "Timed out retrying after 600ms: expected 1 to not exist"
      assert(error.message.includes(msg), 'Correct error thrown')
      done()
    })
    cy.get('#test-element')
      .its('length', {nofail:true})
      .should('not.exist')
  })

  it('a fail in prev query skips .its()', () => {
    cy.get('#invalid', {nofail:true})
      .its('length', {nofail:true})
      .should('not.exist')

    cy.metaTests(({subject}) => {
      expectNullSubject(subject)
      expectLogText('~get', '#invalid (failed)')
      expectLogColor('~get', 'orange')
      expectLogText('~its', 'length (skipped)')
      expectLogColor('~its', 'lightgray')
    })
  })

})
