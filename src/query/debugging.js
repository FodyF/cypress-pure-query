// @ts-check

const {_,$} = Cypress

Cypress.on('test:before:run', (_, test) => {
  console.group('Test title:', `"${test.title}"`)
})

Cypress.on('test:after:run', (attributes , test) => {
  console.groupEnd()
})

let queryProgress = {}

Cypress.on('query:debug', (q) => {

  const {cmd, queryId, call, start, options, subject, $el, found, timedOut, caughtError} = q

  const debugFormat = Cypress.queryConfig.debug
  const id = `${cmd.get('name')}:${queryId}:${call}`

  const _subject = subject !== undefined ? `subject: ${subject.selector || subject}` : ''

  // console.log( Cypress.dom.isJquery($el), $el)

  const result = Cypress.dom.isJquery($el) ? `${$el.selector} ${$el.length}` : $el
  const icon = !timedOut && !found ? '⌛' : (found ? '✔️' : '❌')
  
  // const transform = subject === undefined ? `( -> ${result}) ${iconFound}${iconProcessing}` 
  //   : `(subject: ${subject} -> result: ${result}) ${iconFound}${iconProcessing}`  
  // const transform = `(${_subject} -> result: ${result}) ${iconFound}${iconProcessing}`  
  const transform = `${_subject} -> ${result} ${icon} ${Date.now() - start} / ${options.timeout} ms`  
  const error = found ? '' : caughtError?.error?.message || ''

  const debugObj = {
    ["cmd:id:call"]: id, 
    subject: q.subject, 
    $el: q.$el?.selector, 
    found: `${q.found}`, 
    timedOut: q.timedOut, 
    error
  }

  const output = _.isFunction(debugFormat) ? debugFormat(q)
    : debugFormat === 'flat' ? debugObj
    : debugFormat === 'block' ? JSON.stringify(debugObj, null, 4)
    : debugFormat === 'flow' ? `%c ${id} ${transform} ${error} `
    : q

  // console.log('\x1b[32m', out, '\x1b[0m') //, 'background: yellow;')
  // const output = Cypress.queryConfig.debug === 'flat' ? out : JSON.stringify(out, null, 4)
  // console.log(output, 'color: orange; background-color: gray; font-size: 10px; line-height: 20px')
  console.log(output, 'color: dark-orange; font-size: 10px; line-height: 20px')
})

Cypress.on('command:end', (cmd) => {
  const progress = queryProgress[cmd.get('id')]
  if (progress) {
    console.log('on("command:end")', progress) 
  }
})
