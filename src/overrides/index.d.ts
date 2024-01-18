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
    state: any
    commandFns: any
    addCommand: any
  }
}

declare namespace Cypress {
  interface Chainable {
       
    children<E extends Node = HTMLElement>(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
    children<K extends keyof HTMLElementTagNameMap>(selector: K, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    children<E extends Node = HTMLElement>(selector: string, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>

    closest<K extends keyof HTMLElementTagNameMap>(selector: K, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    closest<E extends Node = HTMLElement>(selector: string, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
  
    contains(content: string | number | RegExp, 
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow & NoFail>): Chainable<Subject>

    contains<K extends keyof HTMLElementTagNameMap>(selector: K, content: string | number | RegExp, 
      options?: Partial<Loggable & Timeoutable & CaseMatchable & Shadow & NoFail>
    ): Chainable<JQuery<HTMLElementTagNameMap[K]>>

    contains<E extends Node = HTMLElement>(selector: string, content: string | number | RegExp, 
      options?: Partial<Loggable & Timeoutable & CaseMatchable & Shadow & NoFail>
    ): Chainable<JQuery<E>>

    eq<E extends Node = HTMLElement>(index: number, options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
   
    filter<K extends keyof HTMLElementTagNameMap>(selector: K, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>> // automatically returns the correct HTMLElement type
    filter<E extends Node = HTMLElement>(selector: string, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
    filter<E extends Node = HTMLElement>(fn: (index: number, element: E) => boolean, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>

    find<K extends keyof HTMLElementTagNameMap>(selector: K, 
      options?: Partial<Loggable & Timeoutable & Shadow & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    find<E extends Node = HTMLElement>(selector: string, 
      options?: Partial<Loggable & Timeoutable & Shadow & NoFail>): Chainable<JQuery<E>>
      
    first(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<Subject>
    
    focused(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery>
    
    get(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow & NoFail>): Chainable<Subject>

    last<E extends Node = HTMLElement>(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>

    next<K extends keyof HTMLElementTagNameMap>(selector: K, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    next<E extends Node = HTMLElement>(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
    next<E extends Node = HTMLElement>(selector: string, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>

    nextAll<K extends keyof HTMLElementTagNameMap>(selector: K, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    nextAll<E extends HTMLElement = HTMLElement>(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
    nextAll<E extends HTMLElement = HTMLElement>(selector: string, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>

    nextUntil<K extends keyof HTMLElementTagNameMap>(selector: K, filter?: string, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    nextUntil<E extends Node = HTMLElement>(selector: string, filter?: string, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
    nextUntil<E extends Node = HTMLElement>(element: E | JQuery<E>, filter?: string, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>

    not(selector: string, options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery>

    parent<K extends keyof HTMLElementTagNameMap>(selector: K, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    parent<E extends Node = HTMLElement>(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
    parent<E extends Node = HTMLElement>(selector: string, 
      options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
    
      parents<K extends keyof HTMLElementTagNameMap>(selector: K, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
      parents<E extends Node = HTMLElement>(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
      parents<E extends Node = HTMLElement>(selector: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
  
      parentsUntil<K extends keyof HTMLElementTagNameMap>(selector: K, filter?: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
      parentsUntil<E extends Node = HTMLElement>(selector: string, filter?: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
      parentsUntil<E extends Node = HTMLElement>(element: E | JQuery<E>, filter?: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
  
      prev<K extends keyof HTMLElementTagNameMap>(selector: K, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
      prev<E extends Node = HTMLElement>(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
      prev<E extends Node = HTMLElement>(selector: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
  
      prevAll<K extends keyof HTMLElementTagNameMap>(selector: K, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
      prevAll<E extends Node = HTMLElement>(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
      prevAll<E extends Node = HTMLElement>(selector: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
  
      prevUntil<K extends keyof HTMLElementTagNameMap>(selector: K, filter?: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
      prevUntil<E extends Node = HTMLElement>(selector: string, filter?: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
      prevUntil<E extends Node = HTMLElement>(element: E | JQuery<E>, filter?: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
  
      siblings<K extends keyof HTMLElementTagNameMap>(selector: K, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
      siblings<E extends Node = HTMLElement>(options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
      siblings<E extends Node = HTMLElement>(selector: string, 
        options?: Partial<Loggable & Timeoutable & NoFail>): Chainable<JQuery<E>>
     
  }
}