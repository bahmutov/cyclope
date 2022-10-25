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

it('starts with items', () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('todos', JSON.stringify(todos))
    },
  })
  // check the page
  cy.get('[data-cy=todo]')
    .should('have.length', 2)
    .then(($todos) => {
      todos.forEach((todo, k) => {
        expect($todos[k]).to.contain(todo.item)
        if (todo.isCompleted) {
          expect($todos[k]).to.have.class('checked')
        } else {
          expect($todos[k]).to.not.have.class('checked')
        }
      })
    })

  // add another item
  cy.get('[data-cy=add-todo]').type('write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 3)
  cy.window()
    .its('localStorage')
    .invoke('getItem', 'todos')
    .then(JSON.parse)
    .should('deep.equal', [
      ...todos,
      { item: 'write tests', isCompleted: false },
    ])

  // when you reload, the todos stay
  cy.reload()
  cy.get('[data-cy=todo]').should('have.length', 3)
})
