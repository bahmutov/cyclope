/// <reference types="cypress" />

import { seePage } from '../../src'

it('upload zip to image', () => {
  cy.visit('/')
  // switch to the dark theme
  cy.get('body').should('have.class', 'light')
  cy.get('#theme-switcher').click()
  cy.get('body').should('not.have.class', 'light')

  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]')
    .should('have.length', 2)
    .eq(1)
    .find('.cb-input')
    .check()
  cy.get('.cb-input')
    .eq(1)
    .should('be.checked')
    .then(seePage('dark-checkbox.png'))

  // switch to the light theme
  cy.get('#theme-switcher').click()
  cy.get('body')
    .should('have.class', 'light')
    .then(seePage('light-checkbox.png'))
})
