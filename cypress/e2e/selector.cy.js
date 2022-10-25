/// <reference types="cypress" />

// https://github.com/ericclemmons/unique-selector
import unique from 'unique-selector'
import { jUnique } from '../../src/utils'

// these tests check how the "unique-selector" helper
// returns good test selectors
describe('unique selector', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('returns selector for add field', () => {
    cy.get('[data-cy=add-todo]')
      // jQuery to DOM element ourselves
      .then(($el) => {
        return unique($el[0])
      })
      .should('equal', '#addt')

    // use wrapper function
    cy.get('[data-cy=add-todo]').then(jUnique).should('equal', '#addt')
  })

  it('returns selector for add button', () => {
    cy.get('#add-btn').then(jUnique).should('equal', '#add-btn')
  })

  it('returns selector for Active filter', () => {
    cy.contains('button', 'Active').then(jUnique).should('equal', '#active')
  })

  it('returns selector for todo', () => {
    cy.get('[data-cy=add-todo]')
      .type('first{enter}')
      .type('second{enter}')
      .type('third{enter}')
    cy.get('[data-cy=todo]')
      .should('have.length', 3)
      .eq(1)
      .then(jUnique)
      .should('equal', '.todos > :nth-child(2)')
  })
})
