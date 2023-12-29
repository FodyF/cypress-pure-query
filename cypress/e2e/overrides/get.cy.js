/// <reference types="cypress" />
// @ts-check

console.clear()

describe('cy.get', () => {

  const asyncLoadDelay = 300
  const afterLoad = asyncLoadDelay+50
  const beforeLoad = asyncLoadDelay-100
  const expectedText = `Appended after ${asyncLoadDelay} ms`

  beforeEach(() => {
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:red">Appended after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
  })
  
  context('{nofail:true} option', () => {

    it('{nofail:true} causes a failing query to return null', () => {
      cy.get('#added-after-delay', {nofail:true, timeout:beforeLoad}).isNull()
      cy.get('#does-not-exist', {nofail:true, timeout:50}).isNull()
    })

    it('{nofail:true} does not change a passing query', () => {
      cy.get('#added-after-delay', {nofail:true, timeout:afterLoad})
        .should($el => expect($el.text()).to.eq(expectedText))
    })

    it('{nofail:false} allows test to fail', (done) => {
      cy.on('fail', () => done())
      cy.get('#does-not-exist', {nofail:false, timeout:50})
    })
  })

  context('Cypress.env("nofail", true) switch', () => {

    beforeEach(() => {
      Cypress.env("nofail", true)
    })

    it('Cypress.env("nofail", true) causes a failing query to return null', () => {
      cy.get('#added-after-delay', {timeout:beforeLoad}).isNull()
      cy.get('#does-not-exist', {timeout:50}).isNull()
    })

    it('Cypress.env("nofail", true) does not change a passing query', () => {
      cy.get('#added-after-delay', {timeout:afterLoad})
        .should($el => expect($el.text()).to.eq(expectedText))
    })

    it('Cypress.env("nofail", false) allows test to fail', (done) => {
      cy.on('fail', () => done())
      cy.get('#added-after-delay', {timeout:afterLoad})
        .then($el => expect($el.text()).to.eq('Not the text'))
    })
  })

  context('negative assertion', () => {

    it('a negative assertion should give passing query', () => {
      cy.get('#added-after-delay', {nofail:true, timeout:beforeLoad})
        .should('not.exist')

      cy.get('#does-not-exist', {nofail:true, timeout:50})
        .should('not.exist')
    })
  })
})
