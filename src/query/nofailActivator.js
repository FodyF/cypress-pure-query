
let activators = [
  (options) => options.nofail,
  () => Cypress.env('nofail'),
]

export const activatorHandler = {
  nofailIsActive: (options) => {
    return activators.some(activator => activator(options))
  },
}
