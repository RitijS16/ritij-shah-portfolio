import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollSmoother } from '../lib/gsap'

const LINKS = [
  ['work', 'Work', ''],
  ['experience', 'Experience', 'opt'],
  ['space', 'Playground', 'opt'],
  ['about', 'About', 'opt'],
  ['contact', 'Contact', ''],
]
const SECTION_TO_LINK = { work: 'work', lstm: 'work', projects: 'work', experience: 'experience', space: 'space', about: 'about', contact: 'contact' }

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const s = ScrollSmoother.get()
  if (s) s.scrollTo(el, true, 'top 52px')
  else el.scrollIntoView({ behavior: 'smooth' })
  history.replaceState(null, '', id === 'top' ? location.pathname : '#' + id)
}

export default function TopBar() {
  const [active, setActive] = useState('')
  const nav = useRef(null), ink = useRef(null), rx = useRef(null), ry = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(SECTION_TO_LINK[e.target.id] || '') }), { rootMargin: '-45% 0px -50% 0px' })
    Object.keys(SECTION_TO_LINK).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    const top = document.getElementById('top')
    const ioTop = new IntersectionObserver((es) => { if (es[0].isIntersecting && es[0].intersectionRatio > 0.5) setActive('') }, { threshold: [0, 0.5, 1] })
    if (top) ioTop.observe(top)
    let q = 0
    const move = (e) => {
      if (q) return
      q = requestAnimationFrame(() => { q = 0; rx.current.textContent = Math.round(e.pageX); ry.current.textContent = Math.round(e.pageY) })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { io.disconnect(); ioTop.disconnect(); window.removeEventListener('pointermove', move) }
  }, [])

  // slide the orange underline to the active link
  useEffect(() => {
    const a = nav.current?.querySelector(`a[data-id="${active}"]`)
    if (!a || getComputedStyle(a).display === 'none') { gsap.to(ink.current, { width: 0, duration: 0.3 }); return }
    gsap.to(ink.current, { x: a.offsetLeft, width: a.offsetWidth, duration: 0.5, ease: 'expo.out' })
  }, [active])

  const go = (e, id) => { e.preventDefault(); scrollToId(id) }
  return (
    <header className="topbar">
      <a className="brand" href="#top" onClick={(e) => go(e, 'top')} aria-label="Ritij Shah, back to top">Ritij Shah</a>
      <nav className="nav relative" aria-label="Sections" ref={nav}>
        {LINKS.map(([id, text, cls]) => (
          <a key={id} href={'#' + id} data-id={id} className={cls} aria-current={active === id ? 'true' : 'false'} onClick={(e) => go(e, id)}>{text}</a>
        ))}
        <span className="nav-ink" ref={ink} aria-hidden="true" />
      </nav>
      <div className="readout" aria-hidden="true"><span>x <b ref={rx}>0</b></span><span>y <b ref={ry}>0</b></span></div>
    </header>
  )
}
