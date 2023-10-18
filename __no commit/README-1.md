# cypress-cqs (Command-Query Separation)

### Utility allowing queries like `cy.get()` & `cy.find()` to not fail the test.

Cypress 12 divided introduced query commands with a new API, but query commands fail the test when the query fails.  

This library allows for queries to have no side-effects, as per the [CommandQuerySeparation Principle](https://martinfowler.com/bliki/CommandQuerySeparation.html):

> - **Queries:** Return a result and do not change the observable state of the system (are free of side effects).  
> - **Commands:** Change the state of a system but do not return a value.  

Use it to build Custom Queries for features such as 
- soft-assertion, 
- conditional test sequences, 
- command retry with actions.

## How does it work?

Referring to the [Custom Queries](https://docs.cypress.io/api/cypress-api/custom-queries) documentation, Cypress queries should return a query function that is called by the runner repeatedly until it passes or until a timeout is reached. 

This **inner function** normally returns a jQuery object which represents the result of the query. If it contains one or more subjects, the query passes. If it contains zero subjects, the query retries until the timeout, at which time the test fails.

**Returning `null`** from the query function stops the test from failing, as it did in Cypress 11 and before. However, it also stops the query from retrying, even if the timout has not yet been reached. So if you just substitute `null` for the zero-length jQuery object, you loose the retry capability.

### Handling the timeout  
To get around this, **cypress-cqs** takes control of the timeout by bumping up the timeout that the Cypress runner sees.  

Prior to `timeout` it returns a jQuery object (as per normal), but when timeout is reached it returns `null`. The runner then executes the next command in the chain, passing `null` as the new subject.

In this sense, **cypress-cqs** queries are ***not idempotent***, since they behave "normally" before timeout, and differently after it. 

### Query factory

This library provides a factory function to wrap the logic and make usage easy.  

For example, this is the overwrite for `cy.find()`

```js
import {queryFactory} from '../query/queryFactory'  

Cypress.Commands.overwriteQuery('find', function (originalFn, ...args) {
  let [selector, options = {}] = args  // ensure options
  return queryFactory(this, originalFn, selector, options)
})
```

### The { nofail: true } option  

Since you may not want to completely change the out-of-box behavior, the no-fail feature can be turned on by passing an option to the command

```js 
cy.get(selector, {nofail:true}).find(child, {nofail:true})  // will not fail if selector or child are not found
```

or for the whole chain, by setting an environment variable

```js
Cypress.env('nofail', true)
cy.get(selector).find(child)
```



