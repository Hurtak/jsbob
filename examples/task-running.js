'use strict'

const jsbob = require('../src/main.js')

jsbob.task('main', async () => {
  let data = 0

  data = await jsbob.run('none', data)
  data = await jsbob.run('none async', data)
  data = await jsbob.run('data input', data)
  data = await jsbob.run('data input async', data)
  data = await jsbob.run('file input', data)
  data = await jsbob.run('file input async', data)
  data = await jsbob.run('file output', data)
  data = await jsbob.run('file output async', data)
  data = await jsbob.run('data input file output', data)
  data = await jsbob.run('data input file output async', data)

  console.assert(data === 10)
})

jsbob.task('none', async () => {
  return 1
})

jsbob.task('none async', async () => {
  return await new Promise(resolve => setTimeout(resolve(2), 0))
})

jsbob.task('data input', async (data) => {
  return data + 1
})

jsbob.task('data input async', async (data) => {
  const one = await new Promise(resolve => setTimeout(resolve(1), 0))
  return data + one
})

jsbob.task('file input', {
  from: './examples/fixtures/number.txt'
}, async (fileContent, data) => {
  return data + Number(fileContent)
})

jsbob.task('file input async', {
  from: './examples/fixtures/number.txt'
}, async (fileContent, data) => {
  const zero = await new Promise(resolve => setTimeout(resolve(0), 0))
  return data + Number(fileContent) + zero
})

jsbob.task('file output', {
  to: './examples/dist/program1.txt'
}, async (data) => {
  return data + 1
})

jsbob.task('file output async', {
  to: './examples/dist/program2.txt'
}, async (data) => {
  const one = await new Promise(resolve => setTimeout(resolve(1), 0))
  return data + one
})

jsbob.task('data input file output', {
  from: './examples/fixtures/number.txt',
  to: './examples/dist/program3.txt'
}, async (fileContent, data) => {
  return data + Number(fileContent)
})

jsbob.task('data input file output async', {
  from: './examples/fixtures/number.txt',
  to: './examples/dist/program4.txt'
}, async (fileContent, data) => {
  const zero = await new Promise(resolve => setTimeout(resolve(0), 0))
  return data + Number(fileContent) + zero
})

jsbob.run('main')
