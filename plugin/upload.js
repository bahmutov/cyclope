// @ts-check
const fs = require('fs')
const got = require('got')
const { URLSearchParams } = require('url')

async function upload(options = {}) {
  const uploadUrl = process.env.CYCLOPE_SERVICE_URL
  if (!uploadUrl) {
    throw new Error('CYCLOPE_SERVICE_URL is not set')
  }

  const key = process.env.CYCLOPE_SERVICE_KEY
  if (!key) {
    throw new Error('CYCLOPE_SERVICE_KEY is not set')
  }

  const { filename, outputFilename } = options
  if (!filename) {
    throw new Error('filename is not set')
  }
  if (!filename.endsWith('.zip')) {
    throw new Error('filename must end with .zip')
  }
  if (!outputFilename) {
    throw new Error('outputFilename is not set')
  }
  if (!outputFilename.endsWith('.png')) {
    throw new Error('outputFilename must end with .png')
  }

  // remove filename from the options object
  // add the key to the options object
  const sendOptions = {
    ...options,
    key,
  }
  // @ts-ignore
  delete sendOptions.filename
  // @ts-ignore
  delete sendOptions.outputFilename
  // @ts-ignore
  if (!sendOptions.hoverSelector) {
    // @ts-ignore
    delete sendOptions.hoverSelector
  }

  const search = new URLSearchParams(sendOptions)

  const url = `${uploadUrl}?${search.toString()}`

  const buffer = fs.readFileSync(filename)
  const postOptions = {
    body: buffer,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  }
  // @ts-ignore
  const response = await got.post(url, postOptions)
  // console.log('response is a buffer?', Buffer.isBuffer(response.rawBody))
  fs.writeFileSync(outputFilename, response.rawBody)
  return outputFilename
}

module.exports = { upload }
