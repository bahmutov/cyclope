/// <reference types="cypress" />

const { $ } = Cypress
const path = require('path')

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
        }
      }
    },
  )
  return {
    urls,
    replaced,
  }
}

function getDOMasHTML() {
  const snap = cy.createSnapshot('snap')

  // replace external styles with <style> tags
  // like packages/runner-shared/src/iframe/aut-iframe.js
  const { headStyles } = Cypress.cy.getStyles(snap)
  console.log(headStyles)
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

  // replace head styles links
  const existingStyles = $head.find('link[rel="stylesheet"],style')
  console.log(existingStyles)

  headStyles.forEach(function (style, index) {
    if (style.href) {
      //?
    } else {
      _replaceStyle($head, existingStyles[index], style)
    }
  })

  const XMLS = new XMLSerializer()
  const headHTML = XMLS.serializeToString(
    Cypress.$autIframe.contents().find('head')[0],
  )
  const bodyHTML = XMLS.serializeToString(snap.body.get()[0])

  const html = ['<html>', headHTML, bodyHTML, '</html>'].join('\n')

  return html
}

const isRelative = (src) => src.startsWith('/') || src.startsWith('./')

function saveRelativeResources(outputFolder, html) {
  return cy.task('makeFolder', outputFolder).then(() => {
    // sometimes the same resource is referenced multiple times
    const alreadySaved = {}

    // find all the resources that are relative from the style elements
    // using regex url('...')
    // TODO: probably need to ask the document
    const baseUrl = Cypress.config('baseUrl')
    cy.log(`base url ${baseUrl}`)

    const { urls, replaced } = replaceUrls(baseUrl, html)
    cy.wrap(urls)

    urls.forEach((fullUrl) => {
      const relativeUrl = fullUrl.replace(baseUrl, '.')
      cy.task('saveResource', {
        outputFolder,
        fullUrl,
        srcAttribute: relativeUrl,
      })
    })

    html = replaced

    $(html)
      .find('img')
      .each(function (k, img) {
        const imageSource = img.getAttribute('src')
        if (isRelative(imageSource)) {
          console.log('relative image', imageSource)
          if (alreadySaved[imageSource]) {
            return
          }

          alreadySaved[imageSource] = true
          const fullUrl = img.currentSrc || img.src
          cy.task('saveResource', {
            outputFolder,
            fullUrl,
            srcAttribute: imageSource,
          })
        }
      })
    return cy.wrap(html)
  })
}

/**
 * Use this function as an "afterEach" hook to automatically save the
 * current page as an HTML file if the test has failed.
 * @example
 *  afterEach(savePageIfTestFailed)
 */
function savePageIfTestFailed() {
  if (cy.state('test').isFailed()) {
    const outputFolder = path.join(
      'cypress',
      'failed',
      Cypress.spec.name,
      Cypress.currentTest.title,
    )
    cy.log(outputFolder)
    return savePage(outputFolder)()
  }
}

function savePage(outputFolder) {
  return function savePageNow() {
    const html = getDOMasHTML()
    return saveRelativeResources(outputFolder, html).then((html) => {
      const filename = `${outputFolder}/index.html`
      return cy.writeFile(filename, html)
    })
  }
}

module.exports = {
  savePage,
  savePageIfTestFailed,
  utils: { replaceUrls, getDOMasHTML, saveRelativeResources },
}
