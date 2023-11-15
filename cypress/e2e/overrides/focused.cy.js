// @ts-check
console.clear()

describe('cy.focused', {defaultCommandTimeout:100}, () => {

  const asyncLoadDelay = 50

  beforeEach(() => {
    cy.mount('<div></div>')
      .appendChild('<input id="input1">', asyncLoadDelay)
  })

  context('{nofail:true} option', () => {

    it('{nofail:true} causes a failing query to return null', () => {
      cy.focused({nofail:true})
        .isNull()
    })

    it('{nofail:true} does not change a passing query', () => {
      cy.get('input').focus()
      cy.focused().should('have.attr', 'id', 'input1')
      cy.focused({nofail:true})
        .then($el => expect($el.attr('id')).to.eq('input1'))
    })

    it('{nofail:false} allows test to fail', (done) => {
      cy.on('fail', () => done())
      cy.focused({nofail:false})
    })
  })

  context('Cypress.env("nofail", true) switch', () => {

    it('Cypress.env("nofail", true) causes a failing query to return null', () => {
      Cypress.env("nofail", true)
      cy.focused()
        .isNull()
    })

    it('Cypress.env("nofail", true) does not change a passing query', () => {
      Cypress.env("nofail", true)
      cy.get('input').focus()
      cy.focused()
        .then($el => expect($el.attr('id')).to.eq('input1'))
    })

    it('Cypress.env("nofail", false) allows test to fail', (done) => {
      cy.on('fail', () => done())
      Cypress.env("nofail", false)
      cy.focused()
    })
  })
})
