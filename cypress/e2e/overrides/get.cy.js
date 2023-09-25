/// <reference types="cypress" />
// @ts-check

// console.clear()

describe('cy.get', () => {

  const asyncLoadDelay = 150
  const afterLoad = asyncLoadDelay+50
  const beforeLoad = asyncLoadDelay-50
  const expectedText = `Appended after ${asyncLoadDelay} ms`

  function isNull(x) {
    expect(x).to.eq(null)
  }

  beforeEach(() => {
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:red">Appended after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
  })

  context('{nofail:true} option', () => {

    it('{nofail:true} causes a failing query to return null', () => {
      cy.get('#added-after-delay', {nofail:true, timeout:beforeLoad})
        .then(isNull)
      cy.get('#does-not-exist', {nofail:true, timeout:50})
        .then(isNull)
    })

    it('{nofail:true} does not change a passing query', () => {
      cy.get('#added-after-delay', {nofail:true, timeout:afterLoad})
        .then($el => expect($el.text()).to.eq(expectedText))
    })

    it('{nofail:false} allows test to fail', (done) => {
      cy.on('fail', () => done())
      cy.get('#does-not-exist', {nofail:false, timeout:50})
    })
  })

  context('Cypress.env("nofail", true) switch', () => {

    it('Cypress.env("nofail", true) causes a failing query to return null', () => {
      Cypress.env("nofail", true)
      cy.get('#added-after-delay', {timeout:beforeLoad}).then(isNull)
      cy.get('#does-not-exist', {timeout:50}).then(isNull)
    })

    it('Cypress.env("nofail", true) does not change a passing query', () => {
      Cypress.env("nofail", true)
      cy.get('#added-after-delay', {timeout:afterLoad})
        .then($el => expect($el.text()).to.eq(expectedText))
    })

    it('Cypress.env("nofail", false) allows test to fail', (done) => {
      cy.on('fail', () => done())
      Cypress.env("nofail", false)
      cy.get('#added-after-delay', {timeout:afterLoad})
        .then($el => expect($el.text()).to.eq('Not the text'))
    })
  })
})
