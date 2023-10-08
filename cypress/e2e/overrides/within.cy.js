import {activateLogging} from '@src/query/logging.js'

console.clear()

// @ts-ignore
Cypress.Commands.add('isBody', {prevSubject:true}, ($el) => {
  assert($el[0] === cy.state('document').body, 'Subject is <body>')
})

describe('testing .within()', {defaultCommandTimeout: 200}, () => {

  console.log('logging', Cypress.queryConfig)
  beforeEach(() => {
    activateLogging()
    cy.mount(`
      <div id="parent">
        <p>parent test</p>
        <div id="child">child text</div>
      </div>
    `)
  })

  it('nofail inside .within() callback works as expected', {defaultCommandTimeout:100}, () => {
    cy.get('#parent').within(() => {
      cy.get('#child').contains('not this text', {nofail:true}).isNull()
    })
  })

  it('nofail before .within() passes <body> as subject inside .within()', () => {
    cy.get('#invalid', {nofail:true})
    .within(subject => {
      cy.wrap(subject).isBody()
    })
  })

  it('nofail before .within() passes null as subject after .within()', () => {
    cy.get('#invalid', {nofail:true})
    .within(() => {
      cy.get('#child')
    })
    .isNull()
  })


})