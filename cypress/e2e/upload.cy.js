// @ts-check
it('upload zip to image', () => {
  cy.visit('/')
  // switch to the dark theme
  cy.get('body').should('have.class', 'light')
  cy.get('#theme-switcher').click()
  cy.get('body').should('not.have.class', 'light')

  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]')
    .should('have.length', 2)
    .eq(1)
    .find('.cb-input')
    .check()
  cy.get('.cb-input').eq(1).should('be.checked')
  cy.clope('dark-checkbox.png')

  // switch to the light theme
  cy.get('#theme-switcher').click()
  cy.get('body').should('have.class', 'light')
  cy.clope('light-checkbox.png')

  // get an image of the todos and the stats below
  // cy.get('.todos').cyclope('todos-and-stats.png')
})
