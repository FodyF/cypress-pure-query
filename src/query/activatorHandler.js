// @ts-check

const {_} = Cypress

export const activators = {
  nofailOption: (options) => options?.nofail || _.has(options, 'nofailDefault'), 
  nofailEnvVar: () => Cypress.env('nofail'),
}

export function nofailIsActive(options) {
  const isActive = Object.values(activators).some(activator => activator(options))
  return isActive
}

export function registerActivator(activator) {
  Cypress.emit('register:activator', activator)  // update all instances
}

export function resetActivators() {
  const defaults = ['nofailOption', 'nofailEnvVar']
  Object.keys(activators).forEach(key => {
    if (!defaults.includes(key)) {
      delete activators[key]
    }
  })
}

Cypress.on('register:activator', activator => {
  const name = activator.name || `activator${Object.keys(activators).length}`
  activators[name] = activator
})

export function whenNextCmdIs(name) {
  // @ts-ignore
  const next = cy.state('current').get('next')
  return next?.get('name') === name
}

export function whenCmdInChain(name) {
  const chain = chainToArray()
  const nameInChain = chain.some(cmd => cmd.get('name') === name)
  return nameInChain
}

function chainToArray() {
  const commands = []
  // @ts-ignore
  let cmd = cy.state('current')
  commands.push(cmd)
  const chainerId = cmd.get('chainerId')
  cmd = cmd.get('next')
  let count = 0
  while (cmd && cmd.get('chainerId') === chainerId && ++count < 100) { 
    commands.push(cmd)
    cmd = cmd.get('next')
  }
  return commands
}
