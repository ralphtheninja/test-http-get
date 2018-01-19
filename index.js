const hyperquest = require('hyperquest')
const isRedirect = require('is-redirect')
const once = require('once')
const debug = require('debug')('test-http-get')
const maxRedirects = 5

const test = (url, cb) => {
  let redirectAttempts = 0

  const doIt = (url, cb) => {
    debug('making HEAD request to', url)
    const req = hyperquest(url, { method: 'HEAD' })

    req.on('response', res => {
      const code = res.statusCode
      debug('HEAD status code', code)

      if (!isRedirect(code)) {
        return cb(null, code < 300)
      }

      const location = res.headers.location
      if (typeof location !== 'string') {
        return cb(new Error('missing location on redirect response'))
      }

      if (++redirectAttempts < 5) {
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
