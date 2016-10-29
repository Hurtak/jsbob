'use strict'

const jsbob = require('../../src/main.js')
const fs = require('fs-promise')
const path = require('path')

jsbob.configure({
  logLevel: 1
})

jsbob.task('main', async () => {
  await fs.remove(path.join(__dirname, 'to'))

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
  const out1 = await fs.readFile(path.join(__dirname, 'to/7'), 'utf-8')
  console.assert(out1 === '7')

  data = await jsbob.run('file output + return async', data)
  console.assert(data === 8)
  const out2 = await fs.readFile(path.join(__dirname, 'to/8'), 'utf-8')
  console.assert(out2 === '8')

  data = await jsbob.run('data input file output', data)
  console.assert(data === 9)
  const out3 = await fs.readFile(path.join(__dirname, 'to/9'), 'utf-8')
  console.assert(out3 === '9')

  data = await jsbob.run('data input file output + return async', data)
  console.assert(data === 10)
  const out4 = await fs.readFile(path.join(__dirname, 'to/10'), 'utf-8')
  console.assert(out4 === '10')

  await fs.remove(path.join(__dirname, 'to'))
})

jsbob.task('return sync', async () => {
  return 1
})

jsbob.task('return async', async () => {
  return await new Promise(resolve => setTimeout(resolve(2), 0))
})

jsbob.task('function input', async (data) => {
  console.assert(data === 2)
})

jsbob.task('function input + return sync', async (data) => {
  return data + 1
})

jsbob.task('function input + return async', async (data) => {
  const one = await new Promise(resolve => setTimeout(resolve(1), 0))
  return data + one
})

jsbob.task('file input', {
  from: path.join(__dirname, './from/1')
}, async (file) => {
  console.assert(file.trim() === '1')
})

jsbob.task('file input + return sync', {
  from: path.join(__dirname, './from/1')
}, async (file, data) => {
  return data + Number(file)
})

jsbob.task('file input + return async', {
  from: path.join(__dirname, './from/1')
}, async (files, data) => {
  const zero = await new Promise(resolve => setTimeout(resolve(0), 0))
  return data + Number(files[0]) + zero
})

jsbob.task('file output + return sync', {
  to: path.join(__dirname, './to/7')
}, async (data) => {
  return data + 1
})

jsbob.task('file output + return async', {
  to: path.join(__dirname, './to/8')
}, async (data) => {
  const one = await new Promise(resolve => setTimeout(resolve(1), 0))
  return data + one
})

jsbob.task('data input file output', {
  from: path.join(__dirname, './from/1'),
  to: path.join(__dirname, './to/9')
}, async (files, data) => {
  return data + Number(files[0])
})

jsbob.task('data input file output + return async', {
  from: path.join(__dirname, './from/1'),
  to: path.join(__dirname, './to/10')
}, async (fileContent, data) => {
  const zero = await new Promise(resolve => setTimeout(resolve(0), 0))
  return data + Number(fileContent) + zero
})

jsbob.run('main')
