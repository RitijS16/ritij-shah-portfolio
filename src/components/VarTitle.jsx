import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { finePointer, reduceMotion } from '../lib/env'

// Letters split into spans. Two layers of font-variation:
//   --w0/--g0  the intro: letters arrive wide and light, then settle condensed and heavy
//   --wp/--gp  proximity: letters near the pointer stretch wider and heavier
const registry = new Set()
let listening = false, mx = -1e4, my = -1e4, raf = 0
function onMove(e) {
  mx = e.clientX; my = e.clientY
  if (!raf) raf = requestAnimationFrame(update)
}
function update() {
  raf = 0
  for (const t of registry) {
    if (!t.visible) continue
    for (const c of t.chars) {
      const r = c.el.getBoundingClientRect()
      const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2))
      let f = Math.max(0, 1 - d / t.radius)
      f = f * f * (3 - 2 * f)
      c.qw(f * 53)
      c.qg(f * 120)
    }
  }
}

export default function VarTitle({ as: Tag = 'h2', text, className = 'vt', radius = 260, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const spans = [...el.querySelectorAll('.ch')]
    const reduce = reduceMotion()
    const entry = { visible: false, radius, chars: [] }
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.fromTo(spans, { '--w0': 125, '--g0': 250 }, {
          '--w0': 72, '--g0': 780, duration: 1.3, ease: 'expo.out', stagger: 0.04,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      }
      if (finePointer() && !reduce) {
        entry.chars = spans.map((s) => ({
          el: s,
          qw: gsap.quickTo(s, '--wp', { duration: 0.6, ease: 'power3.out' }),
          qg: gsap.quickTo(s, '--gp', { duration: 0.6, ease: 'power3.out' }),
        }))
        ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (s) => { entry.visible = s.isActive } })
      }
    }, el)
    registry.add(entry)
    if (!listening && finePointer()) { window.addEventListener('pointermove', onMove, { passive: true }); listening = true }
    return () => { registry.delete(entry); ctx.revert() }
  }, [text, radius])

  return (
    <Tag ref={ref} className={className} aria-label={text} {...rest}>
      {text.split(' ').map((word, w, all) => (
        <span key={w} aria-hidden="true">
          <span className="wd">{[...word].map((ch, i) => <span key={i} className="ch">{ch}</span>)}</span>
          {w < all.length - 1 && <span className="sp"> </span>}
        </span>
      ))}
    </Tag>
  )
}
