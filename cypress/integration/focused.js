// @ts-check
it('saves page with focused text element', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 2)
  cy.get('[data-cy=add-todo]').should('be.focused').savePage('page/focused')
})
