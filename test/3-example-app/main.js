'use strict'

const jsbob = require('../../src/main.js')
const fs = require('fs-promise')
const path = require('path')

jsbob.configure({
  logLevel: 1
})

jsbob.task('main', async () => {
  await jsbob.run('clear')
})

jsbob.task('clear', async () => {
  await fs.remove(path.join(__dirname, '/dist'))
})
