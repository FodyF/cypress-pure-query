/// <reference types="cypress" />
// @ts-check

console.clear()

describe('cy.contains', () => {

  const asyncLoadDelay = 150
  const afterLoad = asyncLoadDelay+100
  const expectedText = `Added after ${asyncLoadDelay} ms`

  beforeEach(() => {
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:orange">Added after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
      .appendChild(`<span id="added-after-2x-delay" style="color:red">Added after 2x ${asyncLoadDelay} ms</span>`, asyncLoadDelay *2)
  })

  context('{nofail:true} query option', () => {

    it('{nofail:true} causes a failing query to return null', () => {
      cy.contains('#added-after-delay', 'not this text', {nofail:true, timeout:afterLoad}).isNull()
      cy.get('#added-after-delay').contains('not this text', {nofail:true, timeout:afterLoad}).isNull()
    })

    it('a fail in a prior query propagates the null subject forward', () => {
      cy.get('#does-not-exist', {nofail:true, timeout:50})
        .contains('this will be skipped', {nofail:true})
        .isNull()
    })  

    it('{nofail:true} does not change a passing query', () => {

      cy.contains('#added-after-delay', expectedText, {nofail:true, timeout:afterLoad})
        .then($el => expect($el.text()).to.eq(expectedText))

      cy.get('#added-after-delay')
        .contains(expectedText, {nofail:true, timeout:afterLoad})
        .then($el => expect($el.text()).to.eq(expectedText))
    })

    it('{nofail:false} allows test to fail (syntax 1)', (done) => {
      cy.on('fail', (error) => {
        const msg = "Expected to find content: 'Not the text'"
        assert(error.message.includes(msg), 'Correct error thrown')
        done()
      })
      cy.contains('#added-after-delay', 'Not the text', {nofail:false, timeout:afterLoad})
    })

    it('{nofail:false} allows test to fail (syntax 2)', (done) => {
      cy.on('fail', (error) => {
        const msg = "Expected to find content: 'Not the text'"
        assert(error.message.includes(msg), 'Correct error thrown')
        done()
      })
      cy.get('#added-after-delay', {timeout:afterLoad})
        .contains('Not the text', {nofail:false, timeout:50})
    })
  })

  context('Cypress.env("nofail", true) switch', () => {

    it('Cypress.env("nofail", true) causes a failing query to return null', () => {
      Cypress.env("nofail", true)
      cy.contains('#added-after-delay', 'not this text', {timeout:afterLoad}).isNull()
      cy.get('#added-after-delay', {timeout:afterLoad})
        .contains('not-this-text', {timeout:afterLoad})
        .isNull()
    })
    
    it('Cypress.env("nofail", true) applies to the whole chain', () => {
      Cypress.env("nofail", true)
      cy.get('#not-present', {timeout:50})
        .contains('this will be skipped')
    })
    
    it('a fail in a prior query propagates the null subject forward', () => {
      Cypress.env("nofail", true)
      cy.get('#not-present', {timeout:50})     // this yields null
        .contains('this will be skipped')      // this does not evaluate, 
        .isNull()                             // but passes on the null subject
    })

    it('Cypress.env("nofail", true) does not change a passing query', () => {
      Cypress.env("nofail", true)
      cy.contains('#added-after-delay', expectedText, {timeout:afterLoad})
        .then($el => expect($el.text()).to.eq(expectedText))
    })

    it('Cypress.env("nofail", false) allows test to fail (syntax 1)', (done) => {
      Cypress.env("nofail", false)
      cy.on('fail', (error) => {
        const msg = "Expected to find content: 'Not the text'"
        assert(error.message.includes(msg), 'Correct error thrown')
        done()
      })
      cy.contains('#added-after-delay', 'Not the text', {timeout:afterLoad})
    })

    it('Cypress.env("nofail", false) allows test to fail (syntax 2)', (done) => {
      Cypress.env("nofail", false)
      cy.on('fail', (error) => {
        const msg = "Expected to find content: 'Not the text'"
        assert(error.message.includes(msg), 'Correct error thrown')
        done()
      })
      cy.get('#added-after-delay', {timeout:afterLoad})
        .contains('Not the text', {timeout:50})
    })
  })
})
