import {queryFactory} from '../query'

// @ts-check

const {_} = Cypress

/* 
  The its() query does not handle a null return (unlike DOM related queries)
  To get around the problem, we add an innerFn wrapper that substitues a non-null return value when required.
  The default can be set on options at the test level. 
*/

Cypress.Commands.overwriteQuery('its', function (originalFn, ...args) {
  let [path, options = {}] = args  // ensure options

  options.nofailDefault = _.has(options, 'nofailDefault') ? options.nofailDefault : 'default'

  /* Error handler */
  if (options.nofail || options.nofailDefault) {
    options.nofailErrorHandler = (error) => {
      if (error.name === 'CypressError' && error.message.match(/because the property: .* does not exist on your subject/)) {
        return options.nofailDefault 
      }
      throw error   // must re-throw if not handling
    }
  }

  const innerFn = queryFactory(this, originalFn, path, options)
  return (subject) => {
    const innerResult = innerFn(subject)
    return innerResult ?? options.nofailDefault
  } 
})
