/// <reference types="cypress" />

interface NoFail {
  /**
   * Indicates the query should return null instead of failing
   * 
   * @default false
   */
  nofail: boolean
}

declare namespace Cypress {
  interface Chainable {
    get(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow & NoFail>): Chainable<Subject>
  }
}