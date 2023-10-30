import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'

// @ts-check

console.clear()

describe('testing .its()', {defaultCommandTimeout: 200}, () => {

  beforeEach(() => {
    cy.activateLogging()
    cy.mount(`
      <div id="parent">
        <p>parent test</p>
        <div id="child">child text</div>
      </div>
    `)
  })

  it('{nofailDefault:<default>} causes a failing query to return <default>', () => {
    cy.get('#parent')
      .its('nonproperty', {nofailDefault: 'property not found'})
      .should('eq', 'property not found')

    cy.metaTests(() => {
      expectLogText('get', '#parent')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'nonproperty (failed)')
      expectLogColor('~its', 'orange')
    })
  })
  
  it('{nofail:true} without an explicit default receives string "default"', () => {
    cy.get('#parent')
      .its('nonproperty', {nofail: true})
      .should('eq', 'default') 

    cy.metaTests(() => {
      expectLogText('get', '#parent')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'nonproperty (failed)')
      expectLogColor('~its', 'orange')
    })
  })

  it('a passing its() query is not affected by nofail flag', {defaultCommandTimeout:100}, () => {
    cy.get('#parent')
      .its('length', {nofail:true, nofailDefault: 'property not found'})
      .should('eq', 1)

    cy.metaTests(() => {
        expectLogText('get', '#parent')
        expectLogColor('get', 'lightgray')
        expectLogText('~its', 'length')
        expectLogColor('~its', 'lightgray')
      })
  })

  it('a fail in prev query skips .its()', () => {
    cy.get('#invalid', {nofail:true})
      .its('length', {nofailDefault: 'property not found'})
      .should('eq', 'property not found')

    cy.metaTests(() => {
      expectLogText('~get', '#invalid (failed)')
      expectLogColor('~get', 'orange')
      expectLogText('~its', 'length (skipped)')
      expectLogColor('~its', 'orange')
    })
  })
})

describe('asynchronous', () => {

  context('property added to an element', () => {

    beforeEach(() => {
      cy.activateLogging()
      cy.mount(`
        <div id="parent">
          <p>parent test</p>
          <div id="child">child text</div>
        </div>
        <script>
          setTimeout(() => {
            const parent = document.getElementById('parent')
            parent.testProp = 'testVal'
          }, 250)
        </script>
      `)
    })

    it('property appears after timeout, fails', () => {
      cy.get('#parent')
        .its('0.testProp', {nofail: true, timeout: 200})
        .should('eq', 'default')

      cy.metaTests(() => {
        expectLogText('~its', '0.testProp (failed)')
        expectLogColor('~its', 'orange')
      })
    })

    it('property appears before timeout, passes', () => {
      cy.get('#parent')
        .its('0.testProp', {nofail: true, timeout: 300})
        .should('eq', 'testVal')

      cy.metaTests(() => {
        expectLogText('~its', '0.testProp (failed)')
        expectLogColor('~its', 'lightgray')
      })
    })
  })

  context('property added to an object', () => {
    
    beforeEach(() => {
      cy.activateLogging()
      cy.mount(`
        <script>
          setTimeout(function () {
            window.appCustomField = 42
          }, 250)
        </script>
      `)
    })

    it('times out before property appears', () => {
      cy.window()
        .its('appCustomField', {nofail: true, timeout: 150})
        .should('equal', 'default')

        cy.metaTests(() => {
          expectLogText('~its', 'appCustomField (failed)')
          expectLogColor('~its', 'orange')
        })
      })

    it('property appears before timeout', () => {
      cy.window()
        .its('appCustomField', {nofail: true, timeout: 300})
        .should('equal', 42)
      
      cy.metaTests(() => {
        expectLogText('~its', 'appCustomField')
        expectLogColor('~its', 'lightgray')
      })
    })
  })

})
