import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'

console.clear()

Cypress.Commands.add('isBody', {prevSubject:true}, ($el) => {
  assert($el[0] === cy.state('document').body, 'Subject is <body>')
})

describe('testing .within()', {defaultCommandTimeout: 200}, () => {

  beforeEach(() => {
    cy.activateLogging()
    cy.mount(`
      <div id="parent">
        <p>parent test</p>
        <div id="child">child text</div>
      </div>
    `)
  })

  it('nofail inside .within() callback works as expected', () => {
    cy.get('#parent').within(() => {
      cy.get('#child').contains('not this text', {nofail:true})
        .isNull()
    })
    
    cy.metaTests(({logs}) => {
      expect(logs).to.have.length(5)
      expectLogText('~contains', 'not this text (failed)')
      expectLogColor('~contains', 'orange')
    })
  })

  it('nofail before .within() passes <body> as subject inside .within()', () => {
    cy.get('#invalid', {nofail:true})
      .within(subject => {
        cy.wrap(subject).isBody()
      })

      cy.metaTests(({logs}) => {
        expect(logs).to.have.length(4)
        expectLogText('~get', '#invalid (failed)')
        expectLogColor('~get', 'orange')
        expectLogText('~within', '(skipped)')
        expectLogColor('~within', 'orange')
      })
  })

  it('nofail before .within() passes null as subject after .within()', () => {
    cy.get('#invalid', {nofail:true})
    .within(() => {
      cy.get('#child')
    })
    .isNull()

    cy.metaTests(({logs}) => {
      expect(logs).to.have.length(4)
      expectLogText('~within', '(skipped)')
      expectLogColor('~within', 'orange')
    })
  })
})
