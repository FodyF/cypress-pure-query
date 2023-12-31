import './commands'
import './mount'
import '../../src/index.js'
import addContext from 'mochawesome/addContext'

const {$,_} = Cypress

const titleToFileName = (title) =>
  title.replace(/[:\/]/g, '')

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    let parent = runnable.parent
    let filename = ''
    while (parent && parent.title) {
      filename = `${titleToFileName(
        parent.title,
      )} -- ${filename}`
      parent = parent.parent
    }
    filename += `${titleToFileName(
      test.title,
    )} (failed).png`
    addContext(
      { test },
      `../screenshots/${Cypress.spec.name}/${filename}`,
    )
  }
  // always add the video
  addContext({ test }, `../videos/${Cypress.spec.name}.mp4`)
})

$.expr[':'].textEquals = Cypress.$.expr.createPseudo(function(arg) {
  return function( elem ) {
    return $(elem).text().match("^" + arg + "$");
  }
})
