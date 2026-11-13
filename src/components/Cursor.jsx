import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { finePointer } from '../lib/env'

// Ring + context label that trail the pointer. The label reads data-cursor from whatever is under it.
export default function Cursor() {
  const root = useRef(null), ring = useRef(null), label = useRef(null)
  useEffect(() => {
    if (!finePointer()) return
    document.documentElement.classList.add('cx')
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.18, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.18, ease: 'power3.out' })
    const lx = gsap.quickTo(label.current, 'x', { duration: 0.35, ease: 'power3.out' })
    const ly = gsap.quickTo(label.current, 'y', { duration: 0.35, ease: 'power3.out' })
    let shown = '', px = -1, py = -1
    const update = (t) => {
      if (!t || !t.closest) return
      const typing = t.closest('input[type="text"], input[type="search"], textarea')
      root.current.classList.toggle('on', !typing)
      const ctx = t.closest('[data-cursor]')
      const want = ctx ? ctx.getAttribute('data-cursor') : t.closest('a, button') ? 'click' : ''
      root.current.classList.toggle('ctx', !!want)
      if (want !== shown) {
        shown = want
        if (want) label.current.textContent = want
        gsap.to(label.current, { autoAlpha: want ? 1 : 0, scale: want ? 1 : 0.6, duration: 0.25, ease: 'power2.out' })
        gsap.to(ring.current, { scale: want ? 1.7 : 1, duration: 0.35, ease: 'back.out(2)' })
      }
    }
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      px = e.clientX; py = e.clientY
      rx(px); ry(py); lx(px); ly(py)
      update(e.target)
    }
    const scroll = () => { if (px >= 0) update(document.elementFromPoint(px, py)) }
    const down = () => gsap.to(ring.current, { scale: 0.7, duration: 0.15 })
    const up = () => gsap.to(ring.current, { scale: shown ? 1.7 : 1, duration: 0.4, ease: 'back.out(3)' })
    const leave = () => root.current.classList.remove('on')
    gsap.set(label.current, { autoAlpha: 0 })
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => {
      document.documentElement.classList.remove('cx')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
    }
  }, [])
  return (
    <div className="cur" ref={root} aria-hidden="true">
      <span className="cur-ring" ref={ring} />
      <span className="cur-label" ref={label}>you</span>
    </div>
  )
}
