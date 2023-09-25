
export function logEntryForCurrentTest() {
  const suiteTitles = [...Cypress.currentTest.titlePath].slice(0, -1)
  const selector = suiteTitles.map(s => `div.collapsible:contains("${s}")`)
    .concat(`li.test.runnable-active:has(span:textEquals("${Cypress.currentTest.title}"))`)
    .join(' ')
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

export function expectLogText(displayName, expectedText, index = 0) {
  clickTestLogOpen()
  cy.on('before:log', () => false)
  cy.wrap(logEntryForCurrentTest(), {log:false})
    .find(`span.command-info:has(span.command-method:textEquals("${displayName}"))`, {log:false})
    .eq(index, {log:false})
    .find('span.command-message-text', {log:false})
    .should($el => {
      const actualText = $el.text()
      const actual = actualText.replace('soft-assert', '').replace(/\*/g, '')  // remove displayName and markdown highlight chars
      const expected  = expectedText.replace('soft-assert - ', '').replace(/\*/g, '')  // remove console warn prefix
      const message = actual === expected 
        ? 'Log text matches'
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
  clickTestLogOpen()
  cy.on('before:log', () => false)
  cy.wrap(logEntryForCurrentTest(), {log:false})  
    .find(`span.command-info:has(span.command-method:textEquals("${displayName}"))`, {log:false})
    .eq(index, {log:false})
    .find('span.command-message-text', {log:false})
    .should($logEntry => {
      const actual = colorCssToName[$logEntry.css('color')] || $logEntry.css('color')
      const message = actual === expectedColor 
        ? `log entry of "${displayName}" is **${expectedColor}**`
        : `expected log entry of "${displayName}" to be **${expectedColor}** but actual color was **${actual}**`
      assert(expectedColor === actual, message)
    })
  cy.on('before:log', () => null)
}
