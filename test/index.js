const tape = require('tape')
const http = require('http')
const test = require('..')

tape('rvagg/node-levelup', function (t) {
  test('https://github.com/rvagg/node-levelup', (err, exists) => {
    t.error(err, 'no error')
    t.is(exists, true, 'redirect successful')
    t.end()
  })
})

tape('non existent github repository - 404', function (t) {
  test('https://github.com/ralphtheninja/thiswillneverbe', (err, exists) => {
    t.error(err, 'no error')
    t.is(exists, false, 'should not exist')
    t.end()
  })
})

tape('missing location on redirect response', function (t) {
  const port = 12345
  const server = http.createServer((req, res) => {
    res.writeHead(301)
    res.end()
  })
  server.listen(port, () => {
    test(`http://localhost:${port}`, (err, exists) => {
      t.equal(err.message, 'missing location on redirect response', 'correct error')
      t.is(exists, undefined, 'existence is undefined')
      t.end()
    })
  }).unref()
})

tape('too many redirects', function (t) {
  const port = 23456
  const location = `http://localhost:${port}`
  const server = http.createServer((req, res) => {
    res.writeHead(301, { location })
    res.end()
  })
  server.listen(port, () => {
    test(location, (err, exists) => {
      t.equal(err.message, 'too many redirect attempts, max is 5', 'correct error')
      t.is(exists, undefined, 'existence is undefined')
      t.end()
    })
  }).unref()
})

tape('requesting bad url errors', function (t) {
  test('/whatever', (err, exists) => {
    t.equal(err.message, 'request to /whatever failed', 'correct error')
    t.is(exists, undefined, 'existence is undefined')
    t.end()
  })
})
