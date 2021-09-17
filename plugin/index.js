const mkdirp = require('mkdirp')
const path = require('path')
const { promisify } = require('util')
const stream = require('stream')
const fs = require('fs')
const got = require('got')

const pipeline = promisify(stream.pipeline)

function initCyclope(on, config) {
  on('task', {
    async makeFolder(path) {
      console.log('making folder %s', path)
      await mkdirp(path, { recursive: true })
      return path
    },

    async saveResource({ outputFolder, fullUrl, srcAttribute }) {
      console.log('saving %s -> %s', fullUrl, srcAttribute)
      if (!fullUrl) {
        throw new Error('Missing fullUrl')
      }

      const savePath = path.join(outputFolder, srcAttribute)
      const folder = path.dirname(savePath)
      await mkdirp(folder, { recursive: true })

      await pipeline(got.stream(fullUrl), fs.createWriteStream(savePath))

      return null
    },
  })
}

module.exports = initCyclope
