/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    mount(html: string): any
    appendChild(html: string): any
    appendAfter(html: string): any
    addToHead(html: string): any
    openWindow(url: string, features?: string): any
    isNull(subject: any): any
    isBody(subject: any): any
    metaTests(fn: function): any
  }
}
