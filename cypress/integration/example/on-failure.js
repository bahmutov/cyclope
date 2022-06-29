/// <reference types="cypress" />

import { savePageIfTestFailed } from '../../../src'

describe('failing example', () => {
  context('inner', () => {
    it('can save the page after test failed', () => {
      cy.visit('/')
      cy.get('[data-cy=add-todo]')
        .type('Learn Cypress{enter}')
        .type('Write tests{enter}')
      cy.get('[data-cy=todos]', { timeout: 500 }).should('have.length', 2)
    })
  })
})

afterEach(() => savePageIfTestFailed({ ignoreFailedAssets: true }))
