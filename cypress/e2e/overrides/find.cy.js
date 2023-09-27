/// <reference types="cypress" />
// @ts-check

console.clear()

describe('cy.find()', () => {

  const asyncLoadDelay = 150
  const afterLoad = asyncLoadDelay+50
  const afterSpanLoads = (asyncLoadDelay*2)+50
  const beforeLoad = asyncLoadDelay-50
  const expectedText = `Appended after 2x ${asyncLoadDelay} ms`

  beforeEach(() => {
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:orange">Appended after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
      .appendChild(`<span id="added-after-2x-delay" style="color:red">Appended after 2x ${asyncLoadDelay} ms</span>`, asyncLoadDelay *2)
  })

  context('{nofail:true} option', () => {

    it('{nofail:true} causes a failing query to return null', () => {
      cy.get('#added-after-delay', {timeout:afterLoad})                
        .find('span', {nofail:true, timeout:beforeLoad})   
        .isNull()                            
    })

    it('a fail in a prior query propagates the null subject forward', () => {
      cy.get('#does-not-exist', {nofail:true, timeout:50})    
        .find('span', {nofail:true})   
        .isNull()                          
    })
    
    it('{nofail:true} does not change a passing query', () => {
      cy.get('#added-after-delay', {timeout:afterLoad})              
        .find('span', {nofail:true, timeout:afterSpanLoads})   
        .then($el => expect($el.text()).to.eq(expectedText))
    })

    it('{nofail:false} allows test to fail', (done) => {
      cy.on('fail', (error) => {
        const msg = 'Expected to find element: `span`, but never found it'
        assert(error.message.includes(msg), msg)
        done()
      })
      cy.get('#added-after-delay', {timeout:afterLoad})
        .find('span', {nofail:false, timeout:beforeLoad})  
    })
    
    it('nofail:false + null subject causes test to fail', (done) => {
      cy.on('fail', (error) => {
        const msg = 'failed because it requires a DOM element or document'
        assert(error.message.includes(msg), msg)
        done()
      })
      cy.get('#does-not-exist', {nofail:true, timeout:beforeLoad})
        .find('#does-not-exist', {nofail:false, timeout:50}) 
    })
  })

  context('Cypress.env("nofail", true) switch', () => {

    it('Cypress.env("nofail", true) causes a failing query to return null', () => {
      Cypress.env("nofail", true)
      cy.get('#added-after-delay', {timeout:afterLoad})
        .find('span', {timeout:beforeLoad})  
        .isNull() 
    })

    it('a fail in a prior query propagates the null subject forward', () => {
      Cypress.env("nofail", true)
      cy.get('#does-not-exist', {timeout:50})  
        .find('span', {timeout:afterLoad})           
        .should('eq', null)                   
    })
  
    it('Cypress.env("nofail", true) does not change a passing query', () => {
      Cypress.env("nofail", false)
      cy.get('#added-after-delay', {timeout:afterLoad})
        .find('span', {timeout:afterSpanLoads})
        .then($el => expect($el.text()).to.eq(expectedText))
    })

    it('Cypress.env("nofail", false) allows test to fail', (done) => {
      Cypress.env("nofail", false)
      cy.on('fail', (error) => {
        const msg = 'Expected to find element: `span`, but never found it'
        assert(error.message.includes(msg), msg)
        done()
      })
      cy.get('#added-after-delay', {timeout:afterLoad})
        .find('span', {timeout:beforeLoad})  
    })
    
    it('Cypress.env("nofail", false) and null subject allows test to fail', (done) => {
      Cypress.env("nofail", false)
      cy.on('fail', (error) => {
        const msg = 'failed because it requires a DOM element or document'
        assert(error.message.includes(msg), msg)
        done()
      })
      cy.wrap(null).find('span', {timeout:beforeLoad})
    })
  })
})
