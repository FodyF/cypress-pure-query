import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'
import {activateLogging, deactivateLogging} from '@src/query/logging.js'

console.clear()

const asyncLoadDelay = 300
const afterLoad = asyncLoadDelay+50
const beforeLoad = asyncLoadDelay-50

describe('mods to cypress logging', () => {

  beforeEach(() => {
    activateLogging()
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:orange">Added after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
      .appendChild(`<span id="added-after-2x-delay" style="color:red">Added after 2x ${asyncLoadDelay} ms</span>`, asyncLoadDelay *2)
  })

  context('nofail modifies the Cypress log', () => {

    context('FORMAT: cy.get(selector).contains(content)', () => {

      it('passing query, nofail: false', () => {
        cy.get('#added-after-delay').contains('Added')
          .then(() => {
            expectLogText('contains', 'Added')
            expectLogColor('contains', 'white')
          })
      })

      it('passing query, nofail: true', () => {
        cy.get('#added-after-delay').contains('Added', {nofail:true})
          .then(() => {
            expectLogText('~contains', 'Added')
            expectLogColor('~contains', 'lightgray')
          })
      })

      it('failing query, nofail: true', () => {
        cy.get('#added-after-delay').contains('not this text', {nofail:true, timeout:afterLoad})
          .then(() => {
            expectLogText('~contains', 'not this text (failed)')
            expectLogColor('~contains', 'orange')
          })     
      })

      it('failing timeout, nofail: true', () => {
        cy.get('#added-after-delay', {timeout:beforeLoad, nofail:true}).contains('Added', {nofail:true})
          .then(() => {
            expectLogText('~get', '#added-after-delay (failed)')
            expectLogColor('~get', 'orange')
            expectLogText('~contains', 'Added (skipped)')
            expectLogColor('~contains', 'orange')
          })
      })
    })

    context('FORMAT: cy.contains(content, options)', () => {

      it('passing query, nofail: false', () => {
         cy.contains('#added-after-delay', 'Added')
          .then(() => {
            expectLogText('contains', '#added-after-delay, Added')
            expectLogColor('contains', 'white')
          })
      })

      it('passing query, nofail: true', () => {
        cy.contains('#added-after-delay', 'Added', {nofail:true})
          .then(() => {
            expectLogText('~contains', '#added-after-delay, Added')
            expectLogColor('~contains', 'lightgray')
          })
      })

      it('failing query, nofail: true', () => {
        cy.contains('#added-after-delay', 'not this text', {nofail:true, timeout:afterLoad})
          .then(() => {
            expectLogText('~contains', '#added-after-delay, not this text (failed)')
            expectLogColor('~contains', 'orange')
          })
      })

      it('failing timeout, nofail: true', () => {
        cy.contains('#added-after-delay', 'Added', {timeout:beforeLoad, nofail:true})
          .then(() => {
            expectLogText('~contains', '#added-after-delay, Added (failed)')
            expectLogColor('~contains', 'orange')
          })
      })
    })
  })
})

describe('deactivating logging', () => {

  it('failing query, nofail: true', () => {

    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:orange">Added after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
      .appendChild(`<span id="added-after-2x-delay" style="color:red">Added after 2x ${asyncLoadDelay} ms</span>`, asyncLoadDelay *2)

    activateLogging()
    cy.get('#added-after-delay').contains('not this text', {nofail:true, timeout:afterLoad})
      .then(() => {
        expectLogText('~contains', 'not this text (failed)')
        expectLogColor('~contains', 'orange')
      })     

    deactivateLogging()
    cy.get('#added-after-delay').contains('not this text', {nofail:true, timeout:afterLoad})
      .then(() => {
        expectLogText('contains', 'not this text')
        expectLogColor('contains', 'lightgray')
      })     
  })
})
