import { useEffect } from 'react'
import install from '@layer0/prefetch/window/install'

export default function Layer0({}) {
  useEffect(() => {
    navigator.serviceWorker.getRegistrations().then((t) => {
      console.log(t)
      if (t.length < 1) {
        install()
      }
    })
  }, [])
  return <></>
}
