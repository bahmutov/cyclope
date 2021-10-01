// @ts-check
/// <reference types="cypress" />

// https://github.com/ericclemmons/unique-selector
import unique from 'unique-selector'

export const jUnique = ($el) => unique($el[0])
