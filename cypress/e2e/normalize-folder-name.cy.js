// @ts-check

import { removeUnsafeCharacters } from '../../src/utils'

it('removes unsafe characters from a string', () => {
  expect(removeUnsafeCharacters('page : bar & baz')).to.equal(
    'page - bar - baz',
  )
})

it('normalizes folder name', () => {
  cy.visit('/')
  cy.get('[data-cy=add-todo]')
    .type('Learn Cypress{enter}')
    .type('Write tests{enter}')
  cy.get('[data-cy=todo]').should('have.length', 2)
  cy.savePage('page : yes/some & invalid characters').then(console.log)
})
