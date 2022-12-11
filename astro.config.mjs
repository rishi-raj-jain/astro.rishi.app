import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  site: 'https://astro.rishi.app',
  integrations: [tailwind(), react()],
})
