// @ts-check

// the first test saved the page served by the web server
// the second test loads the saved static page
// and checks if the CSS loads correctly
// https://github.com/bahmutov/cyclope/issues/98

describe('escape CSS', { baseUrl: null }, () => {
  it('handles absolute to relative resources', () => {
    cy.visit('cypress/e2e/escape-css/index.html')
    cy.log('**links are not underlined**')
    cy.get('main a')
      .should('have.css', 'text-decoration')
      .should('include', 'none')
    cy.savePage('escape-css')
  })

  // these tests assume the previous test was successful

  it('loads the saved static page', () => {
    cy.visit('escape-css/index.html')
    cy.log('**links are not underlined**')
    cy.get('main a')
      .should('have.css', 'text-decoration')
      .should('include', 'none')
  })
})
