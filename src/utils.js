// @ts-check

// https://github.com/ericclemmons/unique-selector
const unique = require('unique-selector').default

if (typeof unique !== 'function') {
  console.error('unique is', unique)
  throw new Error('unique-selector is not a function')
}

const jUnique = ($el) => unique($el[0])

/**
 * Removes characters that are unsafe inside a filename
 * @param {string} str
 */
function removeUnsafeCharacters(str) {
  return str.replace(/[:&]/g, '-')
}

/**
 * Just like "path.join"
 * @param {string[]} parts
 */
function pathJoin(...parts) {
  return parts.join('/')
}

module.exports = { jUnique, removeUnsafeCharacters, pathJoin }
