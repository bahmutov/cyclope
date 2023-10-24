// @ts-check
/// <reference path="./index.d.ts" />

const { jUnique, removeUnsafeCharacters, pathJoin } = require('./utils')
const { $ } = Cypress

Cypress.on('test:before:run', () => {
  // before each test clear the hover element
  cy.state('hovered', null)

  // TODO: figure out how to check if a command exists
  if (Cypress.Commands._commands && Cypress.Commands._commands.realHover) {
    Cypress.Commands.overwrite(
      'realHover',
      function realHover(realHover, subject, options) {
        // console.log('realHover', subject, options)
        const selector = jUnique(subject)
        cy.log(`realHover **${selector}**`)
        // save the hovered selector
        cy.state('hovered', selector)
        realHover(subject, options)
      },
    )
  }
})

function _styleTag(style) {
  return `<style>${style}</style>`
}

function _replaceStyle($head, existingStyle, style) {
  const styleTag = _styleTag(style)

  if (existingStyle) {
    Cypress.$(existingStyle).replaceWith(styleTag)
  } else {
    // no existing style at this index, so no more styles at all in
    // the head, so just append it
    $head.append(styleTag)
  }
}

/**
 * Takes a CSS string with absolute URLs served by the running web application
 * and replaced matched URLs with relative URLs.
 * @param {String} baseUrl Base URL of the application, will be replaced with "."
 * @param {String} style CSS with potential url('...') to be replaced with relative paths
 */
function replaceUrls(baseUrl, style) {
  // all found matched urls
  const urls = []
  const replaced = style.replace(
    /url\('(?:ftp|http|https):\/\/[^ "]+'\)/g,
    (...match) => {
      if (match[0]) {
        if (match[0].includes(baseUrl)) {
          // remove the "url('" prefix and "')" suffix
          const url = match[0].substr(5, match[0].length - 7)
          urls.push(url)
          return match[0].replace(baseUrl, '.')
        } else {
          // keep the original 3rd party domain URL
          return match[0]
        }
      }
    },
  )
  return {
    urls,
    replaced,
  }
}

const onAttributesToRemove = Object.keys(HTMLElement.prototype).filter((s) =>
  s.startsWith('on'),
)

function getDOMasHTML(options = {}) {
  const doc = cy.state('document')
  const snap = cy.createSnapshot('snap')

  // replace external styles with <style> tags
  // like packages/runner-shared/src/iframe/aut-iframe.js
  const { headStyles } = Cypress.cy.getStyles(snap)
  // console.log(headStyles)

  if (options.freezeAnimations) {
    // add our own script to disable all animations
    headStyles.push(`
      *, *:before, *:after {
        transition-property: none !important;
        animation: none !important;
      }
    `)
  }

  const $head = Cypress.$autIframe.contents().find('head')
  // remove all inline JavaScript code
  $head.find('script').empty()
  // replace all external JavaScript "src" attributes
  // and put the value into the "data-src" attribute
  // so we can see it, but the scripts are not loaded
  $head.find('script').each((i, script) => {
    const src = script.getAttribute('src')
    if (src) {
      script.setAttribute('data-src', src)
      script.removeAttribute('src')
    }
  })

  // remove all <link rel="preload"> attributes
  // since they won't work in a static file
  $head.find('link[rel=preload]').each((i, link) => {
    link.removeAttribute('rel')
  })

  // replace head styles links
  const existingStyles = $head.find('link[rel="stylesheet"],style')

  // XMLS.serializeToString method automatically escapes all ">" characters
  // which can be used inside styles. Thus we need to "hide" them
  // and restore the original ">" later after converting HEAD into HTML string
  // https://github.com/bahmutov/cyclope/issues/98
  const STYLE_LARGER_THAN = 'STYLE_LARGER_THAN'

  headStyles.forEach(function (style, index) {
    if (style.href) {
      //?
    } else {
      const preparedStyle = style.replaceAll('>', STYLE_LARGER_THAN)
      _replaceStyle($head, existingStyles[index], preparedStyle)
    }
  })

  const headNode = Cypress.$autIframe.contents().find('head')[0]
  const XMLS = new XMLSerializer()
  let headHTML = XMLS.serializeToString(headNode)
  headHTML = headHTML.replaceAll(STYLE_LARGER_THAN, '>')

  const body = snap.body.get()[0]

  if (options.removeIframes) {
    // remove all iframes
    body.querySelectorAll('iframe').forEach((iframe) => {
      iframe.remove()
    })
  }

  // to correctly serialize checked state of checkboxes
  // we need to take the current state and set it as an attribute
  const checkboxes = body.querySelectorAll('input[type=checkbox]')
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkbox.setAttribute('checked', 'checked')
    } else {
      checkbox.removeAttribute('checked')
    }
  })

  // to correctly serialize the input elements
  // we need to take the current state value and set it as an attribute
  const inputs = body.querySelectorAll('input[type=text]')
  inputs.forEach((input) => {
    input.setAttribute('value', input.value)
  })

  // if an input element has focus, then the output HTML
  // should set "autofocus" attribute on that input element
  if (doc.activeElement) {
    // console.log('active element', doc.activeElement)
    // cannot check the reference directly, because
    // we are already dealing with a copy of the document
    const activeElementHTML = doc.activeElement.outerHTML
    body.querySelectorAll('input').forEach((input) => {
      if (input.outerHTML === activeElementHTML) {
        input.setAttribute('autofocus', 'autofocus')
      }
    })
  }

  const bodyHTML = XMLS.serializeToString(body)

  const html = ['<html>', headHTML, bodyHTML, '</html>'].join('\n')

  return html
}

