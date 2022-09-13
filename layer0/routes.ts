import { Router } from '@layer0/core/router'
import { getAllPostsForHome } from '../src/api'
import transformResponse from './transformResponse'
import { isProductionBuild } from '@layer0/core/environment'
import { ONE_DAY_CACHE_HANDLER, ONE_DAY_CACHE_VALUES } from './cache'

const router = new Router()

// Pre-Render Requests as soon as deployed to warm cache
router.prerender(async () => {
  const resp = await getAllPostsForHome()
  return ['/', '/about', '/blogs', '/cv', '/storyblok', ...resp.map((i) => `/blog/${i.slug}`)]
})

// Regex to catch multiple hostnames
// Any deployment will have a L0 permalink
// Don't allow Google bot to crawl it, read more on:
// https://docs.layer0.co/guides/cookbook#blocking-search-engine-crawlers
router.noIndexPermalink()

// Serve the old Layer0 predefined routes by the latest prefix
router.match('/__xdn__/:path*', ({ redirect }) => {
  redirect('/__layer0__/:path*', 301)
})

// Service Worker
router.match('/service-worker.js', ({ serveStatic }) => {
  serveStatic('dist/service-worker.js')
})

router.match('/l0-storyblok/:path*', ({ cache, proxy }) => {
  cache(ONE_DAY_CACHE_VALUES)
  proxy('storyblok', { path: ':path*' })
})

// Only compiled with 0 build / 0 deploy
if (isProductionBuild()) {
  // Create serve static routes for the all the assets under dist/client folder
  router.static('dist/client', {
    handler: () => ONE_DAY_CACHE_HANDLER,
  })

  // Cache but not in 0 dev mode
  router.match('/', ONE_DAY_CACHE_HANDLER)
  router.match('/cv', ONE_DAY_CACHE_HANDLER)
  router.match('/about', ONE_DAY_CACHE_HANDLER)
  router.match('/blogs', ONE_DAY_CACHE_HANDLER)
  router.match('/storyblok', ONE_DAY_CACHE_HANDLER)
  router.match('/blog/:name', ONE_DAY_CACHE_HANDLER)
}

router.fallback(({ renderWithApp }) => {
  renderWithApp({ transformResponse })
})

export default router
