import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { reduceMotion } from '../lib/env'

// Mono readout strip that opens each module. Its rules draw in from the left on scroll.
export default function Strip({ children }) {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion()) return
    gsap.fromTo(ref.current, { '--line': 0 }, { '--line': 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true } })
    gsap.from(ref.current.children, { y: 10, autoAlpha: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true } })
  }, { scope: ref })
  return <div className="strip" ref={ref}>{children}</div>
}
