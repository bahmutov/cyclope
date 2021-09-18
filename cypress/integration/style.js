/// <reference types="cypress" />

describe('finding style urls', () => {
  it('finds url links', () => {
    const baseUrl = 'http://localhost:3777'
    const style = `
      :root { --ff-sans: "Josefin Sans", sans-serif; --base-font: 1.6rem; --fw-normal: 400; --fw-bold: 700;
      --img-bg: url('http://foo.bar/baz');
    `
    const replaced = style.replace(
      /url\('(?:ftp|http|https):\/\/[^ "]+'\)/g,
      (...match) => {
        console.log('match', match)
        debugger
        return 'url'
      },
    )
    cy.wrap(replaced)
  })
})
