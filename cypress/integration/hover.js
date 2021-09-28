/// <reference types="cypress" />

import 'cypress-real-events/support'
import { jUnique } from './utils'
import { savePage } from '../../src'

Cypress.Commands.overwrite(
  'realHover',
  function realHover(realHover, subject, options) {
    console.log('realHover', subject, options)
    const selector = jUnique(subject)
    cy.log(`realHover **${selector}**`)
    // save the hovered selector
    cy.state('hovered', selector)
    realHover(subject, options)
  },
)

// using cypress-real-events to hover over the element
// https://github.com/dmtrKovalenko/cypress-real-events
// unfortunately limited to Chrome-based browsers
// and even Electron does not seem to register the hover event reliably
describe('hover', { browser: 'chrome' }, () => {
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
    cy.get('#theme-switcher').realHover()
  })
})
