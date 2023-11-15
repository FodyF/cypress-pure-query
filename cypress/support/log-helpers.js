
const escaped = (s) => s.replace(/"/g, '\\"') 

export function logEntryForCurrentTest() {
  const suiteTitles = [...Cypress.currentTest.titlePath].slice(0, -1)
  const suiteTitleSelectors = suiteTitles.map(s => `div.collapsible:contains("${escaped(s)}")`).join(' ')
  const testTitleSelector = `li.test.runnable-active:has(span:contains("${escaped(Cypress.currentTest.title)}"))`
  const selector = `${suiteTitleSelectors} ${testTitleSelector}`
  return cy.$$(selector, parent.document.body)
}

export function clickTestTitle() {
  const $li = logEntryForCurrentTest()
  const $title = $li.find('span.runnable-title')
  $title.trigger('click')
}

export function clickTestLogOpen() {
  const $li = logEntryForCurrentTest()
  const runnableInstruments = $li.find('div.runnable-instruments')
  if (runnableInstruments.length === 0) {
    clickTestTitle()
  }
}

export function expectNotLogged(displayName, options = {}) {  
  const {timeout = 1000} = options
  cy.on('before:log', () => false)
  cy.wait(timeout)
  cy.wrap(logEntryForCurrentTest(), {log:false}).within(() => {
    cy.get(`span.command-info:has(span.command-method:textEquals("${displayName}"))`, {log:false}).should('not.exist')
  })
  cy.on('before:log', () => null)
}

export function expectLogText(displayName, expectedText, options = {}) {  
  const {index = 0} = options      // increase index for 2nd, 3rd occurance
  cy.on('before:log', () => false)
  cy.wrap(logEntryForCurrentTest(), {log:false})
    .find(`span.command-info:has(span.command-method:textEquals("${displayName}"))`, {log:false, timeout:1000})
    .eq(index, {log:false})
    .find('span.command-message-text', {log:false})
    .should($el => {
      const actualText = $el.text()
      const actual = actualText.replace('soft-assert', '').replace(/\*/g, '')  // remove displayName and markdown highlight chars
      const expected  = expectedText.replace('soft-assert - ', '').replace(/\*/g, '')  // remove console warn prefix
      const indexTag = index ? `[${index}]` : ''
      const message = actual === expected 
        ? `log entry of "${displayName}${indexTag}" - text matches`
        : `expected text to be "**${expected}**" but actual was "**${actual}**"`
      assert(actual === expected, message)
    })
  cy.on('before:log', () => null)
} 

const colorCssToName = {
  'rgb(237, 187, 74)': 'orange',   // #edbb4a;
  'rgb(31, 169, 113)': 'green',   // #1fa971
  'rgb(144, 149, 173)': 'lightgray',
  'rgb(208, 210, 224)': 'white',  // #d0d2e0;
  'rgb(197, 201, 253)': 'white',
}

export function expectLogColor(displayName, expectedColor, index = 0) {
  cy.on('before:log', () => false)
  cy.wrap(logEntryForCurrentTest(), {log:false})  
    .find(`span.command-info:has(span.command-method:textEquals("${displayName}"))`, {log:false, timeout:1000})
    .eq(index, {log:false})
    .find('span.command-message-text', {log:false})
    .should($logEntry => {
      const actual = colorCssToName[$logEntry.css('color')] || $logEntry.css('color')
      const indexTag = index ? `[${index}]` : ''
      const message = actual === expectedColor 
        ? `log entry of "${displayName}${indexTag}" - color is **${expectedColor}**`
        : `expected log entry of "${displayName}" to be **${expectedColor}** but actual color was **${actual}**`
      assert(expectedColor === actual, message)
    })
  cy.on('before:log', () => null)
}
