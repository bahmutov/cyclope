const mkdirp = require('mkdirp')
const path = require('path')

function initCyclope(on, config) {
  on('task', {
    async makeFolder(path) {
      console.log('making folder %s', path)
      await mkdirp(path, { recursive: true })
      return path
    },

    async saveResource({ outputFolder, fullUrl, srcAttribute }) {
      console.log('saving %s -> %s', fullUrl, srcAttribute)

      const savePath = path.join(outputFolder, srcAttribute)
      const folder = path.dirname(savePath)
      await mkdirp(folder, { recursive: true })

      return null
    },
  })
}

module.exports = initCyclope
