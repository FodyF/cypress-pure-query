import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'
// @ts-check

console.clear()

describe('cy.should', () => {
  
  // Cypress.on('query:progress', (progress) => {
  //   // // {cmd, subject, element, found, passed, log, error}
  //   const {cmd, subject, passed, log, baseMessage} = progress
  //   // queryProgress = _.cloneDeep({name: cmd.get('name'), ...progress})
  //   // logFailed(log, subject, passed, baseMessage)
  //   console.log('calls', progress.cmd.get('name'), progress.calls)
  // })

  // const asyncLoadDelay = 50
  // beforeEach(() => {
  //   cy.visit('cypress/html/divs-eventually.html', {
  //     // @ts-ignore
  //     onBeforeLoad: (win) => win.delay = asyncLoadDelay
  //   })
  // })
  const asyncLoadDelay = 150
  const afterLoad = asyncLoadDelay+50
  const beforeLoad = asyncLoadDelay-50
  const expectedText = `Appended after ${asyncLoadDelay} ms`

  beforeEach(() => {
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:red">Appended after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
  })

  context('{nofail:true} option', () => {

    it('{nofail:true} causes a failing query to return null', () => {
      cy.get('#does-not-exist', {nofail:true})
        .should('eq', null)
        .and('not.exist')
    })

    it('{nofail:true} does not change a passing query', () => {
      cy.get('#added-after-delay').should('have.text', expectedText).and('exist')
      cy.get('#added-after-delay', {nofail:true}).should('have.text', expectedText).and('exist')
    })

    it.only('{nofail:false} allows test to fail', (done) => {
      cy.on('fail', () => done())
      cy.get('#does-not-exist', {nofail:false})
        .should('be.visible')
        .and('exist')
    })
  })

  context('Cypress.env("nofail", true) switch', () => {

    it('Cypress.env("nofail", true) causes a failing query to return null', () => {
      Cypress.env("nofail", true)
      cy.get('#added-after-delay', {timeout:asyncLoadDelay-50}).should('eq', null)
      cy.get('#does-not-exist').should('eq', null)
    })

    it('Cypress.env("nofail", true) does not change a passing query', () => {
      Cypress.env("nofail", true)
      cy.get('#added-after-delay').should('have.text', `Added after ${asyncLoadDelay} ms`)
    })

    it('Cypress.env("nofail", false) allows test to fail', (done) => {
      cy.on('fail', () => done())
      Cypress.env("nofail", false)
      cy.get('#added-after-delay', {timeout:asyncLoadDelay+20}).should('have.text', 'Not the text')
    })
  })
})
