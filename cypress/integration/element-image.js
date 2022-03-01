// @ts-check
it('element image', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 2)
  // get an image of the todos element
  cy.get('.todos').cyclope('todos.png', {
    elementSelector: '.todos',
  })
})

it('element image with stats', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 2)
  // get an image of the todos element
  cy.get('.stat').cyclope('stat.png', {
    elementSelector: '.stat',
  })
})

it('element image with todos and stats', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 2)
  // get an image of the todos and the stats below
  // https://github.com/bahmutov/cyclope/issues/43
  cy.get('.todos, .stat').cyclope('todos-and-stats.png', {
    elementSelector: '.todos, .stat',
  })
})
