import * as dotenv from 'dotenv'
import node from '@astrojs/node'
import react from '@astrojs/react'
import image from '@astrojs/image'
import tailwind from '@astrojs/tailwind'
import storyblok from '@storyblok/astro'
import { defineConfig } from 'astro/config'

dotenv.config()

export default defineConfig({
  output: 'server',
  compressHTML: true,
  adapter: node({
    mode: 'standalone',
  }),
  site: 'https://rishi.app/',
  integrations: [
    tailwind(),
    react(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    storyblok({
      accessToken: process.env.STORYBLOK_API_KEY,
    }),
  ],
})
