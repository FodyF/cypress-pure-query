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

    cy.metaTests(({subject}) => {
      expectNullSubject(subject)
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~invoke', 'not-a-function (failed)')
      expectLogColor('~invoke', 'orange')
    })
  })

  it('a passing invoke() query is not affected by nofail flag', () => {
    cy.get('#test-element')
      .invoke({nofail:true, timeout:100}, 'css', 'color')

    cy.metaTests(({subject}) => {
      assert(subject === 'rgb(0, 128, 0)', 'Subject is correct')
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~invoke', 'css, color')
      expectLogColor('~invoke', 'lightgray')
    })
  })

  it('invoke() element method and assert changed color', () => {
    cy.get('#test-element')
      .invoke({nofail:true, timeout:50}, '0.makeRed')

    cy.get('#test-element')
      .invoke({nofail:true, timeout:50}, 'css', 'color')

    cy.metaTests(({subject}) => {
      assert(subject === 'rgb(255, 0, 0)', 'Subject is correct') 
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~invoke', '0.makeRed', {index:0})
      expectLogColor('~invoke', 'lightgray', {index:0})
      expectLogText('~invoke', 'css, color', {index:1})
      expectLogColor('~invoke', 'lightgray', {index:1})
    })
  })

  it('a fail in prev query skips .invoke()', () => {
    cy.get('#invalid', {nofail:true})
      .invoke({nofail:true, timeout:50}, 'css', 'color')

    cy.metaTests(({subject}) => {
      expectNullSubject(subject)
      expectLogText('~get', '#invalid (failed)')
      expectLogColor('~get', 'orange')
      expectLogText('~invoke', 'css, color (skipped)')
      expectLogColor('~invoke', 'orange')
    })
  })
})

describe('asynchronous', () => {

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

    it('function appears after timeout, fails', () => {
      cy.get('#test-element')
        .invoke({nofail: true, timeout: 100}, '0.testFn')

      cy.metaTests(({subject}) => {
        expectNullSubject(subject)
        expectLogText('~invoke', '0.testFn (failed)')
        expectLogColor('~invoke', 'orange')
      })
    })

    it('function appears before timeout, passes', () => {
      cy.get('#test-element')
        .invoke({nofail: true, timeout: 300}, '0.testFn')

      cy.metaTests(({subject}) => {
        expect(subject).to.eq('testVal')
        expectLogText('~invoke', '0.testFn')
        expectLogColor('~invoke', 'lightgray')
      })
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

    it('function appears after timeout, fails', () => {
      cy.window()
        .invoke({nofail: true, timeout: 150}, 'testFn')

        cy.metaTests(({subject}) => {
          expectNullSubject(subject)
          expectLogText('~invoke', 'testFn (failed)')
          expectLogColor('~invoke', 'orange')
        })
      })

    it('function appears before timeout, passes', () => {
      cy.window()
        .invoke({nofail: true, timeout: 300}, 'testFn')
      
      cy.metaTests(({subject}) => {
        expect(subject).to.eq('testVal')
        expectLogText('~invoke', 'testFn')
        expectLogColor('~invoke', 'lightgray')
      })
    })
  })
})

context('activation', () => {

  beforeEach(() => {
    cy.mount(`<div id="test-element">Element text</div>`)
  })

  it('activated with a {nofail:true} option', () => {
    cy.get('#test-element')
      .invoke({nofail: true, timeout: 50}, 'not-a-function')

    cy.metaTests(({lastCmd}) => {
      assert(lastCmd.queryState.userOptions.nofail === true, 'nofail option is set')
    })
  })
  
  it('not activated', (done) => {
    cy.on('fail', () => {
      const cmd = cy.state('current')
      assert(cmd.queryState?.options?.nofail === undefined, 'nofail option is NOT set')
      done()
    })
    cy.get('#test-element')
      .invoke({timeout: 50}, 'not-a-function')  // timeout has no affect here
  })
})
