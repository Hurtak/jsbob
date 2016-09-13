'use strict'

require('hard-rejection')()

const execa = require('execa')
const lodash = require('lodash')

const log = require('./log.js')

// main

async function exec (str) {
  log.prefixed('running')
  log.indented(lodash.trim(str))

  const {stdout, stderr} = await execa.shell(str)
  if (stdout) {
    log.prefixed('stdout')
    log.indented(stdout)
  }
  if (stderr) {
    log.prefixed('stderr', true)
    log.indented(stderr)
  }
}

async function main () {
//   await exec('ls --help')
//   await exec('svgo --help')
//   await exec('cat test/app/images/controls/next.svg | svgo -i - -o -')
//   await exec('svgo -f test/app/images/controls -o test/dist')
  await exec(`
    echo "multiline first"
    echo "multiline second"
  `)
}

main()
