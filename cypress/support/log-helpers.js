
const escaped = (s) => s.replace(/"/g, '\\"') 

export function logEntryForCurrentTest() {
  const suiteTitles = [...Cypress.currentTest.titlePath].slice(0, -1)
  const suiteTitleSelectors = suiteTitles.map(s => `div.collapsible:contains("${escaped(s)}")`).join(' ')
  const testTitleSelector = `li.test.runnable-active:has(span:contains("${escaped(Cypress.currentTest.title)}"))`
  const selector = `${suiteTitleSelectors} ${testTitleSelector}`
  return cy.$$(selector, parent.document.body)
}
Cypress.Commands.add('logEntryForCurrentTest', logEntryForCurrentTest)

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

export function clickTestLogClosed() {
  const $li = logEntryForCurrentTest()
  const runnableInstruments = $li.find('div.runnable-instruments')
  if (runnableInstruments.length > 0) {
    clickTestTitle()
  }
}

export function expectNotLogged(displayName, options = {}) {  
  const {timeout = 1000} = options
  cy.on('before:log', () => false)
  cy.wait(timeout)
  cy.logEntryForCurrentTest()
    .find(`span.command-info:has(span.command-method:textEquals("${displayName}"))`, {log:false}).should('not.exist')
  cy.on('before:log', () => null)
}

export function expectNullSubject(subject) {
  cy.wrap(subject, {log:false}).should(() => { 
    const msg = subject === null ? 'subject is null' : `expected subject to be null but it was ${subject}`
    assert(subject === null, msg)
  })
}

Cypress.Commands.add('commandMessageText', (displayName, options) => {
  cy.logEntryForCurrentTest()
    .find(`span.command-info:has(span.command-method:textEquals("${displayName}"))`, {log:false, timeout:1000})
    .eq(options.index || 0, {log:false})
    .find('span.command-message-text', {log:false})
})

export function expectLogText(displayName, expectedText, options = {}) {  
  cy.on('before:log', () => false)

  cy.commandMessageText(displayName, options)
    .should($logEntry => {
      const actualText = $logEntry.text()
      const actual = actualText.replace('soft-assert', '').replace(/\*/g, '')  // remove displayName and markdown highlight chars
      const expected  = expectedText.replace('soft-assert - ', '').replace(/\*/g, '')  // remove console warn prefix
      const indexTag = options.index !== undefined ? `[${options.index}]` : ''
      const logEntryName = `${displayName}${indexTag}`
      const message = (actual === expected)
        ? `log entry of "${logEntryName}" - text matches`
        : `expected log entry of "${logEntryName}" to have text of "**${expected}**" but actual was "**${actual}**"`
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

export function expectLogColor(displayName, expectedColor, options = {}) {
  cy.on('before:log', () => false)

  cy.commandMessageText(displayName, options)
    .should($logEntry => {
      const actual = colorCssToName[$logEntry.css('color')] || $logEntry.css('color')
      const indexTag = options.index !== undefined ? `[${options.index}]` : ''
      const logEntryName = `${displayName}${indexTag}`
      const message = (actual === expectedColor)
        ? `log entry of "${logEntryName}" - color is **${expectedColor}**`
        : `expected log entry of "${logEntryName}" to be **${expectedColor}** but actual color was **${actual}**`
      assert(expectedColor === actual, message)
    })

  cy.on('before:log', () => null)
}

export function logsInChain() {
  return logEntryForCurrentTest().find('span.command-info')
}
