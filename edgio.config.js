const { join } = require('path')

module.exports = {
  connector: '@edgio/astro',
  astro: {
    appPath: join(process.cwd(), 'dist', 'server', 'entry.mjs'),
  },
  includeFiles: {
    'node_modules/html-minifier/**/*': true,
  },
}
