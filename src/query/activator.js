// @ts-check

const {_} = Cypress

/**
 * Map of all activator function
 * Exported only for testing, do not modify directly
 * Instead use helper functions below
 **/
export const activators = {
  nofailOption: (options) => options?.nofail || _.has(options, 'nofailDefault'), 
  nofailEnvVar: () => Cypress.env('nofail'),
}

/**
 * Check all activator functions to see if the nofail option
 * should be applied to the current query
 * @param {object} options 
 * @returns {Boolean}
 **/
export function nofailIsActive(options) {
  const isActive = Object.values(activators).some(activator => activator(options))
  return isActive
}

/**
 * Register a function to be checked in query outerFn 
 * to see if the nofail should be turned on
 * @param {function} activator 
 **/
export function registerActivator(activator) {
  Cypress.emit('register:activator', activator)  // update all instances
}

/**
 * Remove all custom activators
 **/
export function resetActivators() {
  const defaults = ['nofailOption', 'nofailEnvVar']
  Object.keys(activators).forEach(key => {
    if (!defaults.includes(key)) {
      delete activators[key]
    }
  })
}

/**
 * Handle the register:activator event
 * This event is emitted from registerActivator function
 * to allow all instances of the `activators` object to be updated
 **/
Cypress.on('register:activator', activator => {
  const name = activator.name || `activator${Object.keys(activators).length}`
  activators[name] = activator
})

/**
 * Helper function to check if the command after the query has a certain name
 * Use in a custom command to activate nofail for a single preceding query
 * @param {string} name 
 * @returns {Boolean}
 **/
export function whenNextCmdIs(name) {
  // @ts-ignore
  const next = cy.state('current').get('next')
  return next?.get('name') === name
}

/**
 * Helper function to check if the command with a certain name is in the chain
 * Use in a custom command to activate nofail for a any preceding query in the chain
 * @param {string} name 
 * @returns {Boolean}
 **/
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
