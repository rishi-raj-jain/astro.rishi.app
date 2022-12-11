// This file was automatically added by edgio init.
// You should commit this file to source control.
import { Router } from '@edgio/core'
import { astroRoutes } from '@edgio/astro'

const paths = ['/', '/cv', '/blogs', '/storyblok', '/about', '/blog/:path*']

const router = new Router()

paths.forEach((i) => {
  router.match(i, ({ cache, removeUpstreamResponseHeader }) => {
    removeUpstreamResponseHeader('cache-control')
    cache({
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
      browser: false,
    })
  })
})

router.use(astroRoutes)

export default router
