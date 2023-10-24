describe('stop CSS animation', { baseUrl: null }, () => {
  it('handles absolute to relative resources', () => {
    cy.visit('cypress/e2e/animated/index.html')
    cy.savePage('animated')
  })
})
