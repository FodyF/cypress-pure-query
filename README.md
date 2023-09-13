# cypress-cqs (Command-Query Separation)

### Cypress pure queries that will not fail the test when the query fails.

Cypress 12 gave query commands a new API, but as before they still fail the test when the query fails. 

This library allows queries to be side-effect free, as per the [CommandQuerySeparation](https://martinfowler.com/bliki/CommandQuerySeparation.html) principle:

- **Queries:** Return a result and do not change the observable state of the system (are free of side effects).  
- **Commands:** Change the state of a system but do not return a value.  

Use it to build Custom Commands for features such as **soft-assertion, conditional test sequences, command retry with actions**.
