# cypress-pure-query

### Cypress queries that just return a result

Cypress 12 gave query commands a new API, but they still fail the test when the query fails. This is an experimental library that allows queries to be side-effect free, as per the [CommandQuerySeparation](https://martinfowler.com/bliki/CommandQuerySeparation.html) principle:

<dl>
  <dt>Queries:</dt>
  <dd>Return a result and do not change the observable state of the system (are free of side effects)</dd>
  <dt>Commands:</dt>
  <dd>Change the state of a system but do not return a value</dd>
</dl>

<br/>  

## Uses

Build plugins such as  
- **soft-assert**
- **conditional testing**
- **retry with actions**  

<br/>  

## How to use

Add the option `{nofail:true}` to the query to affect an individual query.  
>  `cy.get(selector, {nofail:true})`

or set the environment variable `Cypress.env('nofail', true)` to turn on for multiple queries.
> ```js
> Cypress.env('nofail', true)
> cy.get(parent).find(child)

Queries that fail will return `null` to the Cypress chain, allowing the following commands to check the result and take appropriate action.

<br/>  

## Features

### Logging

With logging turned off, the same Cypress log entries are produced, except that error messages are not logged.

Add the logging module by importing it in the spec or support (cypress/support/e2e.js)

```js
import '@src/query/log.js'
````

The Cypress log entries for `nofail` queries are enhanced:

- queries are prefixed by `~`
- failing queries are colored orange
- the tag `(failed)` is added when the query fails
- the tag `(skipped)` is added when the preceding query fails

Here is a comparison

| normal logging                                   |  enhanced logging                        |
|:------------------------------------------------:|:----------------------------------------:|
| ![Logging example](./images/logging-normal.png)  | ![Logging example](./images/logging.png) |



------------------------------------------------------
Author: Fody &lt;FodyF@gmail.com&gt; &copy; 2023
