import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'

console.clear()

const asyncLoadDelay = 300
const afterLoad = asyncLoadDelay+50
const beforeLoad = asyncLoadDelay-100

beforeEach(() => {
  cy.activateLogging()
  cy.mount(`<div id="present-on-load">Present on page load</div>`)
    .appendAfter(`<div id="added-after-delay" style="color:orange">Added after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
    .appendChild(`<span id="added-after-2x-delay" style="color:red">Added after 2x ${asyncLoadDelay} ms</span>`, asyncLoadDelay *2)
})

context('contains - parent command', () => {

  it('a negative css assertion on a non-existing element', () => {
    cy.contains('#present-on-load', 'not-the-text', {nofail:true, timeout:100})
      .should('not.exist')

    cy.metaTests(() => {
      expectLogText('~contains', '#present-on-load, not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })

  it('a negative callback assertion on a non-existing element', () => {
    cy.contains('#present-on-load', 'not-the-text', {nofail:true, timeout:100})
      .should($el => expect($el).to.not.exist)

    cy.metaTests(() => {
      expectLogText('~contains', '#present-on-load, not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })

  it('a negative css assertion on a timed-out element', () => {
    cy.contains('#added-after-delay', /Added after \d+ ms/, {nofail:true, timeout:beforeLoad})
      .should('not.exist')

    cy.metaTests(() => {
      expectLogText('~contains', '#added-after-delay, /Added after \\d+ ms/')
      expectLogColor('~contains', 'lightgray')
    })
  })
  
  it('a negative callback assertion on a timed-out element', () => {
    cy.contains('#added-after-delay', /Added after \d+ ms/, {nofail:true, timeout:beforeLoad})
      .should($el => expect($el).to.not.exist)

    cy.metaTests(() => {
      expectLogText('~contains', '#added-after-delay, /Added after \\d+ ms/')
      expectLogColor('~contains', 'lightgray')
    })
  })

  it('element found but negative css assertion, test fails', (done) => {
    cy.on('fail', (error) => {
      const msg = "Expected not to find content: 'Present on page load' within the selector: '#present-on-load' but continuously found it."
      assert(error.message.includes(msg), 'Correct error thrown')
      done()
    })
    
    cy.contains('#present-on-load', 'Present on page load', {nofail:true, timeout:afterLoad})
      .should('not.exist')
  })
})

context('contains - child command', () => {

  it('a negative css assertion on text that does not exist', () => {
    cy.get('#present-on-load').contains('not-the-text', {nofail:true, timeout:100})
      .should('not.exist')

    cy.metaTests(() => {
      expectLogText('~contains', 'not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })

  it('a negative callback assertion on text that does not exist', () => {
    cy.get('#present-on-load').contains('not-the-text', {nofail:true, timeout:100})
      .should($el => expect($el).to.not.exist)

    cy.metaTests(() => {
      expectLogText('~contains', 'not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })
  
  it('element found but negative css assertion, test fails', (done) => {
    cy.on('fail', (error) => {
      const msg = "Expected not to find content: 'Present on page load' within the element: <div#present-on-load> but continuously found it."
      assert(error.message.includes(msg), 'Correct error thrown')
      done()
    })

    cy.get('#present-on-load').contains('Present on page load', {nofail:true, timeout:afterLoad})
      .should('not.exist')
  })
})