const isRelative = (src) => src && (src.startsWith('/') || src.startsWith('./'))

function saveRelativeResources(outputFolder, html, saveOptions) {
  return cy.task('makeFolder', outputFolder, { log: false }).then(() => {
    // sometimes the same resource is referenced multiple times
    const alreadySaved = {}

    // find all the resources that are relative from the style elements
    // using regex url('...')
    // TODO: probably need to ask the document
    const baseUrl = Cypress.config('baseUrl')
    // cy.log(`base url ${baseUrl}`)

    const { urls, replaced } = replaceUrls(baseUrl, html)
    // console.log({ baseUrl, urls, replaced })

    cy.wrap(urls, { log: false })

    urls.forEach((fullUrl) => {
      const relativeUrl = fullUrl.replace(baseUrl, '.')
      cy.task(
        'saveResource',
        {
          outputFolder,
          fullUrl,
          srcAttribute: relativeUrl,
          saveOptions: saveOptions,
        },
        { log: false },
      )
    })

    // if there are 3rd party resources without a protocol,
    // assume they are https and put the full protocol in
    // so they open int the browser when clicked on the HTML file
    html = replaced
      .replace(/src="\/\//g, 'src="https://')
      .replace(/href="\/\//g, 'href="https://')
    // replace all "on*" attributes with "data-*"
    // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
    // probably a better solution would be to look at the attributes, and
    // not on the HTML source text
    onAttributesToRemove.forEach((attributeName) => {
      html = html.replaceAll(' ' + attributeName, ` data-${attributeName}`)
    })

    $(html)
      .find('img')
      .each(function (k, img) {
        // console.log('k', k, img)

        const imageSource = img.getAttribute('src')
        if (isRelative(imageSource)) {
          // console.log('relative image', imageSource)
          if (imageSource.startsWith('//')) {
            // not a relative resource, but assume external HTTPs resource
            img.setAttribute('src', `https:${imageSource}`)
            return
          }

          if (imageSource.startsWith('/')) {
            // change urls like "/foo/bar/..." to be relative "./foo/bar/..."
            // so the images load when we visit the local file
            html = html.replaceAll(imageSource, '.' + imageSource)
          }

          if (alreadySaved[imageSource]) {
            return
          }

          alreadySaved[imageSource] = true
          const fullUrl = img.currentSrc || img.src
          cy.task(
            'saveResource',
            {
              outputFolder,
              fullUrl,
              srcAttribute: imageSource,
              saveOptions: saveOptions,
            },
            { log: false },
          )
        }

        const imageSourceSet = img.getAttribute('srcset')
        if (isRelative(imageSourceSet)) {
          // console.log('relative image', imageSource)
          if (imageSourceSet.startsWith('//')) {
            // not a relative resource, but assume external HTTPs resource
            img.setAttribute('src', `https:${imageSourceSet}`)
            return
          }

          if (imageSourceSet.startsWith('/')) {
            // change urls like "/foo/bar/..." to be relative "./foo/bar/..."
            // so the images load when we visit the local file
            html = html.replaceAll(imageSourceSet, '.' + imageSourceSet)
          }

          if (alreadySaved[imageSourceSet]) {
            return
          }

          alreadySaved[imageSourceSet] = true
          const fullUrl = img.currentSrc
          cy.task(
            'saveResource',
            {
              outputFolder,
              fullUrl,
              srcAttribute: imageSourceSet,
              saveOptions: saveOptions,
            },
            { log: false },
          )
        }
      })

    return cy.wrap(html, { log: false })
  })
}

/**
 * Use this function as an "afterEach" hook to automatically save the
 * current page as an HTML file if the test has failed.
 * By default does it only in the non-interactive mode.
 * @example
 *  afterEach(() => savePageIfTestFailed({ ignoreFailedAssets: true }))
 */
function savePageIfTestFailed(options) {
  if (cy.state('test').isFailed()) {
    const isInteractive = Cypress.config('isInteractive')
    const shouldSaveInInteractiveMode = options && options.saveInteractive
    if (isInteractive && !shouldSaveInInteractiveMode) {
      return
    }

    return cy
      .task('printFailedTestMessage', {
        spec: Cypress.spec.name,
        title: Cypress.currentTest.title,
      })
      .then(() => {
        const outputFolder = pathJoin(
          'cypress',
          'failed',
          Cypress.spec.name,
          Cypress.currentTest.title,
        )
        cy.log(outputFolder)
        return savePage(outputFolder, options)
      })
  }
}

const defaultSavePageOptions = {
  freezeAnimations: true,
}

function savePage(outputFolderOrZipFile, options = defaultSavePageOptions) {
  const started = +new Date()

  outputFolderOrZipFile = removeUnsafeCharacters(outputFolderOrZipFile)
  cy.log(`cyclope: **${outputFolderOrZipFile}**`)

  function logTiming(x) {
    const finished = +new Date()
    const duration = finished - started
    cy.log(`savePage took **${duration}** ms`)
    cy.task('cyclopePrint', `savePage took ${duration} ms`)
    // yield the original subject
    cy.wrap(x, { log: false })
  }

  const html = getDOMasHTML(options)
  if (outputFolderOrZipFile.endsWith('.zip')) {
    // cy.log(`Saving ${outputFolderOrZipFile}`)
    const tempFolder = outputFolderOrZipFile.replace(/\.zip$/, '')
    return saveRelativeResources(tempFolder, html, options)
      .then((html) => {
        const filename = `${tempFolder}/index.html`
        return cy.writeFile(filename, html, { log: false })
      })
      .then(() => {
        return cy.task(
          'zipFolder',
          {
            folder: tempFolder,
            zipFile: outputFolderOrZipFile,
          },
          { log: false },
        )
      })
      .then(() => {
        // form the results object
        return {
          filename: outputFolderOrZipFile,
          width: cy.state('viewportWidth'),
          height: cy.state('viewportHeight'),
          hoverSelector: cy.state('hovered'),
        }
      })
      .then(logTiming)
  }

  // saving the page as a folder
  return saveRelativeResources(outputFolderOrZipFile, html, options)
    .then((html) => {
      const filename = `${outputFolderOrZipFile}/index.html`
      return cy.writeFile(filename, html, { log: false })
    })
    .then(logTiming)
}

function getPluginOptions() {
  return Cypress._.get(Cypress.env(), 'cyclope', {})
}

function cyclope(outputImageFilename, commandOptions = {}) {
  expect(outputImageFilename)
    .to.be.a('string')
    .and.to.match(/\.png$/)
  const outputZipFilename = outputImageFilename.replace('.png', '.zip')

  const started = +new Date()
  return cy.savePage(outputZipFilename, commandOptions).then((options) => {
    return cy
      .task('upload', {
        ...options,
        elementSelector: commandOptions.elementSelector,
        outputFilename: outputImageFilename,
      })
      .then(() => {
        const finished = +new Date()
        const duration = finished - started
        cy.log(`seePage took **${duration}** ms`)
      })
  })
}

Cypress.Commands.add('cyclope', cyclope)
Cypress.Commands.add('clope', cyclope)
Cypress.Commands.add('savePage', savePage)

module.exports = {
  savePageIfTestFailed,
  savePage,
  utils: { replaceUrls, getDOMasHTML, saveRelativeResources, savePage },
}
