'use strict'

const jsbob = require('../src/main.js')
const fs = require('fs-promise')
const path = require('path')

jsbob.task('main', async () => {
  let data = 0

  data = await jsbob.run('return sync')
  console.assert(data === 1)
  data = await jsbob.run('return async')
  console.assert(data === 2)

  await jsbob.run('function input', data)
  console.assert(data === 2)
  data = await jsbob.run('function input + return sync', data)
  console.assert(data === 3)
  data = await jsbob.run('function input + return async', data)
  console.assert(data === 4)

  await jsbob.run('file input')
  console.assert(data === 4)
  data = await jsbob.run('file input + return sync', data)
  console.assert(data === 5)
  data = await jsbob.run('file input + return async', data)
  console.assert(data === 6)

  data = await jsbob.run('file output + return sync', data)
  console.assert(data === 7)
  const out1 = await fs.readFile(path.join(__dirname, 'dist/program1.txt'), 'utf-8')
  console.assert(out1 === '7')

  data = await jsbob.run('file output + return async', data)
  console.assert(data === 8)
  const out2 = await fs.readFile(path.join(__dirname, 'dist/program2.txt'), 'utf-8')
  console.assert(out2 === '8')

  data = await jsbob.run('data input file output', data)
  console.assert(data === 9)
  const out3 = await fs.readFile(path.join(__dirname, 'dist/program3.txt'), 'utf-8')
  console.assert(out3 === '9')

  data = await jsbob.run('data input file output + return async', data)
  console.assert(data === 10)
  const out4 = await fs.readFile(path.join(__dirname, 'dist/program4.txt'), 'utf-8')
  console.assert(out4 === '10')
})

jsbob.task('return sync', async () => {
  return 1
})

jsbob.task('return async', async () => {
  return await new Promise(resolve => setTimeout(resolve(2), 0))
})

jsbob.task('function input', async (data) => {

})

jsbob.task('function input + return sync', async (data) => {
  return data + 1
})

jsbob.task('function input + return async', async (data) => {
  const one = await new Promise(resolve => setTimeout(resolve(1), 0))
  return data + one
})

jsbob.task('file input', {
  from: './examples/fixtures/number.txt'
}, async (fileContent) => {

})

jsbob.task('file input + return sync', {
  from: './examples/fixtures/number.txt'
}, async (fileContent, data) => {
  return data + Number(fileContent)
})


jsbob.task('file input + return async', {
  from: './examples/fixtures/number.txt'
}, async (fileContent, data) => {
  const zero = await new Promise(resolve => setTimeout(resolve(0), 0))
  return data + Number(fileContent) + zero
})

jsbob.task('file output + return sync', {
  to: './examples/dist/program1.txt'
}, async (data) => {
  return data + 1
})

jsbob.task('file output + return async', {
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

jsbob.task('data input file output + return async', {
  from: './examples/fixtures/number.txt',
  to: './examples/dist/program4.txt'
}, async (fileContent, data) => {
  const zero = await new Promise(resolve => setTimeout(resolve(0), 0))
  return data + Number(fileContent) + zero
})

jsbob.run('main')
