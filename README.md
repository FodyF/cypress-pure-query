# cypress-pure-query

### Cypress queries that will not fail the test when the query fails.

Cypress 12 gave query commands a new API, but they still fail the test when the query fails. 

This library allows queries to be side-effect free, as per the [CommandQuerySeparation](https://martinfowler.com/bliki/CommandQuerySeparation.html) principle:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Queries:** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Return a result and do not change the observable state of the system (are free of side effects).  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Commands:** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Change the state of a system but do not return a value.  

Use to build Custom Commands for features such as **soft-assertion, conditional test sequences, query retry with actions**
