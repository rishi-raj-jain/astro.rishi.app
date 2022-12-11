// This file was automatically added by edgio init.
// You should commit this file to source control.
import { load } from 'cheerio'
import { Router } from '@edgio/core'
import { astroRoutes } from '@edgio/astro'
import { minifyOptions } from 'minifyOptions'
import esImport from '@edgio/core/utils/esImport'

const paths = ['/', '/cv', '/blogs', '/storyblok', '/about', '/blog/:path*']

const router = new Router()

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
