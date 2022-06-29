/// <reference types="cypress" />

describe('save page example', () => {
  it('saves page', () => {
    cy.visit('/')
    cy.savePage('page')
  })

  it('saves page even with broken assets', () => {
    cy.visit('/index-fail-asset')
    cy.savePage('page-with-fail-assets', { ignoreFailedAssets: true })
  })
})
