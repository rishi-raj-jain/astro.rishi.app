// This file was automatically added by edgio init.
// You should commit this file to source control.

import { astroRoutes } from '@edgio/astro'
import { CustomCacheKey, Router } from '@edgio/core'

const paths = ['/', '/cv', '/blogs', '/storyblok', '/about', '/blog/:path', '/showcase/:path']

const router = new Router()

// Disable cross origin fetch of /api route
router.match('/api/:path*', ({ setResponseHeader }) => {
  setResponseHeader('Access-Control-Allow-Origin', 'https://rishi.app')
})

paths.forEach((i) => {
  router.match(i, ({ cache, removeUpstreamResponseHeader }) => {
    removeUpstreamResponseHeader('cache-control')
    cache({
      edge: {
        maxAgeSeconds: 60,
        staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
      },
      key: new CustomCacheKey().excludeAllQueryParameters(),
    })
  })
})

router.use(astroRoutes)

export default router
