import { useEffect } from 'react'
import { ScrollSmoother, ScrollTrigger, useGSAP } from './lib/gsap'
import { reduceMotion } from './lib/env'
import TopBar, { scrollToId } from './components/TopBar'
import Cursor from './components/Cursor'
import Hero from './sections/Hero'
import LiveSites from './sections/LiveSites'
import TextGenerator from './sections/TextGenerator'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import WordSpace from './sections/WordSpace'
import About from './sections/About'
import Contact from './sections/Contact'

export default function App() {
  // Smooth, eased scrolling for the whole page; fixed UI (top bar, cursor) sits outside the smoothed wrapper.
  useGSAP(() => {
    ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: reduceMotion() ? 0 : 1.15, effects: true, smoothTouch: 0.1 })
  })
  useEffect(() => {
    const id = location.hash.slice(1)
    if (id) setTimeout(() => scrollToId(id), 300)
    const t = setTimeout(() => ScrollTrigger.refresh(), 1200)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      <TopBar />
      <Cursor />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <LiveSites />
            <TextGenerator />
            <Projects />
            <Experience />
            <WordSpace />
            <About />
            <Contact />
          </main>
          <footer className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2.5 pt-[18px] pb-[calc(18px+env(safe-area-inset-bottom,0px))] border-t border-rule font-mono text-xs text-ink-3">
            <span>© 2026 Ritij Shah</span>
            <span>Built with React, Three.js and GSAP</span>
          </footer>
        </div>
      </div>
    </>
  )
}
