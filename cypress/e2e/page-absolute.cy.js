// @ts-check

// the first test saved the page served by the web server
// the second test loads the saved static page
// and checks if the image loads correctly

it('handles absolute to relative resources', () => {
  cy.visit('/page-absolute')
  cy.get('img', { timeout: 0 }).should('have.prop', 'naturalWidth', 1440)
  cy.savePage('page-absolute')
})

// SKIP https://github.com/bahmutov/cyclope/issues/95
it('loads the saved static page', { baseUrl: null }, () => {
  cy.visit('page-absolute/index.html')
  cy.get('img', { timeout: 0 }).should('have.prop', 'naturalWidth', 1440)
})
