import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { finePointer, reduceMotion } from '../lib/env'

// Pulls the element toward the pointer while hovered, then springs back.
export default function Magnetic({ as: Tag = 'a', strength = 0.3, children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!finePointer() || reduceMotion()) return
    const el = ref.current
    const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      qx((e.clientX - (r.left + r.width / 2)) * strength)
      qy((e.clientY - (r.top + r.height / 2)) * strength * 1.3)
    }
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' })
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.killTweensOf(el) }
  }, [strength])
  return <Tag ref={ref} {...rest}>{children}</Tag>
}
