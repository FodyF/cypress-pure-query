import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'

console.clear()

const asyncLoadDelay = 300
const afterLoad = asyncLoadDelay+50
const beforeLoad = asyncLoadDelay-100

context('get', () => {

  beforeEach(() => {
    cy.activateLogging()
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:orange">Added after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
      .appendChild(`<span id="added-after-2x-delay" style="color:red">Added after 2x ${asyncLoadDelay} ms</span>`, asyncLoadDelay *2)
  })


  it('a negative css assertion on a non-existing element', () => {
    cy.get('#does-not-exist', {nofail:true, timeout:50})
      .should('not.exist')

    cy.metaTests(({logs}) => {
      expect(logs.length).to.eq(2)
      expectLogText('~get', '#does-not-exist')
      expectLogColor('~get', 'lightgray')
    })
  })
  
  it('a negative callback assertion on a non-existing element', () => {
    cy.get('#does-not-exist', {nofail:true, timeout:100})
      .should($el => expect($el).to.not.exist)

    cy.metaTests(({logs}) => {
      expect(logs.length).to.eq(2)
      expectLogText('~get', '#does-not-exist')
      expectLogColor('~get', 'lightgray')
    })
  })

  it('a negative css assertion on a timed-out element', () => {
    cy.get('#added-after-delay', {nofail:true, timeout:beforeLoad})
      .should('not.exist')

    cy.metaTests(({logs}) => {
      expect(logs.length).to.eq(2)
      expectLogText('~get', '#added-after-delay')
      expectLogColor('~get', 'lightgray')
    })
  })
  
  it('a negative callback assertion on a timed-out element', () => {
    cy.get('#added-after-delay', {nofail:true, timeout:beforeLoad})
      .should($el => expect($el).to.not.exist)

    cy.metaTests(({logs}) => {
      expect(logs.length).to.eq(2)
      expectLogText('~get', '#added-after-delay')
      expectLogColor('~get', 'lightgray')
    })
  })
})
