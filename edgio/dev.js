const { createDevServer } = require('@edgio/core/dev')

module.exports = function () {
  return createDevServer({
    label: 'Astro',
    command: (port) => `PORT=${port} npx astro dev --port ${port}`,
  })
}
