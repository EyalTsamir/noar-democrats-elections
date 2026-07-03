import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** גולל לראש העמוד בכל מעבר בין עמודים */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
