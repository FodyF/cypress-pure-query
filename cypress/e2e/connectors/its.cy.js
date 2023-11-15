import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'

// @ts-check

console.clear()

context('testing .its()', {defaultCommandTimeout: 200}, () => {

  beforeEach(() => {
    cy.activateLogging()
    cy.mount(`
      <div id="test-element">Element text</div>
    `)
  })

  it('{nofail:true} causes a failing query to return null', () => {
    cy.get('#test-element')
      .its('nonproperty', {nofail: true})
      .isNull()

    cy.metaTests(() => {
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'nonproperty (failed)')
      expectLogColor('~its', 'orange')
    })
  })

  it('a passing its() query is not affected by nofail flag', {defaultCommandTimeout:100}, () => {
    cy.get('#test-element')
      .its('length', {nofail:true})
      .should('eq', 1)

    cy.metaTests(() => {
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'length')
      expectLogColor('~its', 'lightgray')
    })
  })

  it('a fail in prev query skips .its()', () => {
    cy.get('#invalid', {nofail:true})
      .its('length', {nofail:true})
      .isNull()

    cy.metaTests(() => {
      expectLogText('~get', '#invalid (failed)')
      expectLogColor('~get', 'orange')
      expectLogText('~its', 'length (skipped)')
      expectLogColor('~its', 'orange')
    })
  })
})

context('asynchronous', () => {

  context('property added to an element', () => {

    beforeEach(() => {
      cy.activateLogging()
      cy.mount(`
        <div id="test-element">Element text</div>
        <script>
          setTimeout(() => {
            const el = document.getElementById('test-element')
            el.testProp = 'testVal'
          }, 250)
        </script>
      `)
    })

    it('property appears after timeout, fails', () => {
      cy.get('#test-element')
        .its('0.testProp', {nofail: true, timeout: 200})
        .isNull()

      cy.metaTests(() => {
        expectLogText('~its', '0.testProp (failed)')
        expectLogColor('~its', 'orange')
      })
    })

    it('property appears before timeout, passes', () => {
      cy.get('#test-element')
        .its('0.testProp', {nofail: true, timeout: 300})
        .should('eq', 'testVal')

      cy.metaTests(() => {
        expectLogText('~its', '0.testProp')
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
        .isNull()

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

context('activation', () => {

  beforeEach(() => {
    cy.mount(`<div id="test-element">Element text</div>`)
  })

  it('activated with a {nofail:true} option', () => {
    cy.get('#test-element')
      .its('nonproperty', {nofail: true, timeout: 50})
      .should(() => {
        const cmd = cy.state('current')
        assert(cmd.queryState.options.nofail === true, 'nofail option is set')
      })
  })
  
  it('not activated', (done) => {
    cy.on('fail', () => {
      const cmd = cy.state('current')
      assert(cmd.queryState?.options?.nofail === undefined, 'nofail option is NOT set')
      done()
    })
    cy.get('#test-element')
      .its('nonproperty', {timeout: 50})
  })
})
