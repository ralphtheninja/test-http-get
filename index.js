const hyperquest = require('hyperquest')
const isRedirect = require('is-redirect')
const debug = require('debug')('test-http-get')
const maxRedirects = 5

const test = (url, cb) => {
  debug('making HEAD request to', url)
  let redirectAttempts = 0

  const doIt = (url, cb) => {
    hyperquest(url, { method: 'HEAD' }).on('response', res => {
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
        debug('redirecting to', location, 'attempt', redirectAttempts)
        return doIt(location, cb)
      }

      cb(new Error('Too many redirect attempts. Max is', maxRedirects))
    })
  }

  doIt(url, cb)
}

module.exports = test
