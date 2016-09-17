'use strict'

require('hard-rejection')()

const execa = require('execa')
const chalk = require('chalk')
const lodash = require('lodash')
const globStream = require('glob-stream')
const fs = require('fs-promise')

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

function task (taskName, userConfOrCb, userCb) {
  const callback = lodash.isFunction(userConfOrCb) ? userConfOrCb : userCb
  const config = lodash.isObject(userConfOrCb) ? userConfOrCb : {}

  if (taskName in tasks) {
    throw new Error(`Task "${taskName}" is already defined.`)
  }

  tasks[taskName] = {
    callback: callback,
    from: config.from
  }
}

async function run (taskName) {
  if (!(taskName in tasks)) {
    throw new Error(`You are trying to run task "${taskName}" which does not exists.`)
  }

  const task = tasks[taskName]

  const {
    callback,
    from
  } = tasks[taskName]

  if (!from) {
    return callback()
  }

  const promise = new Promise((resolve, reject) => {
    const files = []

    let nrOfFiles = 0
    let nrOfProcessedFiles = 0
    let streamEnded = false

    function resolveIfDone () {
      if (!streamEnded) return
      if (nrOfProcessedFiles !== nrOfFiles) return
      resolve(files)
    }

    const stream = globStream.create(from)

    stream.on('data', async function ({ path }) {
      nrOfFiles++

      const { mtime } = await fs.stat(path)
      const lastModification = mtime.getTime()

      if (!task.cache) {
        task.cache = {}
      }

      if (!task.cache[path]) {
        task.cache[path] = {}
      }

      const cache = task.cache[path]
      if (cache.lastModification === lastModification) {
        files.push(cache.data)
      } else {
        cache.lastModification = lastModification

        const fileContent = await fs.readFile(path, 'utf-8')
        const modifiedContent = await Promise.resolve(callback(fileContent))

        cache.data = modifiedContent
        files.push(modifiedContent)
      }

      nrOfProcessedFiles++
      resolveIfDone()
    })

    stream.on('end', function () {
      streamEnded = true
      resolveIfDone()
    })

    stream.on('error', function (error) {
      reject(error)
    })
  })

  return await promise
}

// export

module.exports = {
  task,
  run,
  exec
}
