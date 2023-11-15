// @ts-check

const {_} = Cypress

let activators = [
  (options) => options.nofail || _.has(options, 'nofailDefault'), 
  () => Cypress.env('nofail'),
]

export const activatorHandler = {
  nofailIsActive: (options) => {
    return activators.some(activator => activator(options))
  },
}
