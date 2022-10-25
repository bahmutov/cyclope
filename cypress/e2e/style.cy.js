/// <reference types="cypress" />

import { utils } from '../../src'

describe('finding style urls', () => {
  it('finds url links', () => {
    const baseUrl = 'http://localhost:3777'
    const style = `
      :root { --ff-sans: "Josefin Sans", sans-serif; --base-font: 1.6rem; --fw-normal: 400; --fw-bold: 700;
      --img-bg: url('http://localhost:3777/assets/images/bg-desktop-dark.jpg');
      something after that
      another url: url('http://localhost:3777/light.jpg');
    `
    const expected = `
      :root { --ff-sans: "Josefin Sans", sans-serif; --base-font: 1.6rem; --fw-normal: 400; --fw-bold: 700;
      --img-bg: url('./assets/images/bg-desktop-dark.jpg');
      something after that
      another url: url('./light.jpg');
    `

    const result = utils.replaceUrls(baseUrl, style)
    expect(result).to.have.keys('urls', 'replaced')
    const { urls, replaced } = result

    cy.wrap(urls).should('deep.equal', [
      'http://localhost:3777/assets/images/bg-desktop-dark.jpg',
      'http://localhost:3777/light.jpg',
    ])
    cy.wrap(replaced).should('deep.equal', expected)
  })
})
