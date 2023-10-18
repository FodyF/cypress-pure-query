
const {_} = Cypress

const isPath = (str) => (!!str || str === 0)



const exists = (subject, cy) => {
  // prevent any additional logs since this is an implicit assertion
  cy.state('onBeforeLog', () => false)

  // verify the $el exists and use our default error messages
  try {
    cy.expect(subject).to.exist
  } finally {
    cy.state('onBeforeLog', null)
  }
}



export function its (path, options = {}, ...args) {
  // If we're being used in .invoke(), we us it. For any other current command (.its itself or a custom command),
  // we fall back to the .its() error messages.
  const cmd = this.get('name') === 'invoke' ? 'invoke' : 'its'

  Cypress.ensure.isChildCommand(this, arguments, cy)

  if (args.length) {
    $errUtils.throwErrByPath('invoke_its.invalid_num_of_args', { args: { cmd } })
  }

  if (!_.isObject(options)) {
    $errUtils.throwErrByPath('invoke_its.invalid_options_arg', { args: { cmd } })
  }

  if (!isPath(path)) {
    $errUtils.throwErrByPath('invoke_its.null_or_undefined_property_name', {
      args: { cmd, identifier: 'property' },
    })
  }

  if (!_.isString(path) && !_.isNumber(path)) {
    $errUtils.throwErrByPath('invoke_its.invalid_prop_name_arg', {
      args: { cmd, identifier: 'property' },
    })
  }

  const log = this.get('_log') || (options.log !== false && Cypress.log({
    message: `.${path}`,
    timeout: options.timeout,
  }))

  this.set('timeout', options.timeout)
  this.set('ensureExistenceFor', 'subject')
  console.log('this', this)

  return (subject) => {
    if (subject == null) {
      $errUtils.throwErrByPath(`${cmd}.subject_null_or_undefined`, {
        args: { prop: path, cmd, value: subject },
      })
    }

    subject = cy.getRemotejQueryInstance(subject) || subject

    const value = _.get(subject, path)

    log && cy.state('current') === this && log.set({
      $el: $dom.isElement(subject) ? subject : null,
      consoleProps () {
        const obj = {
          Property: `.${path}`,
          Subject: subject,
          Yielded: getFormattedElement(value),
        }

        return obj
      },
    })

    if (value == null && !upcomingAssertion(this.get('next'))) {
      if (!_.has(subject, path)) {
        $errUtils.throwErrByPath('invoke_its.nonexistent_prop', { args: { cmd, prop: path, value } })
      }

      $errUtils.throwErrByPath(`${cmd}.null_or_undefined_prop_value`, { args: { prop: path, value } })
    }

    return value
  }
}