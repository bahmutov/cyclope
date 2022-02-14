it('assumes HTTPS for resources', { baseUrl: null }, () => {
  cy.visit('cypress/integration/use-https/index.html')
  cy.get('img')
    .should('have.attr', 'src')
    .then(cy.log)
    // URL does not have a protocol, starts with "//"
    .should('match', /^\/\//)
  cy.savePage('use-https')
})
