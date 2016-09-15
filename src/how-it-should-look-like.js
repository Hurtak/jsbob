const jsbob = require('jsbob')

jsbob.task('main', async () => {
  jsbob.task('test')
  jsbob.task('test:watch')
  jsbob.task('styles:watch')
  jsbob.task('scripts:watch')
  jsbob.task('images:watch')
  jsbob.task('templates:watch')

  await jsbob.task('clear')

  jsbob.task('styles')
  jsbob.task('templates')
  jsbob.task('images')
  jsbob.task('scripts')
})
