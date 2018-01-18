const tape = require('tape')
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
