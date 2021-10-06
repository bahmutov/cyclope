// @ts-check
import 'cypress-real-events/support'

import { savePage } from '../../src'

// using cypress-real-events to hover over the element
// https://github.com/dmtrKovalenko/cypress-real-events
// unfortunately limited to Chrome-based browsers
// and even Electron does not seem to register the hover event reliably
describe('hover', () => {
  // works correctly
  it('over the add todo button', () => {
    cy.visit('/')
    cy.get('[data-cy=add-todo]').type('hover{enter}').blur().wait(100)
    cy.get('.add .cb-container').realHover()
    cy.get('[data-cy=todo]')
      .should('have.length', 1)
      .then(savePage('page/hover'))
  })

  // not working since cannot select the right button to hover over
  it('over the middle todo', () => {
    cy.visit('/')
    cy.get('[data-cy=add-todo]')
      .type('first{enter}')
      .type('second{enter}')
      .type('third{enter}')
    cy.get('[data-cy=todo]')
      .should('have.length', 3)
      .eq(1)
      .realHover()
      .then(() => {
        savePage('page/hover-middle-todo')
      })
  })

  // not working correctly, complicated hover class
  it('over the active link', () => {
    cy.visit('/')
    cy.get('[data-cy=add-todo]').type('first{enter}')
    cy.get('button#active')
      .realHover()
      .then(() => {
        savePage('page/hover-active')()
      })
  })

  it.only('over the theme switcher', () => {
    cy.visit('/')
    cy.get('[data-cy=add-todo]').type('text title')
    cy.get('#theme-switcher').realHover()
    cy.clope('hover-over-sun.png')
    cy.contains('Clear Completed')
      .realHover()
      // .cyclope is an alias to .clope
      .cyclope('hover-over-clear-completed.png')
    cy.get('#theme-switcher').click()
    cy.get('body').should('not.have.class', 'light')
    // hmm, this is not working
    cy.contains('Active').realHover().clope('hover-over-active.png')
  })
})
