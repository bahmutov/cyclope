/// <reference types="cypress" />

import { savePage } from '../..'

it('shows checkboxes', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]')
    .should('have.length', 2)
    .first()
    .find('.cb-input')
    .check()
  cy.get('[data-cy=todo]:eq(0) .cb-input')
    .should('be.checked')
    .then(savePage('checkbox'))

  cy.get('[data-cy=todo]:eq(0) .cb-input').uncheck()
  cy.get('[data-cy=todo]:eq(0) .cb-input').should('not.be.checked')
})
