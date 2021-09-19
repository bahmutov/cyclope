/// <reference types="cypress" />

import { savePage } from '../..'

it('creates accurate DOM snapshots', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 2).then(savePage('output'))
})
