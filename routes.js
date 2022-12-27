// This file was automatically added by edgio init.
// You should commit this file to source control.

import { load } from 'cheerio'
import fetch from 'node-fetch'
import { astroRoutes } from '@edgio/astro'
import { minifyOptions } from 'minifyOptions'
import { getAllPostsForHome } from '@/src/api'
import esImport from '@edgio/core/utils/esImport'
import { CustomCacheKey, Router } from '@edgio/core'

const paths = ['/', '/cv', '/blogs', '/storyblok', '/about', '/blog/:path*']

const router = new Router({ indexPermalink: true })

// Disable cross origin fetch of /api route
router.match('/api/:path*', ({ setResponseHeader }) => {
  setResponseHeader('Access-Control-Allow-Origin', 'https://rishi.app')
})

router.prerender(async () => {
  const blogs = await getAllPostsForHome()
  const nonDynamicPaths = ['/', '/cv', '/about', '/blogs', '/storyblok']
  const paths = [...blogs.map((i) => ({ path: `/blog/${i.slug}` })), ...nonDynamicPaths.map((i) => ({ path: i }))]
  if (paths.length > 0 && process.env.DOMAIN_URL && process.env.SPEED_VITALS_KEY) {
    const resp = await fetch('https://ttfb-booster.fly.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paths,
        baseURL: process.env.DOMAIN_URL,
        SPEED_VITALS_KEY: process.env.SPEED_VITALS_KEY,
      }),
    })
    if (resp.ok) {
      const data = await resp.json()
      console.log(JSON.stringify({ data }))
    }
  }
  return paths
})

paths.forEach((i) => {
  router.match(i, ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
    removeUpstreamResponseHeader('cache-control')
    cache({
      edge: {
        maxAgeSeconds: 60,
        staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
      },
      browser: false,
      key: new CustomCacheKey().excludeAllQueryParameters(),
    })
    renderWithApp({
      transformResponse: async (res, req) => {
        const $ = load(res.body)
        const { minify } = await esImport('html-minifier')
        res.body = minify($.html(), minifyOptions)
      },
    })
  })
})

router.use(astroRoutes)

export default router
