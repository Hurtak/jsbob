'use strict'

require('hard-rejection')()

const execa = require('execa')
const chalk = require('chalk')
const lodash = require('lodash')

const log = require('./log.js')

// main

const tasks = {}

async function exec (str) {
  // const logRunning = chalk.bold.cyan('running')
  // log.prefixed(logRunning)
  // log.indented(lodash.trim(str))

  try {
    // const start = Date.now()
    const {stdout, stderr} = await execa.shell(str)
    // const end = Date.now()
    // console.log(end - start)

    if (stdout) {
      // log.prefixed(chalk.bold.green('stdout'))
      // log.indented(stdout)
      return stdout
    } else if (stderr) {
      log.prefixed(chalk.bold.red('stderr'))
      log.indented(stderr)
      return stderr
    }
  } catch (err) {
    log.prefixed(chalk.bold.red('error'))
    log.indented(err)
    return err
  }
}

// function task (func) {
//   return async (data) => {
//     return await Promise.resolve(func(data))
//   }
// }

function task (taskName, cb) {
  if (taskName in tasks) {
    throw new Error(`Task "${taskName}" is already defined.`)
  }

  tasks[taskName] = cb
}

function run (taskName) {
  if (!(taskName in tasks)) {
    throw new Error(`You are trying to run task "${taskName}" which does not exists.`)
  }
  tasks[taskName]()
}

function concat (...strings) {
  return strings.reduce((currentString, concated) => concated + currentString)
}

// export

module.exports = {
  task,
  run,
  exec
}
