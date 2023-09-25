import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'
import '@src/query/log.js'

console.clear()

describe('mods to cypress logging', () => {

  const asyncLoadDelay = 300
  const afterLoad = asyncLoadDelay+50
  const beforeLoad = asyncLoadDelay-50

  beforeEach(() => {
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
            expectLogText('contains', 'Added')
            expectLogColor('contains', 'white')
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
            expectLogText('~contains', 'Added (skipped)')
            expectLogColor('~contains', 'orange')
          })
      })
    })

    context('FORMAT: cy.contains(selector, content)', () => {

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
