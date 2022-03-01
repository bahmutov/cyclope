it('removes all iframes', { baseUrl: null }, () => {
  cy.visit('cypress/integration/iframes/index.html')
  cy.savePage('iframes', { removeIframes: true })
  // confirm the page was saved without iframe elements
  cy.readFile('iframes/index.html').should('not.include', '<iframe')
})
