// @ts-check

// https://github.com/bahmutov/cyclope/issues/83
it('handles import directive', () => {
  cy.visit('/import')
  cy.get('.imported')
    .should('have.css', 'border')
    .should('include', 'rgb(255, 0, 0)')
  cy.savePage('import')
  cy.readFile('import/index.html').then((html) => {
    expect(html, 'html').to.include("@import url('./import/app.css')")
  })
})
