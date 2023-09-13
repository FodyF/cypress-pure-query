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
    
    contains(content: string | number | RegExp, 
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow & NoFail>): Chainable<Subject>

    contains<K extends keyof HTMLElementTagNameMap>(selector: K, content: string | number | RegExp, 
      options?: Partial<Loggable & Timeoutable & CaseMatchable & Shadow & NoFail>
    ): Chainable<JQuery<HTMLElementTagNameMap[K]>>

    contains<E extends Node = HTMLElement>(selector: string, content: string | number | RegExp, 
      options?: Partial<Loggable & Timeoutable & CaseMatchable & Shadow & NoFail>
    ): Chainable<JQuery<E>>

    find<K extends keyof HTMLElementTagNameMap>(selector: K, 
      options?: Partial<Loggable & Timeoutable & Shadow & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    find<E extends Node = HTMLElement>(selector: string, 
      options?: Partial<Loggable & Timeoutable & Shadow & NoFail>): Chainable<JQuery<E>>
      
    get(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow & NoFail>): Chainable<Subject>

  }
}