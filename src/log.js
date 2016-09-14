'use strict'

const chalk = require('chalk')
const lodash = require('lodash')

function indentConsoleOutput (str, indentation = 4) {
  const indentationStr = lodash.repeat(' ', indentation)

  let out = lodash.split(str, '\n')
  out = lodash.map(out, line => indentationStr + line)
  out = lodash.join(out, '\n')

  console.log(out)
}

function logPrefixed (str) {
  let prefix = new Date()
  prefix = getConsolePrefix(prefix)
  prefix = chalk.bold.white(prefix)

  console.log(`${prefix} ${str}`)
}

function getConsolePrefix (date) {
  const hour = date.getHours()
  const minutes = lodash.padStart(date.getMinutes(), 2, '0')
  const seconds = lodash.padStart(date.getSeconds(), 2, '0')

  return `[${hour}:${minutes}:${seconds}]`
}

module.exports = {
  prefixed: logPrefixed,
  indented: indentConsoleOutput
}
