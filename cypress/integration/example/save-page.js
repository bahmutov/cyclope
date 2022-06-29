/// <reference types="cypress" />

describe('save page example', () => {
  it('saves page even with broken assets', () => {
    cy.visit('/');
    // trigger failure with 404 code, by attaching class with background that points to nowhere
    cy.get('body').invoke('addClass', 'no-image');
    cy.savePage('page', { ignoreFailed: true });
  })
})
