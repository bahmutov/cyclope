/// <reference types="cypress" />

import 'cypress-real-events/support'
import { savePage } from '../../src'

// using cypress-real-events to hover over the element
// https://github.com/dmtrKovalenko/cypress-real-events
// unfortunately limited to Chrome-based browsers
// and even Electron does not seem to register the hover event reliably
it('saves page with hover state', { browser: 'chrome' }, () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]').type('hover{enter}').blur().wait(100)
  cy.get('.add .cb-container').realHover()
  cy.get('[data-cy=todo]').should('have.length', 1).then(savePage('page/hover'))
})
