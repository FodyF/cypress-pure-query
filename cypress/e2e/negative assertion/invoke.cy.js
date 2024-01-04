import {expectLogText, expectLogColor, expectNullSubject} from '@cypress/support/log-helpers.js'

// @ts-check
console.clear()

describe('testing .invoke()', {defaultCommandTimeout: 200}, () => {

  beforeEach(() => {
    cy.activateLogging()
    cy.mount(`
      <div id="test-element" style="color: green">
        Element text
      </div>
      <script>
        const div = document.getElementById('test-element')
        div.makeRed = () => {
          div.style = "color: red"
          return div
        }
      </script>
    `)
  })

  it('{nofail:true} causes a failing query to return null', () => {
    cy.get('#test-element')
      .invoke({nofail:true}, 'not-a-function')
      .should('not.exist')

    cy.metaTests(({subject}) => {
      expectNullSubject(subject)
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~invoke', 'not-a-function')
      expectLogColor('~invoke', 'lightgray')
    })
  })

  it('a passing invoke() returns a value but assertion fails', (done) => {
    cy.on('fail', (error) => {
      const msg = "Timed out retrying after 600ms: expected 'rgb(0, 128, 0)' to not exist"
      assert(error.message.includes(msg), 'Correct error thrown')
      done()
    })
    cy.get('#test-element')
      .invoke({nofail:true, timeout:100}, 'css', 'color')
      .should('not.exist')
  })

  it('a fail in prev query skips .invoke()', () => {
    cy.get('#invalid', {nofail:true})
      .invoke({nofail:true, timeout:50}, 'css', 'color')
      .should('not.exist')

    cy.metaTests(({subject}) => {
      expectNullSubject(subject)
      expectLogText('~get', '#invalid (failed)')
      expectLogColor('~get', 'orange')
      expectLogText('~invoke', 'css, color (skipped)')
      expectLogColor('~invoke', 'lightgray')
    })
  })
})

describe('asynchronous property', () => {

  context('function added to an element', () => {

    beforeEach(() => {
      cy.activateLogging()
      cy.mount(`
        <div id="test-element">Element text</div>
        <script>
          setTimeout(() => {
            const el = document.getElementById('test-element')
            el.testFn = () => 'testVal'
          }, 200)
        </script>
      `)
    })

    it('function appears after timeout, with negative assertion - passes', () => {
      cy.get('#test-element') 
        .invoke({nofail: true, timeout: 100}, '0.testFn')
        .should('not.exist')

      cy.metaTests(({subject}) => {
        expectNullSubject(subject)
        expectLogText('~invoke', '0.testFn')
        expectLogColor('~invoke', 'lightgray')
      })
    })

    it('function appears before timeout, but assertion fails', (done) => {
      cy.on('fail', (error) => {
        const msg = "Timed out retrying after 800ms: expected 'testVal' to not exist"
        assert(error.message.includes(msg), 'Correct error thrown')
        done()
      })
      cy.get('#test-element')
        .invoke({nofail: true, timeout: 300}, '0.testFn')
        .should('not.exist')
    })
  })

  context('function added to an object', () => {
    
    beforeEach(() => {
      cy.activateLogging()
      cy.mount(`
        <script>
          setTimeout(function () {
            window.testFn = () => 'testVal'
          }, 200)
        </script>
      `)
    })

    it('function appears after timeout, with negative assertion - passes', () => {
      cy.window()
        .invoke({nofail: true, timeout: 100}, 'testFn')
        .should('not.exist')

        cy.metaTests(({subject}) => {
          expectNullSubject(subject)
          expectLogText('~invoke', 'testFn')
          expectLogColor('~invoke', 'lightgray')
        })
      })

    it('function appears before timeout, passes', (done) => {
      cy.on('fail', (error) => {
        const msg = "Timed out retrying after 800ms: expected 'testVal' to not exist"
        assert(error.message.includes(msg), 'Correct error thrown')
        done()
      })
      cy.window()
        .invoke({nofail: true, timeout: 300}, 'testFn')
        .should('not.exist')
    })
  })
})


