// @ts-check
describe('themes', () => {
  // these tests change the page color theme
  // and save the full page
  beforeEach(() => {
    // https://on.cypress.io/session
    cy.session('prepare 3 todos', () => {
      cy.visit('/')
      cy.get('[data-cy=add-todo]')
        .type('code{enter}', { delay: 50 })
        .type('test{enter}', { delay: 50 })
        .type('rest{enter}', { delay: 50 })
      cy.get('[data-cy=todo]').should('have.length', 3)
    })
  })

  it('takes light screenshot', () => {
    cy.visit('/')
    cy.get('body').should('have.class', 'light')
    cy.get('[data-cy=todo]').should('have.length', 3).savePage('page/light')
  })

  it('takes night screenshot', () => {
    cy.visit('/')
    cy.get('#theme-switcher').click()
    cy.get('body').should('not.have.class', 'light')
    cy.get('[data-cy=todo]').should('have.length', 3).savePage('page/night')
  })
})
