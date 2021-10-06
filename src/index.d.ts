// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Creates an accurate image from the current page using
     * an external Cyclope image service
     * @param outputImageFilename string Output PNG filename to save
     * @alias cyclope
     */
    clope(outputImageFilename: string): Chainable<void>
    /**
     * Creates an accurate image from the current page using
     * an external Cyclope image service
     * @param outputImageFilename Output PNG filename to save
     * @alias clope
     */
    cyclope(outputImageFilename: string): Chainable<void>
  }
}
