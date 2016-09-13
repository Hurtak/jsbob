'use strict'

require('hard-rejection')()

const execa = require('execa')
const lodash = require('lodash')

const log = require('./log.js')

// main

function exec (str) {
  log.prefixed('running')
  log.indented(lodash.trim(str))

  const {stdout, stderr} = execa.shellSync(str)

  if (stdout) {
    log.prefixed('stdout')
    log.indented(stdout)
  }
  if (stderr) {
    log.prefixed('stderr', true)
    log.indented(stderr)
  }
}

function main () {
  // exec('cat test/app/images/controls/next.svg | svgo -i - -o -')
  // exec('svgo -f test/app/images/controls -o test/dist')
  exec(`
    echo "multiline first"
    echo "multiline second"
  `)
}

main()
