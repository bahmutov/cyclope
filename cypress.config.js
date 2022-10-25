const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportWidth: 500,
  experimentalSessionSupport: true,
  env: {
    cyclope: {
      skipUploadWithoutUrl: true,
    },
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3777',
    excludeSpecPattern: ['utils.js', '*.html'],
  },
})
