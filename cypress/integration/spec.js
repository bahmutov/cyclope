/// <reference types="cypress" />

import { getDOMasHTML, saveRelativeResources } from '../..'

it('creates accurate DOM snapshots', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]')
    .should('have.length', 2)
    .then(getDOMasHTML)
    .then(saveRelativeResources('output'))
    .then((html) => {
      cy.writeFile('output/two-items-light.html', html)
    })
})
