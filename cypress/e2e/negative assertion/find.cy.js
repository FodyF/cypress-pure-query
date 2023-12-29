import {expectLogText, expectLogColor, expectNotLogged} from '@cypress/support/log-helpers.js'
/// <reference types="cypress" />
// @ts-check

console.clear()

describe('cy.find()', () => {

  const asyncLoadDelay = 150
  const afterLoad = asyncLoadDelay+100
  const beforeLoad = asyncLoadDelay-100

  beforeEach(() => {
    cy.activateLogging()
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:orange">Appended after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
      .appendChild(`<span id="added-after-2x-delay" style="color:red">Appended after 2x ${asyncLoadDelay} ms</span>`, asyncLoadDelay *2)
  })

  it('a negative css assertion on a timed-out element', () => {
    cy.get('#added-after-delay', {timeout:afterLoad})                
      .find('span', {nofail:true, timeout:beforeLoad})   
      .should('not.exist')   
      
    cy.metaTests(({logs}) => {
      expect(logs.length).to.eq(3)
      expectLogText('~find', 'span')
      expectLogColor('~find', 'lightgray')
    })
  })
  
  it('a negative callback assertion on a timed-out element', () => {
    cy.get('#added-after-delay', {timeout:afterLoad})              
      .find('span', {nofail:true, timeout:beforeLoad})   
      .should($el => expect($el).to.not.exist)

    cy.metaTests(({logs}) => {
      expect(logs.length).to.eq(3)
      expectLogText('~find', 'span')
      expectLogColor('~find', 'lightgray')
    })
  })

  it('prior query failing allows negative assertion to pass the find query', () => {
    cy.get('#does-not-exist', {nofail:true, timeout:50})    
      .find('span', {nofail:true})   
      .should('not.exist')          
      
    cy.metaTests(({logs}) => {
      expect(logs.length).to.eq(3)
      expectLogText('~get', '#does-not-exist (failed)')
      expectLogColor('~get', 'orange')
      expectLogText('~find', 'span (skipped)')
      expectLogColor('~find', 'lightgray')
    })
  })

  it('{nofail:false} allows negative assertion to pass the find query', () => {
    cy.get('#added-after-delay', {timeout:afterLoad})
      .find('span', {nofail:false, timeout:beforeLoad})  
      .should('not.exist')   

    cy.metaTests(({logs}) => {
      expect(logs.length).to.eq(3)
      expectLogText('find', 'span')
      expectLogColor('find', 'lightgray')
    })
  })
})
