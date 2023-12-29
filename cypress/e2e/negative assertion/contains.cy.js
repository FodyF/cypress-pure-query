import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'
import '@src/overrides/should.js'

console.clear()

const asyncLoadDelay = 300
const afterLoad = asyncLoadDelay+50
const beforeLoad = asyncLoadDelay-50

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
    cy.contains('#added-after-delay', 'not-the-text', {nofail:true, timeout:beforeLoad})
      .should('not.exist')

    cy.metaTests(() => {
      expectLogText('~contains', '#added-after-delay, not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })
  
  it('a negative callback assertion on a timed-out element', () => {
    cy.contains('#added-after-delay', 'not-the-text', {nofail:true, timeout:beforeLoad})
      .should($el => expect($el).to.not.exist)

    cy.metaTests(() => {
      expectLogText('~contains', '#added-after-delay, not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })
})

context('contains - child command', () => {

  it('a negative css assertion on a non-existing element', () => {
    cy.get('#present-on-load').contains('not-the-text', {nofail:true, timeout:100})
      .should('not.exist')

    cy.metaTests(() => {
      expectLogText('~contains', 'not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })

  it('a negative callback assertion on a non-existing element', () => {
    cy.get('#present-on-load').contains('not-the-text', {nofail:true, timeout:100})
      .should($el => expect($el).to.not.exist)

    cy.metaTests(() => {
      expectLogText('~contains', 'not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })

  it('a negative css assertion on a timed-out element', () => {
    cy.get('#added-after-delay').contains('not-the-text', {nofail:true, timeout:beforeLoad})
      .should('not.exist')

    cy.metaTests(() => {
      expectLogText('~contains', 'not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })
  
  it('a negative callback assertion on a timed-out element', () => {
    cy.get('#added-after-delay').contains('not-the-text', {nofail:true, timeout:beforeLoad})
      .should($el => expect($el).to.not.exist)

    cy.metaTests(() => {
      expectLogText('~contains', 'not-the-text')
      expectLogColor('~contains', 'lightgray')
    })
  })
})
