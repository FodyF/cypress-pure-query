import {expectLogText, expectLogColor, expectNullSubject} from '@cypress/support/log-helpers.js'
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
      .its('not-a-property', {nofail: true})

    cy.metaTests(({subject}) => {
      expectNullSubject(subject)
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'not-a-property (failed)')
      expectLogColor('~its', 'orange')
    })
  })

  it('a passing its() query is not affected by nofail flag', {defaultCommandTimeout:100}, () => {
    cy.get('#test-element')
      .its('length', {nofail:true})

    cy.metaTests(({subject}) => {
      expect(subject).to.eq(1)
      expectLogText('get', '#test-element')
      expectLogColor('get', 'lightgray')
      expectLogText('~its', 'length')
      expectLogColor('~its', 'lightgray')
    })
  })

  it('a fail in prev query skips .its()', () => {
    cy.get('#invalid', {nofail:true})
      .its('length', {nofail:true})

    cy.metaTests(({subject}) => {
      expectNullSubject(subject)
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
        .its('0.testProp', {nofail: true, timeout: 150})

      cy.metaTests(({subject}) => {
        expectNullSubject(subject)
        expectLogText('~its', '0.testProp (failed)')
        expectLogColor('~its', 'orange')
      })
    })

    it('property appears before timeout, passes', () => {
      cy.get('#test-element')
        .its('0.testProp', {nofail: true, timeout: 300})

      cy.metaTests(({subject}) => {
        expect(subject).to.eq('testVal')
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

    it('times out before property appears, fails', () => {
      cy.window()
        .its('appCustomField', {nofail: true, timeout: 150})

        cy.metaTests(({subject}) => {
          expectNullSubject(subject)
          expectLogText('~its', 'appCustomField (failed)')
          expectLogColor('~its', 'orange')
        })
      })

    it('property appears before timeout, passes', () => {
      cy.window()
        .its('appCustomField', {nofail: true, timeout: 300})
      
      cy.metaTests(({subject}) => {
        expect(subject).to.eq(42)
        expectLogText('~its', 'appCustomField')
        expectLogColor('~its', 'lightgray')
      })
    })
  })

})
