// @ts-check

// https://github.com/bahmutov/cyclope/issues/83
it('handles import directive', () => {
  // the page includes CSS import from 3rd party domain
  cy.intercept(
    'GET',
    'https://other-domain.acme/style.css',
    `
      .imported3 {
        border: 2px solid blue;
      }
    `,
  ).as('css')

  cy.visit('/import')
  cy.wait('@css')

  // relative CSS import
  cy.get('.imported')
    .should('have.css', 'border')
    .should('include', 'rgb(255, 0, 0)')
  // absolute CSS import
  cy.get('.imported2')
    .should('have.css', 'border')
    .should('include', 'rgb(0, 128, 0)')
  // 3rd-party domain CSS import
  cy.get('.imported3')
    .should('have.css', 'border')
    .should('include', 'rgb(0, 0, 255)')

  cy.log('**saving the page**')
  cy.savePage('import')
  cy.readFile('import/index.html').then((html) => {
    expect(html, 'html')
      .to.include("@import url('./import/app.css')")
      .and.to.include("@import url('./import/more-styles.css')")
      .and.to.not.include('undefined')
  })
})
