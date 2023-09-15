/// <reference types="cypress" />
// @ts-check

console.clear()

describe('traversals', {defaultCommandTimeout:300}, () => {

  const asyncLoadDelay = 100

  function isNull(x) {
    expect(x).to.eq(null)
  }

  it('first', () => {
    cy.get('#does-not-exist', {nofail:true})
      .first({nofail:true})
      .then(isNull) 
  })

  it('last', () => {
    cy.get('#does-not-exist', {nofail:true})
      .last({nofail:true})
      .then(isNull) 
  })

  it('next', () => {
    // cy.visit('cypress/html/first-middle-last.html')
    cy.mount(`<div id="first">first element</div>`)
    .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
    .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#last')
      .next({nofail:true})
      .then(isNull)

    cy.get('#first')
      .next('span', {nofail:true})
      .then(isNull)     

    cy.get('#first')
      .next('#does-not-exist', {nofail:true})
      .then(isNull)    
  })

  it('nextAll', () => {
    // cy.visit('cypress/html/first-middle-last.html')
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#last')
      .nextAll({nofail:true})
      .then(isNull)  

    cy.get('#first')
      .nextAll('span', {nofail:true})
      .then(isNull)     

    cy.get('#first')
      .nextAll('#does-not-exist', {nofail:true})
      .then(isNull)  
  })

  it('nextUntil', () => {
    // cy.visit('cypress/html/first-middle-last.html')
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#last')
      .nextUntil('span', undefined, {nofail:true}) // 2nd param required for @ts-check 
      .then(isNull)        

    cy.get('#first')
      .nextUntil('#last', 'span', {nofail:true})  
      .then(isNull)  

    cy.get('#last')
      .nextUntil('#does-not-exist', undefined, {nofail:true})  // 2nd param required for @ts-check
      .then(isNull) 

    cy.get('#first')
      .nextUntil('#last', '#does-not-exist', {nofail:true})
      .then(isNull)  
  })

  it('prev', () => {
    // cy.visit('cypress/html/first-middle-last.html')
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#first')
      .prev({nofail:true})
      .then(isNull)      

    cy.get('#last')
      .prev('span', {nofail:true})
      .then(isNull)      

    cy.get('#last')
      .prev('#does-not-exist', {nofail:true})
      .then(isNull)   
  })

  it('prevAll', () => {
    // cy.visit('cypress/html/first-middle-last.html')
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#first')
      .prevAll({nofail:true})
      .then(isNull)      

    cy.get('#last')
      .prevAll('span', {nofail:true})
      .then(isNull)       

    cy.get('#last')
      .prevAll('#does-not-exist', {nofail:true})
      .then(isNull)   
  })

  it('prevUntil', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#first')
      .prevUntil('span', undefined, {nofail:true})  // fails as nothing prev to #first
      .then(isNull)           

    cy.get('#last')         
      .prevUntil('#first', 'span', {nofail:true})   
      .then(isNull)       

    cy.get('#first')
      .prevUntil('#does-not-exist', undefined, {nofail:true})
      .then(isNull)  

    cy.get('#last')
      .prevUntil('#first', '#does-not-exist', {nofail:true})
      .then(isNull)      
  })

  it('parent', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.document()
      .parent({nofail:true})
      .then(isNull)    

    cy.get('#child')
      .parent('span', {nofail:true})
      .then(isNull)         

    cy.get('#child')
      .parent('#does-not-exist', {nofail:true})
      .then(isNull)    
  })

  it('parents', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.document()
      .parents({nofail:true})
      .then(isNull)    

    cy.get('#child')
      .parents('span', {nofail:true})
      .then(isNull)   

    cy.get('#child')
      .parents('#does-not-exist', {nofail:true})
      .then(isNull)     
  })

  it('parentsUntil', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.get('#child')
      .parentsUntil('div', undefined, {nofail:true})
      .then(isNull)  

    cy.get('#child')
      .parentsUntil('#grandparent', 'span', {nofail:true})
      .then(isNull)  
  })

  it('siblings', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#child')
      .siblings({nofail:true})
      .then(isNull)    

    cy.get('#first')
      .siblings('span', {nofail:true})
      .then(isNull)  

    cy.get('#first')
      .siblings('#does-not-exist', {nofail:true})
      .then(isNull)       
  })

  it('children', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.get('#child')
      .children({nofail:true})
      .then(isNull)     

    cy.get('#parent')
      .children('span', {nofail:true})
      .then(isNull)  

    cy.get('#parent')
      .children('#does-not-exist', {nofail:true})
      .then(isNull)      
  })

  it('filter', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('div')
      .filter('span', {nofail:true})
      .then(isNull)    

    cy.get('div')
      .filter('#does-not-exist', {nofail:true})
      .then(isNull)  

    cy.get('div')
      .filter(() => false, {nofail:true})
      .then(isNull)       
  })

  it('not', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('div')
      .not('div', {nofail:true})
      .then(isNull)    
  })

  it('closest', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.get('#child')
      .closest('span', {nofail:true})
      .then(isNull)   

    cy.get('#child')
      .closest('#does-not-exist', {nofail:true})
      .then(isNull)      
  })
})
