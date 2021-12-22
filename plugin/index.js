const mkdirp = require('mkdirp')
const path = require('path')
const { promisify } = require('util')
const stream = require('stream')
const fs = require('fs')
const got = require('got')
const del = require('del')
const { zipFolder } = require('./zip')
const { upload } = require('./upload')

const pipeline = promisify(stream.pipeline)

async function makeFolder(path) {
  console.log('making folder "%s"', path)
  await mkdirp(path, { recursive: true })
  return path
}

async function saveResource({ outputFolder, fullUrl, srcAttribute }) {
  console.log('saving "%s" -> "%s"', fullUrl, srcAttribute)
  if (!fullUrl) {
    throw new Error('Missing fullUrl')
  }

  const savePath = path.join(outputFolder, srcAttribute)
  const folder = path.dirname(savePath)
  await mkdirp(folder, { recursive: true })

  await pipeline(got.stream(fullUrl), fs.createWriteStream(savePath))

  return null
}

function initCyclope(on, config) {
  on('task', {
    makeFolder,
    saveResource,
    upload,
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
