const path = require('path')
const fs = require('fs-promise')
const globOriginal = require('glob')

const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const CleanCSS = require('clean-css')

const glob = function (pattern, options) {
  return new Promise(function (resolve, reject) {
    globOriginal(pattern, options, function (err, files) {
      return err === null ? resolve(files) : reject(err)
    })
  })
}

const jsbob = require('../src/main.js')

jsbob.task('main', async () => {
  jsbob.run('test')
})

// cases

// 1. I will get the files by myself
jsbob.task('scripts-handle-all', async () => {
  const files = await glob('./fixtures/**/*.css')

  const contents = {}

  // 0. get the files one by one
  // TODO: is it faster to get them concurrently?
  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf-8')
    contents[filePath] = content
  }

  // 1. autoprefix
  const contentsPrefixed = {}
  for (const filePath in contents) {
    const prefixed = await postcss([autoprefixer]).process(contents[filePath]).css
    contentsPrefixed[filePath] = prefixed
  }

  // 2. concat
  let concatedFiles = ''
  for (const filePath in contentsPrefixed) {
    concatedFiles += contentsPrefixed[filePath]
  }

  // 3. minify
  const minified = new CleanCSS().minify(concatedFiles).styles;

  console.log(minified)
})

jsbob.run('scripts-handle-all')

// tasks

// const syncFunctionTask = task((input) => {
//   return input + 1
// })

// const asyncPromiseTask = task((input) => {
//   return new Promise((resolve, reject) => {
//     resolve(input + 1)
//   })
// })

// const asyncAwaitedPromiseTask = task(async (input) => {
//   const result = await new Promise((resolve, reject) => {
//     resolve(input + 1)
//   })

//   return result
// })

// const execTask = task(async (input) => {
//   const res = await exec(`echo $((${ input} + 1))`)
//   return Number(res)
// })


//   console.log()

//   const logStart = chalk.bgWhite.blue('Starting main task')
//   log.prefixed(logStart)

//   let data = 0

//   console.log(data)
//   data = await syncFunctionTask(data)
//   console.log(data)
//   data = await asyncPromiseTask(data)
//   console.log(data)
//   data = await asyncAwaitedPromiseTask(data)
//   console.log(data)
//   data = await execTask(data)
//   console.log(data)

//   console.log('async Promise.all task running')

//   const result = await Promise.all([
//     syncFunctionTask(0),
//     asyncPromiseTask(1),
//     asyncAwaitedPromiseTask(2),
//     new Promise(async (resolve) => {
//       let x = 2
//       x = await asyncPromiseTask(x)
//       x = await asyncAwaitedPromiseTask(x)
//       resolve(x)
//     })
//   ])
//   console.log(result)


//   // await multilineExec()
//   // await regularSyncFunction()

// //   await exec('svgo --help')
// //   await exec('cat test/app/images/controls/next.svg | svgo -i - -o -')
// //   await exec('svgo -f test/app/images/controls -o test/dist')

//   // test throwing
//   // await exec(`echo "echo ok 1"`)
//   // await exec(`>&2 echo "echo error"`)
//   // await exec(`exit 1`)
//   // await exec(`echo "echo ok 2"`)
