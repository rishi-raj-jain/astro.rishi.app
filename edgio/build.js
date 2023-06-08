const { join } = require('path')
const { nodeFileTrace } = require('@vercel/nft')
const { DeploymentBuilder } = require('@edgio/core/deploy')

module.exports = async function build() {
  const builder = new DeploymentBuilder()
  builder.clearPreviousBuildOutput()
  await builder.exec('npx astro build')
  await builder.build()
  const { fileList } = await nodeFileTrace(['./dist/server/entry.mjs'])
  fileList.forEach((file) => builder.copySync(file, join(builder.jsDir, file)))
}
