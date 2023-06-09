import { CustomCacheKey, Router } from '@edgio/core'
import { isProductionBuild } from '@edgio/core/environment'

const paths = ['/', '/cv', '/blogs', '/storyblok', '/about', '/blog/:path', '/showcase/:path']

const router = new Router()

router.match('/api/:path*', ({ setResponseHeader }) => {
  setResponseHeader('Access-Control-Allow-Origin', 'https://rishi.app')
})

if (isProductionBuild()) {
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
  router.static('dist/client')
}

router.match('/_image', ({ cache }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
  })
})

router.fallback(({ renderWithApp }) => {
  renderWithApp()
})

export default router
