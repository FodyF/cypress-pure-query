# cypress-pure-query

### Cypress queries that will not fail the test when the query fails.

Cypress 12 gave query commands a new API, but they still fail the test when the query fails. 

This library allows queries to be side-effect free, as per the [CommandQuerySeparation](https://martinfowler.com/bliki/CommandQuerySeparation.html) principle:


<table>
  <tbody>
    <tr style="border: none">
      <td style="border: none; font-weight: 600; vertical-align: text-top; ">Queries:</td>
      <td style="border: none; font-size: 14px">Return a result and do not change the observable state of the system (are free of side effects)</td>
    </tr>
    <tr style="border: none; background-color: white">
      <td style="border: none; font-weight: 600; vertical-align: text-top; ">Commands:</td>
      <td style="border: none; font-size: 14px">Change the state of a system but do not return a value</td>
    </tr>
  </tbody>
</table>

Use to build Custom Commands for features such as **soft-assertion, conditional test sequences, query retry with actions**
