/// <reference types="cypress" />

declare namespace Cypress {

  interface QueryConfig {
    queryId: number
    handleLoggingInQuery: boolean
    runnerTimeoutBump: number
  }

  interface Cypress {
    queryConfig: QueryConfig
  }
}
