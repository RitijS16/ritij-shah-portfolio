import { useEffect, useRef, useState } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { createPinscreen } from '../lib/pinscreen'
import { fontsReady, reduceMotion } from '../lib/env'
import { person } from '../data/resume'

const DEFAULT = 'RITIJ'
const cleanWord = (s) => s.toUpperCase().replace(/[^A-Z0-9 &!?.-]/g, '').slice(0, 10)

export default function Hero() {
  const root = useRef(null), pinsRef = useRef(null), api = useRef(null), fresh = useRef(true)
  const [word, setWord] = useState(DEFAULT)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const p = createPinscreen(pinsRef.current, { word: '', onCount: setCount })
    api.current = p
    let alive = true
    fontsReady().then(() => alive && p.setWord(DEFAULT))
    return () => { alive = false; p.destroy(); api.current = null }
  }, [])

  const wordRef = useRef(DEFAULT)
  const apply = (w) => { const v = cleanWord(w); wordRef.current = v; setWord(v); api.current?.setWord(v.trim() || DEFAULT) }

  // typing anywhere while the hero is on screen rewrites the pins
  useEffect(() => {
    let heroVisible = true
    const io = new IntersectionObserver((es) => { heroVisible = es[0].isIntersecting }, { threshold: 0.1 })
    io.observe(root.current)
    const key = (e) => {
      if (!heroVisible || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return
      let val = wordRef.current
      if (e.key === 'Escape') { fresh.current = true; apply(DEFAULT); return }
      if (e.key === 'Backspace') {
        if (fresh.current) val = ''
        fresh.current = false
        e.preventDefault()
        apply(val.slice(0, -1))
        return
      }
      const ok = e.key.length === 1 && (/[a-z0-9&!?.-]/i.test(e.key) || (e.key === ' ' && !fresh.current))
      if (!ok) return
      if (fresh.current) { val = ''; fresh.current = false }
      e.preventDefault()
      apply(val + e.key)
    }
    window.addEventListener('keydown', key)
    return () => { io.disconnect(); window.removeEventListener('keydown', key) }
  }, [])

  useGSAP(() => {
    if (reduceMotion()) return
    SplitText.create('.hero h1', {
      type: 'lines', mask: 'lines', autoSplit: true,
      // returning the tween lets SplitText re-split on font load / resize without losing progress
      onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.2, stagger: 0.09, ease: 'expo.out', delay: 0.15 }),
    })
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
    tl.from('.hero .eyebrow', { y: 14, autoAlpha: 0, duration: 0.8 }, 0.05)
      .from('.hero .lede', { y: 18, autoAlpha: 0, duration: 1 }, 0.35)
      .from('.hero .hints > *', { y: 12, autoAlpha: 0, duration: 0.7, stagger: 0.06 }, 0.45)
      .from('.hero .pin-field', { y: 16, autoAlpha: 0, duration: 0.9 }, 0.55)
      .from('.hero-top .label', { autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 0.6)
  }, { scope: root })

  return (
    <section className="hero" id="top" ref={root} aria-label="Introduction">
      <div className="pins" ref={pinsRef} data-speed="0.82" data-cursor="press" role="img" aria-label="A 3D pin-art wall. The pins spell the word in the text field and react to your pointer." />
      <div className="hero-top wrap">
        <span className="label">Pinscreen · {count.toLocaleString('en-US')} pins</span>
        <span className="label">Word: {word.trim() || DEFAULT}</span>
      </div>
      <div className="hero-copy wrap">
        <div>
          <span className="label eyebrow">{person.name} · {person.role} · {person.city}</span>
          <h1>I build web apps and AI tools that move.</h1>
          <p className="lede">Currently building at Gritfox. Type a word to rewrite the pins.</p>
        </div>
        <div className="hero-side">
          <div className="hints" aria-hidden="true">
            <span className="opt"><kbd>Move</kbd> press</span>
            <span><kbd>Click</kbd> ripple</span>
            <span className="opt"><kbd>Hold</kbd> draw</span>
            <span><kbd>Type</kbd> rewrite</span>
          </div>
          <div className="pin-field">
            <label htmlFor="pin-text">Word</label>
            <input id="pin-text" type="text" value={word} maxLength={10} autoComplete="off" autoCapitalize="characters" spellCheck="false"
              onChange={(e) => { fresh.current = false; apply(e.target.value) }} />
            <button type="button" data-cursor="reset" onClick={() => { fresh.current = true; apply(DEFAULT) }}>Reset</button>
          </div>
        </div>
      </div>
    </section>
  )
}
