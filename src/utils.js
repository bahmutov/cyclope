// @ts-check
/// <reference types="cypress" />

// https://github.com/ericclemmons/unique-selector
const unique = require('unique-selector')

const jUnique = ($el) => unique($el[0])

module.exports = { jUnique }
