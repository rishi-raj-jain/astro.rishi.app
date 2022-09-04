import mdx from '@astrojs/mdx'
import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  adapter: node(),
  output: 'server',
  integrations: [mdx(), tailwind(), react()],
  site: 'https://rishi.app',
})
