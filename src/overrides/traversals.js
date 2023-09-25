import { queryFactory } from '../query'

const traversals = [
  'eq', 
  'first', 
  'last', 
  'next', 
  'nextAll', 
  'nextUntil', 
  'prev', 
  'prevAll', 
  'prevUntil', 
  'parent', 
  'parents', 
  'parentsUntil',
  'siblings', 
  'children',
  'filter', 
  'not',
  'closest',
]

traversals.forEach(traversal => {
  Cypress.Commands.overwriteQuery(traversal, function (originalFn, arg1, arg2, userOptions) {

    const {_} = Cypress
    if (_.isObject(arg1) && !_.isFunction(arg1)) {
      userOptions = arg1
      arg1 = null
    }
    if (_.isObject(arg2) && !_.isFunction(arg2)) {
      userOptions = arg2
      arg2 = null
    }

    const queryFn = queryFactory(this, originalFn, arg1, arg2, userOptions)
    return queryFn
  })
})
