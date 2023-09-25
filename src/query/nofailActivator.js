
let activators = [
  (options) => options.nofail,
  () => Cypress.env('nofail'),
]

export const activatorHandler = {
  softFailIsActive: (options) => {
    return activators.some(activator => activator(options))
  },
}