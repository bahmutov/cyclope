// @ts-check
// https://github.com/bahmutov/cyclope/issues/14
it('shows input values', () => {
  cy.visit('/')
  // type into an input field so it stays there
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress')
    .should('have.value', 'Learn Cypress')
    .savePage('page/input-values')

  cy.get('[data-cy=add-todo]')
    .clear()
    .type('and test{enter}')
    .type('code code')
    .savePage('page/input-values2')
})
