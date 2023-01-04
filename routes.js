// This file was automatically added by edgio init.
// You should commit this file to source control.

import { load } from 'cheerio'
import fetch from 'node-fetch'
import { astroRoutes } from '@edgio/astro'
import { minifyOptions } from 'minifyOptions'
import { getAllPostsForHome } from '@/src/api'
import esImport from '@edgio/core/utils/esImport'
import { CustomCacheKey, Router } from '@edgio/core'

const paths = ['/', '/cv', '/blogs', '/storyblok', '/about', '/blog/:path', '/showcase/:path']

const router = new Router({ indexPermalink: true })

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

// Route requests requesting showcase assets to showcase prefix
router.match('/showcase/:path.:ext(js|mjs|css|png|ico|svg|jpg|jpeg|gif|ttf|woff|otf)', ({ serveStatic }) => {
  serveStatic('dist/client/showcase/:path.:ext')
})

// Disable cross origin fetch of /api route
router.match('/api/:path*', ({ setResponseHeader }) => {
  setResponseHeader('Access-Control-Allow-Origin', 'https://rishi.app')
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
        let statusCodeOriginal = res.statusCode
        try {
          if (res.getHeader('content-type').includes('html')) {
            const $ = load(res.body)
            const { minify } = await esImport('html-minifier')
            res.body = minify($.html(), minifyOptions)
          }
        } catch (e) {
          console.log(e.message || e.toString())
          res.statusCode = statusCodeOriginal
        }
      },
    })
  })
})

router.use(astroRoutes)

export default router
