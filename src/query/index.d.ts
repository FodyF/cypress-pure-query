/// <reference types="cypress" />

declare namespace Cypress {

    /**
   * Interface for the configuration properties of queryFactory
   *
   * Members:
   *  queryId - incremental id for query returned by queryFactory, useful in debugging
   *  handleLogging - turn on to add artifacts to the Cypress log
   *  handleErrors - turn on to record errors that would otherwise be logged
   *  runnerTimeoutBump - amount of ms to increase query timeout by, to enable timeout to be handled locally
   */
  type debugFormat = 'flat' | 'block' | 'flow'
  interface QueryConfig {
    queryId: number
    handleLogging: boolean
    handleErrors: boolean
    runnerTimeoutBump: number
    debug: debugFormat | function
  }

  interface QueryError {
    queryId: number
    cmd: string
    error: Error
  }

  interface QueryLogConfig extends Cypress.LogConfig {
    type: 'parent' | 'child' | 'query'                   // extending
    visible: Boolean                                     // missing from LogConfig
    state: String                                        // missing from LogConfig
    ended: Boolean                                       // missing from LogConfig
  }

  interface QueryLog extends Cypress.Log {
    get<K extends keyof QueryLogConfig>(attr: K): QueryLogConfig[K]
    get(): QueryLogConfig
    set<K extends keyof QueryLogConfig>(key: K, value: QueryLogConfig[K]): Log
    set(options: Partial<QueryLogConfig>): Log
  }

  interface QueryErrorHandler {
    errorName: string
    errorMatch: regex
    default: any
  }

  interface QueryState {
    assertionPassed: Boolean
    baseMessage: string
  }

  interface Query extends Cypress.Command {
    queryState: QueryState
  }

  interface Cypress {
    query: Query
    queryConfig: QueryConfig
    queryLog: QueryLog
    queryLogConfig: QueryLogConfig
    queryErrorList: QueryError[]
  }
}

interface QueryLogging {
  emitToCypressLog(
    log: Cypress.QueryLog, 
    queryParams: String[], 
    options: Object, 
    subject: Cypress.Chainable<any>, 
    $el: any, 
    found: Boolean, 
    caughtError: Error
  )
}

declare namespace Cypress {
  interface Chainable {
    activateLogging(): any
    deactivateLogging(): any
    queryErrors(expected?: string[]): Chainable<any> | undefined
    resetQueryErrors(): any
 }
}
