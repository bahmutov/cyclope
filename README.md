# cyclope
[![ci status][ci image]][ci url] [![renovate-app badge][renovate-badge]][renovate-app] [![CircleCI](https://circleci.com/gh/bahmutov/cyclope/tree/main.svg?style=svg)](https://circleci.com/gh/bahmutov/cyclope/tree/main) ![cypress version](https://img.shields.io/badge/cypress-8.4.0-brightgreen)
> Cypress DOM snapshots and consistent image diffing in the cloud

<h1>DO NOT USE. TOO EARLY ☠️</h1>

## Install

Add this plugin to your project. Assuming Cypress is a dev dependency

```shell
$ npm i -D cyclope
# or if you prefer yarn
$ yarn add -D cyclope
```

Include the plugin from your plugins file

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  require('cyclope/plugin')(on, config);

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
};
```

## Save the current page

If you need to save the current web application page, including any resources

```js
// cypress/integration/spec.js
import {savePage} from 'cyclope'

it('saves the page', () => {
  // normal Cypress commands
  cy.contains('.some-selector', 'some text')
    .should('be.visible')
    // when the app has reached the desired state
    // save the page in the folder "page"
    .then(savePage('page'))
})
```

All local resources like images and CSS should be saved as local files.

## Save the failed page

This module includes a utility function to save the page if the test has failed. You can use this function as `afterEach` hook, probably from the support file, so it applies to all tests.

```js
// cypress/support/index.js
import { savePageIfTestFailed } from 'cyclope'
afterEach(savePageIfTestFailed)
```

All pages are saved in the folder `cypress/failed/<spec name>/<test name>`.

**Tip:** store the `cypress/failed` as a test artifact on CI. If a test fails, download and open the `folder/index.html` to inspect the application's structure at the moment of failure.

[ci image]: https://github.com/bahmutov/cyclope/workflows/ci/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/cyclope/actions
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
