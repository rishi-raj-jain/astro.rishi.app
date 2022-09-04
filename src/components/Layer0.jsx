import { useEffect } from 'react'

export default function Layer0() {
  useEffect(() => {
    console.log(navigator.serviceWorker)
    navigator.serviceWorker.addEventListener('message', async (event) => {
      if (event.data.action === 'prefetch') {
        const module = await import('@layer0/prefetch/window')
        console.log(module)
        prefetch(event.data.url, event.data.as, event.data.options)
      }
    })
  }, [])
  return <></>
}
