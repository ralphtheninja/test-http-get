const hyperquest = require('hyperquest')
const isRedirect = require('is-redirect')
const once = require('once')
const URL = require('url')
const xtend = require('xtend')
const debug = require('debug')('test-http-get')
const maxRedirects = 5

const test = (url, cb) => {
  let redirectAttempts = 0

  const doIt = (url, cb, method = 'HEAD') => {
    const req = hyperquest(url, { method })

    req.on('response', res => {
      const code = res.statusCode
      debug(`${method} ${code} ${url}`)

      if (!isRedirect(code)) {
        return cb(null, code < 300)
      }

      let location = res.headers.location
      if (typeof location !== 'string') {
        return cb(new Error('missing location on redirect response'))
      }

      if (location.startsWith('/')) {
        const parsedUrl = URL.parse(url)
        location = URL.format(xtend(parsedUrl, {
          pathname: location,
          path: location
        }))
      }

      if (++redirectAttempts < maxRedirects) {
        debug(`redirecting ${url} -> ${location} (${redirectAttempts})`)
        return doIt(location, cb)
      }

      cb(new Error(`too many redirect attempts, max is ${maxRedirects}`))
    })

    req.on('error', () => cb(new Error(`request to ${url} failed`)))
  }

  doIt(url, once(cb))
}

module.exports = test
