// @ts-check
const fs = require('fs')
const got = require('got')
const { URLSearchParams } = require('url')

async function upload(zipFilename, options = {}) {
  const uploadUrl = process.env.CYCLOPE_SERVICE_URL
  if (!uploadUrl) {
    throw new Error('CYCLOPE_SERVICE_URL is not set')
  }

  const search = new URLSearchParams(options)

  const url = `${uploadUrl}?${search.toString()}`

  const buffer = fs.readFileSync(zipFilename)
  const postOptions = {
    body: buffer,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  }
  // @ts-ignore
  const response = await got.post(url, postOptions)
  // console.log('response is a buffer?', Buffer.isBuffer(response.rawBody))
  const outputFilename = 'result.png'
  fs.writeFileSync(outputFilename, response.rawBody)
  return outputFilename
}

module.exports = { upload }
