if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    let t = await navigator.serviceWorker.getRegistrations()
    if (t.length > 0) return
    navigator.serviceWorker.register('/service-worker.js')
  })
}
