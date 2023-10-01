/// <reference types="cypress" />

declare namespace Cypress {

  interface QueryConfig {
    queryId: number
    handleLoggingInQuery: boolean
    runnerTimeoutBump: number
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

  interface Cypress {
    queryConfig: QueryConfig
    queryLog: QueryLog
    queryLogConfig: QueryLogConfig
  }
}

interface QueryLogging {
  emitToCypressLog(
    log: Cypress.Log, 
    queryParams: String[], 
    options: Object, 
    subject: Cypress.Chainable<any>, 
    $el: JQuery<any>, 
    found: Boolean, 
    caughtError: Error
  )
}
