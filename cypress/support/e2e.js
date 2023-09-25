import './commands'
import '@src'

const {$,_} = Cypress

$.expr[':'].textEquals = Cypress.$.expr.createPseudo(function(arg) {
  return function( elem ) {
    return $(elem).text().match("^" + arg + "$");
  }
})
