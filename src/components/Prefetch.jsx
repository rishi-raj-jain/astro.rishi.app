import { useEffect } from 'react'
import { prefetch } from '@layer0/prefetch/window/prefetch'

export default function Prefetch({ url }) {
  useEffect(() => {
    prefetch(url)
  }, [])
  return <></>
}
