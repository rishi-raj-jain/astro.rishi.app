import * as fs from 'fs'
import postcss from 'postcss'
import * as cheerio from 'cheerio'
import tailwindcss from 'tailwindcss'
import { performance } from 'perf_hooks'
import baseConfig from '../tailwind.config.cjs'
import esImport from '@layer0/core/utils/esImport'

export default async function transformResponse(res, req) {
  let resOriginal = res.body
  const longTask = () =>
    new Promise(async (resolve) => {
      // Else, try this code which does some good performance optimization
      try {
        // If it's an HTML, then add the prefetch tags from the JSON
        if (res.getHeader('content-type') === 'text/html') {
          const $ = cheerio.load(res.body)

          // Read the list of URLs to be prefetched
          const prefetchList = JSON.parse(fs.readFileSync('./toPrefetchList.json', 'utf8'))

          // Create prefetch urls that will be prefetched by SW
          prefetchList.prefetch.forEach((i) => $('body').append(`<prefetch-url url="/${i}" />`))

          // Find the stylesheet that calls the global CSS -> a css that contains styles for the whole app -> created by astro
          const cssHrefSelector = $(`link[rel="stylesheet"][href*="about-"][href*=".css"]`)

          // If such a selector exists, remove the existing link and generate CSS
          if (cssHrefSelector && cssHrefSelector.attr('href').length > 0) {
            // Define the base CSS, use this as the global styles
            const sourceCSS = `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `

            // Remove the sets of content to purge as nothing to purge there
            delete baseConfig['content']

            const tailwindConfig = {
              // Pass the plugin preset
              presets: [baseConfig],
              // Defining content as the html of the page to just generate the CSS received on the page
              content: [{ raw: $.html(), extension: 'html' }],
            }

            // Get the processsed css
            const css = await postcss([tailwindcss(tailwindConfig)]).process(sourceCSS)

            // If there's a css, append it to the page
            if (css.css.length > 0) {
              $('head').append(`<style>${css.css}</style>`)
              // Remove such element if it exists
              // This is blocking CSS and what I attempt to do is to create CSS on the fly instead
              // Why? Blocking CSS it should be but not require the CSS of the whole app to be blocking
              $(`link[rel="stylesheet"][href*="about-"][href*=".css"]`).remove()
            }
          } else {
            console.log('Did not found such a selector.')
          }

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
          })
          resolve()
          // .replace(/>\s+</g, '><') // Can't do this as this affects how code is rendered
        }
      } catch (e) {
        // Preserve the initial response body in case of failure
        res.body = resOriginal
        res.statusCode = 200
        console.log(e)
        resolve()
      }
    })
  const timeout = (cb, interval) => () => new Promise((resolve) => setTimeout(() => cb(resolve), interval))
  const onTimeout = timeout(async (resolve) => {
    res.body = resOriginal
    console.log('[10s]', req.url)
    resolve()
  }, 10 * 1000)
  try {
    var startTime = performance.now()
    // Regardless of what happens, return original body after 10 seconds
    await Promise.race([longTask, onTimeout])
    var endTime = performance.now()
    console.log(`Call to ${req.url} took ${endTime - startTime} milliseconds`)
  } catch (e) {
    // Preserve the initial response body in case of failure
    res.body = resOriginal
    res.statusCode = 200
    console.log(e)
  }
}
