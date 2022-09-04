import { useEffect } from 'react'
import install from '@layer0/prefetch/window/install'

export default function Layer0({}) {
  useEffect(() => {
    install()
  }, [])
  return <></>
}
