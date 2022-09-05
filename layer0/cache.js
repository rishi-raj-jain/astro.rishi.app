export const ONE_DAY_CACHE_HANDLER = ({ cache }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60 * 24,
      // Cache responses even if they contain cache-control: private header
      // https://docs.layer0.co/guides/caching#private
      // https://docs.layer0.co/docs/api/core/interfaces/_router_cacheoptions_.edgecacheoptions.html#forceprivatecaching
      forcePrivateCaching: true,
    },
    browser: {
      // cache in the browser using the service worker for one hour
      // extends edge in the browser
      serviceWorkerSeconds: 60 * 60,
    },
  })
}
