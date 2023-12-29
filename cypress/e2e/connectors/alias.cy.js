// @ts-check
console.clear()

describe('cy.alias', () => {
  
  const asyncLoadDelay = 150
  const afterLoad = asyncLoadDelay+100
  const beforeLoad = asyncLoadDelay-100
  const expectedText = `Appended after ${asyncLoadDelay} ms`

  beforeEach(() => {
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:red">Appended after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
  })

  context('{nofail:true} option', () => {

    it('{nofail:true} causes a failing query to return null', () => {
      cy.get('#does-not-exist', {nofail:true, timeout:50}).as('alias')
      cy.get('@alias').isNull()
    })

    it('{nofail:true} does not change a passing query', () => {
      cy.get('#added-after-delay', {nofail:true, timeout:afterLoad}).as('alias')
      cy.get('@alias')
        .then($el => {
          console.log($el)
          expect($el.text()).to.eq(expectedText)
        })
    })
  })

  context('Cypress.env("nofail", true) switch', () => {

    it('Cypress.env("nofail", true) causes a failing query to return null', () => {
      Cypress.env("nofail", true)
      cy.get('#does-not-exist', {timeout:beforeLoad}).as('alias')
      cy.get('@alias').isNull()
    })

    it('Cypress.env("nofail", true) does not change a passing query', () => {
      Cypress.env("nofail", true)
      cy.get('#added-after-delay', {timeout:afterLoad}).as('alias')
      cy.get('@alias').then($el => expect($el.text()).to.eq(expectedText))
    })
  })

  context('detached elements', () => {

    beforeEach(() => {
      Cypress.env("nofail", false)
    })

    it('{nofail:true} causes a failing alias re-query to return null', () => {
      cy.get('#added-after-delay', {nofail:true, timeout:afterLoad})
        .as('alias')
        .then($el => $el.remove())

      cy.get('@alias').isNull()
    }) 

    it('{nofail:false} allows a failing alias re-query to fail', (done) => {
      cy.on('fail', () => done())
      cy.get('#added-after-delay', {nofail:false, timeout:afterLoad})
        .as('alias')
        .then($el => $el.remove())

      cy.get('@alias', {timeout:afterLoad}).isNull()
    }) 
  })
})
