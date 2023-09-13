import {queryFactory} from '../query/queryFactory'

Cypress.Commands.overwriteQuery('contains', function (originalFn, ...args) {
  let [filter, text, options = {}] = args  // ensure options

  // Parameter resolution copied from Cypress 12
  const _ = Cypress._
  if (_.isRegExp(text)) {
    // SYNTAX: .contains(filter, text)
    // Do nothing
  } else if (_.isObject(text)) {
    // SYNTAX: .contains(text, userOptions)
    options = text
    text = filter
    filter = ''
  } else if (_.isUndefined(text)) {
    // SYNTAX: .contains(text)
    text = filter
    filter = ''
  }

  return queryFactory(this, originalFn, filter, text, options)
})
