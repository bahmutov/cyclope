/// <reference types="cypress" />

const { $ } = Cypress

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

function getDOMasHTML() {
  const snap = cy.createSnapshot('snap')

  // replace external styles with <style> tags
  // like packages/runner-shared/src/iframe/aut-iframe.js
  const { headStyles } = Cypress.cy.getStyles(snap)
  console.log(headStyles)
  const $head = Cypress.$autIframe.contents().find('head')
  $head.find('script').empty()

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

function saveRelativeResources(outputFolder) {
  return function saveResources(html) {
    return cy.task('makeFolder', outputFolder).then(() => {
      // sometimes the same resource is referenced multiple times
      const alreadySaved = {}

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
            cy.task('saveResource', {
              outputFolder,
              fullUrl: img.currentSrc,
              srcAttribute: imageSource,
            })
          }
        })
      return cy.wrap(html)
    })
  }
}

module.exports = { getDOMasHTML, saveRelativeResources }
