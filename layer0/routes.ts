import * as fs from 'fs'
import * as cheerio from 'cheerio'
import { Router } from '@layer0/core/router'
import esImport from '@layer0/core/utils/esImport'
import { isProductionBuild } from '@layer0/core/environment'
import { ONE_DAY_CACHE_HANDLER, ONE_DAY_CACHE_VALUES } from './cache'

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
  renderWithApp({
    transformResponse: async (res) => {
      let resOriginal = res.body
      try {
        // If it's an HTML, then add the prefetch tags from the JSON
        if (res.getHeader('content-type') === 'text/html') {
          const $ = cheerio.load(res.body)
          // Read the list of URLs to be prefetched
          const prefetchList = JSON.parse(fs.readFileSync('./toPrefetchList.json', 'utf8'))
          // Create prefetch urls that will be prefetched by SW
          prefetchList.prefetch.forEach((i) => $('body').append(`<prefetch-url url="/${i}" />`))
          // ES-Import html-minifier es module
          const { minify } = await esImport('html-minifier')
          // Replace the a.storyblok.com path with the proxied path
          res.body = minify($.html().replace(/https:\/\/a\.storyblok\.com\//g, '/l0-storyblok/'), {
            decodeEntities: true,
            minifyCSS: true,
            minifyJS: true,
            processConditionalComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            trimCustomFragments: true,
            useShortDoctype: true,
            // collapseWhitespace: true, // Can't do this as it leads to client-side react errors
            collapseInlineTagWhitespace: true,
          }).replace(/>\s+</g, '><')
        }
      } catch (e) {
        // Preserve the initial response body in case of failure
        res.body = resOriginal
        console.log(e)
      }
    },
  })
})

export default router
