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
  const speedTestTTFB = (path) => {
    let regions = ['asia', 'america', 'europe']
    regions.forEach((i) => {
      console.log({ i })
      fetch('https://api.speedvitals.com/v1/ttfb-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': process.env.SPEED_VITALS_KEY },
        body: JSON.stringify({ url: `https://rishi.app${path}`, region: i }),
      })
    })
  }
  const urlsToPrerender = [...blogs.map((i) => ({ path: `/blog/${i.slug}` })), ...nonDynamicPaths.map((i) => ({ path: i }))]
  urlsToPrerender.forEach((i) => {
    console.log({ i })
    speedTestTTFB(i.path)
  })
  return urlsToPrerender
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
