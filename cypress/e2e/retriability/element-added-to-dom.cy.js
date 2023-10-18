import {expectLogText, expectLogColor} from '@cypress/support/log-helpers.js'

it('element is added to dom', {defaultCommandTimeout: 500}, () => {
  
  cy.activateLogging()

  cy.mount(`
    <div id="app-example"></div>
    <script>
      setTimeout(() => {
        document.getElementById('app-example').innerHTML =
          '<div id="added">Hello</div>'
      }, 300)
    </script>
  `)

  cy.get('#added')
  cy.get('#added', {nofail:true})  
  cy.get('#added span', {nofail:true})
    .metaTests(() => {
      expectLogText('~get', '#added span (failed)', 1)
      expectLogColor('~get', 'orange', 1)
    })
})
