import * as fs from 'fs'
import * as cheerio from 'cheerio'
import { Router } from '@layer0/core/router'
import { ONE_DAY_CACHE_HANDLER } from './cache'
import { isProductionBuild } from '@layer0/core/environment'

const router = new Router()

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
  renderWithApp({
    transformResponse: (res) => {
      // If it's an HTML, then add the prefetch tags from the JSON
      if (res.getHeader('content-type') === 'text/html') {
        const $ = cheerio.load(res.body)
        const prefetchList = JSON.parse(fs.readFileSync('./toPrefetchList.json', 'utf8'))
        prefetchList.prefetch.forEach((i) => $('body').append(`<prefetch-url url="/${i}" />`))
        res.body = $.html()
      }
    },
  })
})

export default router
