// @ts-check

// https://github.com/bahmutov/cyclope/issues/83
it('handles import directive', () => {
  cy.visit('/import')
  cy.get('.imported')
    .should('have.css', 'border')
    .should('include', 'rgb(255, 0, 0)')
  cy.get('.imported2')
    .should('have.css', 'border')
    .should('include', 'rgb(0, 128, 0)')

  cy.log('**saving the page**')
  cy.savePage('import')
  cy.readFile('import/index.html').then((html) => {
    expect(html, 'html')
      .to.include("@import url('./import/app.css')")
      .and.to.include("@import url('./import/more-styles.css')")
  })
})
