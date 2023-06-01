// @ts-check
it('creates accurate DOM snapshots', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 2)
  cy.savePage('page/two-items')
})

it('test has special characters like >', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 2)
  cy.savePage('page/name with > character')
  // problematic character was removed
  cy.readFile('page/name with - character/index.html')
})
