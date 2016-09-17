// const path = require('path')
// const fs = require('fs-promise')
// const globOriginal = require('glob')

// const postcss = require('postcss')
// const postcssImport = require('postcss-import')
// const CleanCSS = require('clean-css')

const jsbob = require('../src/main.js')

jsbob.task('main', async () => {
  await jsbob.run('program')
  // await jsbob.run('exec')
})

// cases

// 1. I will get the files by myself
jsbob.task('program', async () => {
  let data = 0
  console.log(data)

  data = await jsbob.run('program: none', data)
  console.log(data)

  data = await jsbob.run('program: none async', data)
  console.log(data)

  data = await jsbob.run('program: data input', data)
  console.log(data)

  data = await jsbob.run('program: data input async', data)
  console.log(data)

  data = await jsbob.run('program: file input', data)
  console.log(data)

  data = await jsbob.run('program: file input async', data)
  console.log(data)

  data = await jsbob.run('program: file output', data)
  console.log(data)

  data = await jsbob.run('program: file output async', data)
  console.log(data)

  data = await jsbob.run('program: data input file output', data)
  console.log(data)

  data = await jsbob.run('program: data input file output async', data)
  console.log(data)

  // 0. get the file
  // const file = await fs.readFile(filePath, 'utf-8')

  // // 1. autoprefix
  // const contentsPrefixed = {}
  // for (const filePath in contents) {
  //   const prefixed = await postcss([postcssImport]).process(contents[filePath]).css
  //   contentsPrefixed[filePath] = prefixed
  // }

  // // 2. concat
  // let concatedFiles = ''
  // for (const filePath in contentsPrefixed) {
  //   concatedFiles += contentsPrefixed[filePath]
  // }

  // // 3. minify
  // const minified = new CleanCSS().minify(concatedFiles).styles

  // await fs.outputFile('./dist/program.css', minified)
})

jsbob.task('program: none', async () => {
  return 1
})

jsbob.task('program: none async', async () => {
  return await new Promise(resolve => setTimeout(resolve(2), 10))
})

jsbob.task('program: data input', async (data) => {
  return data + 1
})

jsbob.task('program: data input async', async (data) => {
  const one = await new Promise(resolve => setTimeout(resolve(1), 10))
  return data + one
})

jsbob.task('program: file input', {
  from: './examples/fixtures/number.txt'
}, async (fileContent, data) => {
  return data + Number(fileContent)
})

jsbob.task('program: file input async', {
  from: './examples/fixtures/number.txt'
}, async (fileContent, data) => {
  const zero = await new Promise(resolve => setTimeout(resolve(0), 10))
  return data + Number(fileContent) + zero
})

jsbob.task('program: file output', {
  to: './examples/dist/program1.txt'
}, async (data) => {
  return data + 1
})

jsbob.task('program: file output async', {
  to: './examples/dist/program2.txt'
}, async (data) => {
  const one = await new Promise(resolve => setTimeout(resolve(1), 10))
  return data + one
})

jsbob.task('program: data input file output', {
  from: './examples/fixtures/number.txt',
  to: './examples/dist/program3.txt'
}, async (fileContent, data) => {
  return data + Number(fileContent)
})

jsbob.task('program: data input file output async', {
  from: './examples/fixtures/number.txt',
  to: './examples/dist/program4.txt'
}, async (fileContent, data) => {
  const zero = await new Promise(resolve => setTimeout(resolve(0), 10))
  return data + Number(fileContent) + zero
})

// jsbob.task('program: none', {
//   from: './examples/fixtures/**/*.css'
// }, async (file) => {
//   await new Promise((resolve) => setTimeout(resolve, 2000))

//   return file
// })

// 1. Do it all in the CLI
// jsbob.task('exec', async () => {
//   // 1. autoprefix
//   await jsbob.exec(`
//     cat ./fixtures/*.css \
//       | postcss --use autoprefixer \
//       | cleancss \
//       > ./dist/exec.css
//   `)

//   // // 0. get the files one by one
//   // const contents = {}
//   // for (const filePath of files) {
//   //   const content = await fs.readFile(filePath, 'utf-8')
//   //   contents[filePath] = content
//   // }

//   // // 1. autoprefix
//   // const contentsPrefixed = {}
//   // for (const filePath in contents) {
//   //   const prefixed = await postcss([autoprefixer]).process(contents[filePath]).css
//   //   contentsPrefixed[filePath] = prefixed
//   // }

//   // // 2. concat
//   // let concatedFiles = ''
//   // for (const filePath in contentsPrefixed) {
//   //   concatedFiles += contentsPrefixed[filePath]
//   // }

//   // // 3. minify
//   // const minified = new CleanCSS().minify(concatedFiles).styles

//   // console.log(minified)
// })

jsbob.run('main')

// TODO
// only CLI example
// CLI + code combination example - piping into CLI and from (could this be streamed?)

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
