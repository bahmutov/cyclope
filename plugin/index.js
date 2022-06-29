const mkdirp = require('mkdirp')
const path = require('path')
const { promisify } = require('util')
const stream = require('stream')
const fs = require('fs')
const got = require('got')
const del = require('del')
const { zipFolder } = require('./zip')
const { configureUpload } = require('./upload')

const pipeline = promisify(stream.pipeline)

async function makeFolder(path) {
  console.log('making folder "%s"', path)
  await mkdirp(path, { recursive: true })
  return path
}

async function saveResource({
  outputFolder,
  fullUrl,
  srcAttribute,
  saveOptions,
}) {
  console.log('saving "%s" -> "%s"', fullUrl, srcAttribute)
  if (!fullUrl) {
    throw new Error('Missing fullUrl')
  }

  const savePath = path.join(outputFolder, srcAttribute)
  const folder = path.dirname(savePath)
  await mkdirp(folder, { recursive: true })

  try {
    await pipeline(got.stream(fullUrl), fs.createWriteStream(savePath))
  } catch (err) {
    if (saveOptions && saveOptions.ignoreFailedAssets) {
      console.error('ignoring failed asset "%s" -> "%s"', fullUrl, srcAttribute)
    } else {
      console.error('saving failed "%s" -> "%s"', fullUrl, srcAttribute)
      console.error(err.message)
      throw new Error(`Failed to load ${srcAttribute}\n${err.message}`)
    }
  }

  return null
}

/**
 * Prints a message before saving the full page HTML
 * @param {object} spec Test information
 */
function printFailedTestMessage(info) {
  console.log('cyclope: saving page for failed test')
  console.log('  spec "%s"', info.spec)
  console.log('  test "%s"', info.title)
  return null
}

function initCyclope(on, config) {
  const cypressEnv = config.env || {}
  const pluginOptions = cypressEnv.cyclope || {}
  const upload = configureUpload(pluginOptions)

  on('task', {
    makeFolder,
    saveResource,
    upload,
    printFailedTestMessage,
    async zipFolder({ folder, zipFile }) {
      console.log('zipping "%s" to "%s"', folder, zipFile)

      await del(zipFile)
      await zipFolder(folder, zipFile)
      await del(folder)

      return zipFile
    },
  })
}

module.exports = initCyclope
