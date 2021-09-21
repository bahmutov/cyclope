/// <reference types="cypress" />

beforeEach(() => {
  // https://on.cypress.io/session
  cy.session('prepare 3 todos', () => {
    cy.visit('/')
    cy.get('[data-cy=add-todo]')
      .type('code{enter}', { delay: 50 })
      .type('test{enter}', { delay: 50 })
      .type('rest{enter}', { delay: 50 })
    cy.get('[data-cy=todo]').should('have.length', 3)
  })
})

it('starts with 3 todos', () => {
  cy.visit('/')
  cy.get('[data-cy=todo]').should('have.length', 3)
})

it('completes the last todo', () => {
  cy.visit('/')
  cy.get('[data-cy=todo]')
    .should('have.length', 3)
    .last()
    .find('.cb-input')
    .check()
  cy.get('[data-cy=todo] .cb-input').last().should('be.checked')
})
