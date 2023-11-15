/// <reference types="cypress" />
// @ts-check

console.clear()

describe('traversals', {defaultCommandTimeout:150}, () => {

  const asyncLoadDelay = 50

  it('first', () => {
    cy.get('#does-not-exist', {nofail:true})
      .first({nofail:true})
      .isNull()
  })

  it('last', () => {
    cy.get('#does-not-exist', {nofail:true})
      .last({nofail:true})
      .isNull()
  })

  it('next', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#last')
      .next({nofail:true})
      .isNull()

    cy.get('#first')
      .next('span', {nofail:true})
      .isNull()    

    cy.get('#first')
      .next('#does-not-exist', {nofail:true})
      .isNull()   
  })

  it('nextAll', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#last')
      .nextAll({nofail:true})
      .isNull()  

    cy.get('#first')
      .nextAll('span', {nofail:true})
      .isNull()     

    cy.get('#first')
      .nextAll('#does-not-exist', {nofail:true})
      .isNull() 
  })

  it('nextUntil', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#last')
      // @ts-ignore - // 2nd param "filter" can be ommitted
      .nextUntil('span', {nofail:true}) 
      .isNull()        

    cy.get('#first')
      .nextUntil('#last', 'span', {nofail:true})  
      .isNull() 

    cy.get('#last')
      // @ts-ignore - // 2nd param "filter" can be ommitted
      .nextUntil('#does-not-exist', {nofail:true}) 
      .isNull() 

    cy.get('#first')
      .nextUntil('#last', '#does-not-exist', {nofail:true})
      .isNull() 
  })

  it('prev', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#first')
      .prev({nofail:true})
      .isNull()     

    cy.get('#last')
      .prev('span', {nofail:true})
      .isNull()      

    cy.get('#last')
      .prev('#does-not-exist', {nofail:true})
      .isNull()  
  })

  it('prevAll', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#first')
      .prevAll({nofail:true})
      .isNull()      

    cy.get('#last')
      .prevAll('span', {nofail:true})
      .isNull()      

    cy.get('#last')
      .prevAll('#does-not-exist', {nofail:true})
      .isNull()  
  })

  it('prevUntil', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#first')
      // @ts-ignore - // 2nd param "filter" can be ommitted
      .prevUntil('span', {nofail:true})  
      .isNull()          

    cy.get('#last')         
      .prevUntil('#first', 'span', {nofail:true})   
      .isNull()      

    cy.get('#first')
      // @ts-ignore - // 2nd param "filter" can be ommitted
      .prevUntil('#does-not-exist', {nofail:true})
      .isNull()  

    cy.get('#last')
      .prevUntil('#first', '#does-not-exist', {nofail:true})
      .isNull()      
  })

  it('parent', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.document()
      .parent({nofail:true})
      .isNull()   

    cy.get('#child')
      .parent('span', {nofail:true})
      .isNull()         

    cy.get('#child')
      .parent('#does-not-exist', {nofail:true})
      .isNull()   
  })

  it('parents', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.document()
      .parents({nofail:true})
      .isNull()    

    cy.get('#child')
      .parents('span', {nofail:true})
      .isNull()   

    cy.get('#child')
      .parents('#does-not-exist', {nofail:true})
      .isNull()     
  })

  it('parentsUntil', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.get('#child')
      // @ts-ignore - // 2nd param "filter" can be ommitted
      .parentsUntil('div', {nofail:true})
      .isNull()  

    cy.get('#child')
      .parentsUntil('#grandparent', 'span', {nofail:true})
      .isNull()  
  })

  it('siblings', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('#child')
      .siblings({nofail:true})
      .isNull()    

    cy.get('#first')
      .siblings('span', {nofail:true})
      .isNull()

    cy.get('#first')
      .siblings('#does-not-exist', {nofail:true})
      .isNull()       
  })

  it('children', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.get('#child')
      .children({nofail:true})
      .isNull()     

    cy.get('#parent')
      .children('span', {nofail:true})
      .isNull() 

    cy.get('#parent')
      .children('#does-not-exist', {nofail:true})
      .isNull()      
  })

  it('filter', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('div')
      .filter('span', {nofail:true})
      .isNull()    

    cy.get('div')
      .filter('#does-not-exist', {nofail:true})
      .isNull()  

    cy.get('div')
      .filter(() => false, {nofail:true})
      .isNull()       
  })

  it('not', () => {
    cy.mount(`<div id="first">first element</div>`)
      .appendAfter(`<div id="middle" style="color:orange">middle element<div id="child">child element</div></div>`, asyncLoadDelay)
      .appendAfter(`<div id="last" style="color:red">last element</div>`, asyncLoadDelay *2)

    cy.get('div')
      .not('div', {nofail:true})
      .isNull()    
  })

  it('closest', () => {
    cy.mount(`<div id="great-grandparent"></div>`)
      .appendChild(`<div id="grandparent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="parent" style="color:orange"></div>`, asyncLoadDelay)
      .appendChild(`<div id="child" style="color:red">child element</div>`, asyncLoadDelay *2)

    cy.get('#child')
      .closest('span', {nofail:true})
      .isNull()   

    cy.get('#child')
      .closest('#does-not-exist', {nofail:true})
      .isNull()      
  })
})
