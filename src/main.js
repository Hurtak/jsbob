'use strict'

require('hard-rejection')()

const execa = require('execa')
const chalk = require('chalk')
const lodash = require('lodash')
const globStream = require('glob-stream')
const fs = require('fs-promise')

const log = require('./log.js')

// state

const tasks = {}
const config = {
  logLevel: 1
}

// functions

function configure (userConfig) {
  // validate
  if (!lodash.isObject(userConfig)) {
    console.error(
      '"configure" method only accepts configuration object, you gave it: ',
      userConfig
    )
    process.exit(1)
  }

  const validKeys = Object.keys(config)
  for (const userConfigKey in userConfig) {
    if (validKeys.indexOf(userConfigKey) === -1) {
      console.error(
        'Configuration object passed into the "configure" method cointains invalid data.',
        'You supplied field with key named "' + userConfigKey + '"',
        'Valid keys for the config object are the following: ' + validKeys.map(x => `"${x}"`).join(', ')
      )
      process.exit(1)
    }
  }

  // update global config
  // TODO: validate each field
  for (const key in config) {
    if (!(key in userConfig)) continue
    config[key] = userConfig[key]
  }
}

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

  // TODO: validate if each config thing is valid
  // TODO: iterate over all keys of config object and check if they are correct
  //       maybe event do autocorrect, if user has typo?
  // TODO: also do this validation only once at the startup
  const taskData = {}
  if (callback) taskData.callback = callback
  if (config.from) taskData.from = config.from
  if (config.to) taskData.to = config.to

  tasks[taskName] = taskData
}

async function run (taskName, data) {
  if (!(taskName in tasks)) {
    throw new Error(`You are trying to run task "${taskName}" which does not exists.`)
  }

  let result
  const task = tasks[taskName]

  const timeStart = Date.now()
  if (config.logLevel >= 1) {
    log.prefixed(`→ ${taskName}`)
  }

  if (task.from) {
    result = await new Promise((resolve, reject) => {
      const files = []

      let nrOfFiles = 0
      let nrOfProcessedFiles = 0
      let streamEnded = false

      function resolveIfDone () {
        if (!streamEnded) return
        if (nrOfProcessedFiles !== nrOfFiles) return
        resolve(files)
      }

      const stream = globStream.create(task.from)

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
          const modifiedContent = await task.callback(fileContent, data)

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

    // TODO: handle if promise is rejected and result is not array
    // TODO: return result[0] if user is not globbing but specifying one file?
    // - check if pattern is glob with multiple files, if so, return result[0]
    switch (result.length) {
      case 0: result = null; break
      case 1:result = result[0]; break
      default: break
    }
  } else {
    result = await task.callback(data)
  }

  if (task.to) {
    // TODO: use path.join? support absolute paths?
    await fs.outputFile(task.to, result)
  }

  if (config.logLevel >= 1) {
    const taskTime = Date.now() - timeStart
    log.prefixed(`♥ ${taskName} - ${taskTime}ms`)
  }

  return result
}

// export

module.exports = {
  configure,
  task,
  run,
  exec
}
