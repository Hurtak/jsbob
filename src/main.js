'use strict'

require('hard-rejection')()

const execa = require('execa')
const chalk = require('chalk')
const lodash = require('lodash')

const log = require('./log.js')

// main

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

function task (func) {
  return async (data) => {
    return await Promise.resolve(func(data))
  }
}

// tasks

const syncFunctionTask = task((input) => {
  return input + 1
})

const asyncPromiseTask = task((input) => {
  return new Promise((resolve, reject) => {
    resolve(input + 1)
  })
})

const asyncAwaitedPromiseTask = task(async (input) => {
  const result = await new Promise((resolve, reject) => {
    resolve(input + 1)
  })

  return result
})

const execTask = task(async (input) => {
  const res = await exec(`echo $((${ input} + 1))`)
  return Number(res)
})

// main

async function main () {
  console.log()

  const logStart = chalk.bgWhite.blue('Starting main task')
  log.prefixed(logStart)

  let data = 0

  console.log(data)
  data = await syncFunctionTask(data)
  console.log(data)
  data = await asyncPromiseTask(data)
  console.log(data)
  data = await asyncAwaitedPromiseTask(data)
  console.log(data)
  data = await execTask(data)
  console.log(data)

  console.log('async Promise.race task running')

  data = 100

  console.log(data)
  data = await syncFunctionTask(data)
  console.log(data)
  data = await Promise.race([
    asyncPromiseTask(data),
    asyncAwaitedPromiseTask(data)
  ])
  console.log(data)
  data = await execTask(data)
  console.log(data)


  // await multilineExec()
  // await regularSyncFunction()

//   await exec('svgo --help')
//   await exec('cat test/app/images/controls/next.svg | svgo -i - -o -')
//   await exec('svgo -f test/app/images/controls -o test/dist')

  // test throwing
  // await exec(`echo "echo ok 1"`)
  // await exec(`>&2 echo "echo error"`)
  // await exec(`exit 1`)
  // await exec(`echo "echo ok 2"`)
}

main()
