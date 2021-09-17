/// <reference types="cypress" />

import { savePageIfTestFailed } from '../../src'

it('can save the page after test failed', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 3)
})

afterEach(savePageIfTestFailed)
