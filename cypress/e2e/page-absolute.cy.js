// @ts-check

// the first test saved the page served by the web server
// the second test loads the saved static page
// and checks if the image loads correctly

describe('image edge cases', { viewportWidth: 1500 }, () => {
  it('handles absolute to relative resources', () => {
    cy.visit('/page-absolute')
    // normal image
    cy.get('img#image1', { timeout: 0 }).should(
      'have.prop',
      'naturalWidth',
      1440,
    )
    // image with srcset attribute
    cy.get('img#image2', { timeout: 0 }).should('have.prop', 'naturalWidth', 40)
    cy.savePage('page-absolute')
  })

  // these tests assume the previous test was successful

  it('loads the saved static page', { baseUrl: null }, () => {
    cy.visit('page-absolute/index.html')
    cy.get('img#image1', { timeout: 0 }).should(
      'have.prop',
      'naturalWidth',
      1440,
    )
  })

  it('loads the saved srcset image', { baseUrl: null }, () => {
    cy.visit('page-absolute/index.html')
    cy.get('img#image2', { timeout: 0 }).should('have.prop', 'naturalWidth', 40)
  })
})
