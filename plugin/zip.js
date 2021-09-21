// using https://www.npmjs.com/package/archiver
const fs = require('fs')
const archiver = require('archiver')

/**
 * https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript#18650828
 */
function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

function zipFolder(folderName, outputFilename) {
  console.log('Zipping folder %s', folderName)

  return new Promise((resolve, reject) => {
    // create a file to stream archive data to.
    const output = fs.createWriteStream(outputFilename)
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    })

    archive.on('progress', function (progress) {
      console.log('%s', bytesToSize(progress.fs.processedBytes))
    })

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function () {
      console.log(archive.pointer() + ' total bytes')
      console.log(
        'archiver has been finalized and the output file descriptor has closed.',
      )
      resolve(outputFilename)
    })

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function () {
      console.log('Data has been drained')
    })

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        reject(err)
      }
    })

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      reject(err)
    })

    // pipe archive data to the file
    archive.pipe(output)

    archive.directory(folderName, false)

    archive.finalize()
  })
}

module.exports = { zipFolder }
