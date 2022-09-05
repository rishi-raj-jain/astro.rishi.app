import { skipWaiting, clientsClaim } from 'workbox-core'
import { Prefetcher, prefetch } from '@layer0/prefetch/sw'
import DeepFetchPlugin from '@layer0/prefetch/sw/DeepFetchPlugin'

skipWaiting()
clientsClaim()

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      {
        selector: 'script',
        maxMatches: 20,
        attribute: 'src',
        as: 'script',
        callback: deepFetchAssets,
      },
      {
        selector: '[rel="stylesheet"]',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
      {
        selector: '[rel="preload"]',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
      {
        selector: 'astro-island',
        maxMatches: 20,
        attribute: 'renderer-url',
        as: 'script',
        callback: deepFetchAssets
      }
    ]),
  ],
})
  .route()
  .cache(/^https:\/\/(.*?)\.com\/.*/)
  .cache(/^https:\/\/(.*?)\.net\/.*/)

function deepFetchAssets({ $el, el, $ }) {
  let urlTemplate = $(el).attr('href')
  if (urlTemplate) {
    prefetch(urlTemplate)
  }
  urlTemplate = $(el).attr('src')
  if (urlTemplate) {
    prefetch(urlTemplate)
  }
  urlTemplate = $(el).attr('renderer-url')
  if (urlTemplate) {
    prefetch(urlTemplate)
  }
  urlTemplate = $(el).attr('component-url')
  if (urlTemplate) {
    prefetch(urlTemplate)
  }
}
