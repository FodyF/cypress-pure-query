# cypress-cqs (Command-Query Separation)

### A utility library to allow queries like `cy.get()`, `cy.find()` to return null when the query fails.

Cypress 12 divided commands into query commands and action commands. But query commands fail the whole test when the query fails. This library allows for queries to have no side-effects, as per [CommandQuerySeparation](https://martinfowler.com/bliki/CommandQuerySeparation.html):

- **Queries:** Return a result and do not change the observable state of the system (are free of side effects).  
- **Commands:** Change the state of a system but do not return a value.  

Use it to build Custom Commands for features such as soft-assertion, conditional test sequences, command retry with actions.

## How does it work?

Referring to the [Custom Queries](https://docs.cypress.io/api/cypress-api/custom-queries) documentation, Cypress queries should return a query function that is called by the runner repeatedly until it passes, or until a timeout is reached. 

This **inner function** normally returns a jQuery object which represents the result of the query. If it contains one or more subjects, the query passes. If it contains zero subjects, the query retries until the timeout, at which time the test fails.

But returning `null` from the query function stops the test from failing, as it did in Cypress 11 and before. However, it also stops the query from retrying, even if the timout has not yet been reached.

To get around this limitation, **cypress-cqs** takes control of the timeout mechanism by bumping up the timeout that the Cypress runner sees.  
Prior to timeout it returns a jQuery object (as per normal execution), but when timeout is reached it returns `null` - this becomes the new subject and is passed on to the next command.

In this sense, **cypress-cqs** queries are *not idempotent*, since they behave "normally" before timeout, and differently after it. 





