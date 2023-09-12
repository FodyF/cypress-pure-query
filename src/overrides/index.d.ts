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

    find<K extends keyof HTMLElementTagNameMap>(selector: K, 
      options?: Partial<Loggable & Timeoutable & Shadow & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    find<E extends Node = HTMLElement>(selector: string, 
      options?: Partial<Loggable & Timeoutable & Shadow & NoFail>): Chainable<JQuery<E>>

  }
}