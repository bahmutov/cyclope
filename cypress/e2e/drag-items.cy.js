/// <reference types="cypress" />

const todos = [
  {
    item: 'first',
    isCompleted: false,
  },
  {
    item: 'two',
    isCompleted: true,
  },
]

it('drags an item', () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('todos', JSON.stringify(todos))
    },
  })
  // let's take the second item and start dragging it
  cy.get('[data-cy=todo]').should('have.length', 2).eq(1).trigger('dragstart')
  cy.get('[data-cy=todo]').eq(1).should('have.class', 'dragging')

  // to drag it over, call "dragover" targeting at the item we want to replace
  cy.get('[data-cy=todo]').then(($todos) => {
    // make sure to bubble the event, because the "dragover" event
    // is received by the "todos" element
    $todos[0].dispatchEvent(new CustomEvent('dragover', { bubbles: true }))
    // and the element we are dragging should know it has completed dragging
    $todos[1].dispatchEvent(new CustomEvent('dragend'))
  })

  cy.get('[data-cy=todo]').first().should('not.have.class', 'dragging')

  // the todo items have changed the order
  cy.get('[data-cy=todo]').should(($todos) => {
    expect($todos[0]).to.have.text('two')
    expect($todos[1]).to.have.text('first')
  })
  // confirm the todos have been saved in the local storage
  // in the reverse order
  cy.window()
    .its('localStorage')
    .invoke('getItem', 'todos')
    .then(JSON.parse)
    .should('deep.equal', [todos[1], todos[0]])
})
