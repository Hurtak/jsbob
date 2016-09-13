'use strict'

require('hard-rejection')()

const execa = require('execa')
const lodash = require('lodash')
const chalk = require('chalk')

// main

async function exec (str) {
  const prefix = white(getConsolePrefix(new Date()))

  console.log(`${prefix} ${green('running')}`)
  console.log(`    ${str}`)

  const {stdout, stderr} = await execa.shell(str)
  if (stdout) {
    console.log(`${prefix} ${green('stdout')}`)
    console.log(indentConsoleOutput(stdout, 4))
  }
  if (stderr) {
    console.log(`${prefix} ${red('stderr')}`)
    console.log(indentConsoleOutput(stderr, 4))
  }
}

async function main () {
  // const res = await exec('ls --help')
  // const res = await exec('svgo --help')
  // const res = await exec('cat test/app/images/controls/next.svg | svgo -i - -o -')
  const res = await exec('svgo -f test/app/images/controls -o test/dist')
  // const res = await exec('dir')
  // await execa('mkdir', ['test'])
  // await execa('rm -r', ['test'])
  // const res2 = await execa('ll')
  // console.log(res2)
}

main()

// utils

function getConsolePrefix (date) {
  const hour = date.getHours()
  const minutes = lodash.padStart(date.getMinutes(), 2, '0')
  const seconds = lodash.padStart(date.getSeconds(), 2, '0')

  return `[${hour}:${minutes}:${seconds}]`
}

function white (str) { return chalk.bold.white(str) }
function green (str) { return chalk.bold.green(str) }
function red (str) { return chalk.bold.red(str) }

function indentConsoleOutput (str, indentation = 4) {
  const indentationStr = lodash.repeat(' ', indentation)

  let out = lodash.split(str, '\n')
  out = lodash.map(out, (line => indentationStr + line))
  out = lodash.join(out, '\n')

  return out
}
