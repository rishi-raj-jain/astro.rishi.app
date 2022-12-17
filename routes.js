// This file was automatically added by edgio init.
// You should commit this file to source control.

import { load } from 'cheerio'
import { Router } from '@edgio/core'
import { astroRoutes } from '@edgio/astro'
import { minifyOptions } from 'minifyOptions'
import { getAllPostsForHome } from '@/src/api'
import esImport from '@edgio/core/utils/esImport'

const paths = ['/', '/cv', '/blogs', '/storyblok', '/about', '/blog/:path*']

const router = new Router({ indexPermalink: true })

// Disable cross origin fetch of /api route
router.match('/api/:path*', ({ setResponseHeader }) => {
  setResponseHeader('Access-Control-Allow-Origin', 'https://rishi.app')
})

router.prerender(async () => {
  const blogs = await getAllPostsForHome()
  const nonDynamicPaths = ['/', '/cv', '/about', '/blogs', '/storyblok']
  return [...blogs.map((i) => ({ path: `/blog/${i.slug}` })), ...nonDynamicPaths.map((i) => ({ path: i }))]
})

paths.forEach((i) => {
  router.match(i, ({ cache, removeUpstreamResponseHeader, renderWithApp }) => {
    removeUpstreamResponseHeader('cache-control')
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
      browser: false,
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
