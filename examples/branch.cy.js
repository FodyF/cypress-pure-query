import * as src from '@src/index'
const {registerActivator, whenNextCmdIs, whenCmdInChain} = src

console.clear()

context('Custom command to branch if element found or not found', () => {

  const branchActivator = () => whenNextCmdIs('branch')
  registerActivator(branchActivator)

  Cypress.Commands.add('branch', {prevSubject:true}, (subject, actions) => {
    if (subject) {
      actions.found(subject)
    } else {
      actions.notfound(subject)
    }
  })

  const asyncLoadDelay = 200

  beforeEach(() => {
    cy.mount(`<div id="present-on-load">Present on page load</div>`)
      .appendAfter(`<div id="added-after-delay" style="color:red">Appended after ${asyncLoadDelay} ms</div>`, asyncLoadDelay)
      .appendChild(`<span id="added-after-2x-delay" style="color:red">Appended after 2x ${asyncLoadDelay} ms</span>`, asyncLoadDelay *2)
  })

  context('branch calls', {defaultCommandTimeout: 250}, () => {

    it('static element', () => {
      cy.get('#present-on-load')
        .branch({
          found: cy.spy().as('found'),
          notfound: cy.spy().as('notfound')
        })
      cy.get('@found').should('be.called')
      cy.get('@notfound').should('not.called')
    })

    it('missing element', () => {
      cy.get('#not-present')
        .branch({
          found: cy.spy().as('found'),
          notfound: cy.spy().as('notfound')
        })
      cy.get('@found').should('not.called')
      cy.get('@notfound').should('be.called')
    })
      
    it('delayed elemrent', () => {
      cy.get('#added-after-delay')
        .branch({
          found: cy.spy().as('found'),
          notfound: cy.spy().as('notfound')
        })
      cy.get('@found').should('be.called')
      cy.get('@notfound').should('not.called')
    })
  })

  context('non-trivial chain', {defaultCommandTimeout: 450}, () => {
          
    it('delayed element', () => {
      cy.get('#added-after-delay')
        .branch({
          found: (subject) => {
            cy.wrap(subject)
              .find('#added-after-2x-delay')
          },
          notfound: () => { throw new Error('Not found') }
        })
    })

    it('missing element two steps back', () => {

      const branchActivator = () => whenCmdInChain('branch')
      registerActivator(branchActivator)

      cy.get('#not-present')
        .find('div')
        .branch({
          found: cy.spy().as('found'),
          notfound: cy.spy().as('notfound')
        })
      cy.get('@found').should('not.called')
      cy.get('@notfound').should('be.called')
    })
  })
})
