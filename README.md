# cypress-pure-query

## Cypress queries that just return a result

Cypress 12 gave query commands a new API, but they still fail the test when the query fails. This is an experimental library that allows queries to be side-effect free.

As per the [CommandQuerySeparation](https://martinfowler.com/bliki/CommandQuerySeparation.html) principle:

<dl>
  <dt>Queries:</dt>
  <dd>Return a result and do not change the observable state of the system (are free of side effects)</dd>
  <dt>Commands:</dt>
  <dd>Change the state of a system but do not return a value</dd>
</dl>


## Uses

Build plugins such as  
- **soft-assert**
- **conditional testing**
- **retry with actions**  

-----------------------

## How to use

This library provides overrides for Cypress queries **get()**, **find()**, and **contains()**,  plus the various **traversal** queries. Also connectors **its()**, **invoke()**, and **within()**.

If the option `{nofail:true}` is passed, then the query will not fail the test.  

> ```js
> cy.get(selector, {nofail:true})  // does not fail if the selector is not found

For a sequence of queries, set `Cypress.env('nofail', true)`  

> ```js
> Cypress.env('nofail', true)
> cy.get(parent).find(child)     // neither query will fail

Queries that don't succeed will yield `null`. 

The next command in the chain can check the result and take appropriate action when `null` is passed in `subject`.

-----------------------

## Features

### Logging

Logging is an optional feature that modifies the Cypress GUI log entries for `nofail` queries in the following way:

- queries are prefixed by `~`
- failing queries are colored orange
- the tag `(failed)` is added when the query fails
- the tag `(skipped)` is added when the preceding query fails

With logging off, the standard Cypress log entries are output, except that error messages are not logged.

Here is a comparison

| normal logging                                   |  enhanced logging                        |
|:------------------------------------------------:|:----------------------------------------:|
| ![Logging example](./images/logging-normal.png)  | ![Logging example](./images/logging.png) |

### Custom activator

Pure query behavior can be activated with the `{nofail:true}` option for a single query, or `Cypress.env('nofail', true)` for a chain of queries, or dynamically with a **custom activator** function.

For example this `branch()` custom command uses function `branchActivator()` to turn on `nofail` for any query that precedes the `branch()` command.

```js
const branchActivator = () => whenNextCmdIs('branch')
registerActivator(branchActivator)

Cypress.Commands.add('branch', {prevSubject:true}, (subject, actions) => {
  if (subject) {
    actions.found(subject)
  } else {
    actions.notfound(subject)
  }
})
```

There are two helper functions provided to make it easy to check the command chain:

- `whenNextCmdIs` activates only the query immediately preceding

- `whenCmdInChain` activates any preceding query, back to the beginning of the chain (i.e same `chainerId`)

-----------------------

## How it works


Queries can be over-written to return a different ***inner function*** - this is the function that Cypress calls repeatedly during the timeout period. See [Documentation on Custom Queries](https://docs.cypress.io/api/cypress-api/custom-queries)

#### Query Factory 

This library uses the `queryFactory` module to generate an inner function which

- takes control of the timeout (bumps it by 500ms) so that Cypress does take action at the actual timeout
- returns a zero-length jQuery object up to timeout so that Cypress retries the inner function
- upon timeout returns `null` if the target is not found, which stops Cypress failing the chain
- if target is found pre-timeout, the non-zero jQuery object is returned and Cypress continues the chain
- if configured for logging, takes over the logging by setting option `{log:false}` and issuing custom logs with `Cypress.log()` calls

#### Negative assertions 

An overwrite to `.should()` does a pre-check of the assertion and writes the result back to the preceding query in the `assertionPassed` property.

This property is used to by the query to set state to passed.


------------------------------------------------------
Author: Fody &lt;FodyF@gmail.com&gt; &copy; 2023
