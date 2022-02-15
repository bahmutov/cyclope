it('assumes HTTPS for resources', { baseUrl: null }, () => {
  cy.visit('cypress/integration/use-https/index.html')
  cy.get('img')
    .should('have.attr', 'src')
    .then(cy.log)
    // URL does not have a protocol, starts with "//"
    .should('match', /^\/\//)
  cy.savePage('use-https')
  // the resource without a protocol is assumed to be https
  cy.readFile('use-https/index.html')
    .should('include', '<img src="https://glebbahmutov.com/')
    // <link href="//..."> are transformed to https
    .and('include', 'href="https://example.com')
    // all "on*" attributes are removed to avoid loading
    .and('not.include', ' onloaded')
})
