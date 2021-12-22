# cyclope
[![ci status][ci image]][ci url] [![renovate-app badge][renovate-badge]][renovate-app] [![CircleCI](https://circleci.com/gh/bahmutov/cyclope/tree/main.svg?style=svg)](https://circleci.com/gh/bahmutov/cyclope/tree/main) ![cypress version](https://img.shields.io/badge/cypress-8.7.0-brightgreen)
> Cypress DOM snapshots and consistent image diffing in the cloud

<h1>DO NOT USE. TOO EARLY ☠️</h1>

## Videos

- [Cyclope: Save A Full Page With Styles If A Cypress Test Fails](https://youtu.be/yt5eVUOxf_0)
- [Use LocalStorage From Cypress Test To Set Initial Data](https://youtu.be/KZqYqsjgKco)
- [Test Dragging Items](https://youtu.be/mmKOSQxQwEU)
- [Introduction to cy.session command](https://youtu.be/DlGQEQ2q35w)

## Install

Add this plugin to your project. Assuming Cypress is a dev dependency

```shell
$ npm i -D cyclope
# or if you prefer yarn
$ yarn add -D cyclope
```

Include the plugin from your support file or an individual spec file

```js
// cypress/support/index.js
import 'cyclope'
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
it('saves the page', () => {
  // normal Cypress commands
  cy.contains('.some-selector', 'some text')
    .should('be.visible')
    // when the app has reached the desired state
    // save the page in the folder "page"
    .savePage('page')
})
```

All local resources like images and CSS should be saved as local files. You can create a zip archive

```js
// use .zip extension to zip the folder into a file
cy.savePage('page.zip')
```

When saving the zip, the function yields an object with filename, width, and height properties.

## Save the failed page

This module includes a utility function to save the page if the test has failed. You can use this function as `afterEach` hook, probably from the support file, so it applies to all tests.

```js
// cypress/support/index.js
import { savePageIfTestFailed } from 'cyclope'
afterEach(savePageIfTestFailed)
```

All pages are saved in the folder `cypress/failed/<spec name>/<test name>`.

**Tip:** store the `cypress/failed` as a test artifact on CI. If a test fails, download and open the `folder/index.html` to inspect the application's structure at the moment of failure.

## cyclope

Alias `clope`

Generates consistent PNG image using external Cyclope image service. Requires `CYCLOPE_SERVICE_URL` and `CYCLOPE_SERVICE_KEY` environment variables when running Cypress. Supports hover

```js
cy.get('#theme-switcher')
  .realHover()
  .cyclope('hover-over-sun.png')
// saves the generated "hover-over-sun.png" image
// equivalent
cy.get('#theme-switcher')
  .realHover()
cy.clope()
```

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2021

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/cyclope/issues) on Github

## MIT License

Copyright (c) 2021 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[ci image]: https://github.com/bahmutov/cyclope/workflows/ci/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/cyclope/actions
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
