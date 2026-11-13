import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { reduceMotion } from '../lib/env'
import { about, person } from '../data/resume'
import Strip from '../components/Strip'
import VarTitle from '../components/VarTitle'

function Clock() {
  const [t, setT] = useState('--:--')
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })
    const tick = () => setT(f.format(new Date()))
    tick()
    const id = setInterval(tick, 20000)
    return () => clearInterval(id)
  }, [])
  return <b>{t}</b>
}

// Skills ticker: drifts left on its own, speeds up with scroll velocity and reverses when you scroll up.
function Marquee() {
  const track = useRef(null)
  useGSAP(() => {
    if (reduceMotion()) return
    const loop = gsap.to(track.current, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
    let dir = 1
    ScrollTrigger.create({
      trigger: track.current, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity()
        if (Math.abs(v) > 5) dir = v < 0 ? -1 : 1
        gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 180, 7)), duration: 0.25, overwrite: true })
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, ease: 'power2.out' })
      },
    })
  }, { scope: track })
  const items = [...about.marquee, ...about.marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" ref={track}>{items.map((s, i) => <span key={i}>{s}</span>)}</div>
    </div>
  )
}

export default function About() {
  const root = useRef(null)
  useGSAP(() => {
    if (reduceMotion()) return
    gsap.from('.about-big', { y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.about-big', start: 'top 88%', once: true } })
    gsap.utils.toArray('.facts').forEach((dl) => gsap.from(dl.children, { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out', scrollTrigger: { trigger: dl, start: 'top 88%', once: true } }))
  }, { scope: root })
  const Facts = ({ rows, className = '' }) => (
    <dl className={'facts m-0 grid content-start border-t border-rule ' + className}>
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[12ch_minmax(0,1fr)] gap-3 py-3 border-b border-rule text-[15px]">
          <dt className="label leading-[1.9]">{k}</dt><dd className="m-0 min-w-0">{v}</dd>
        </div>
      ))}
    </dl>
  )
  return (
    <section className="module" id="about" ref={root} aria-labelledby="about-title">
      <div className="wrap">
        <Strip><span className="name">About</span><span>{person.city}, Maharashtra</span><span className="end">Local time <Clock /> IST</span></Strip>
        <div className="module-head"><VarTitle id="about-title" text="About" /></div>
      </div>
      <Marquee />
      <div className="wrap">
        <div className="grid gap-[clamp(28px,5vw,80px)] pt-[clamp(32px,4vw,56px)] pb-[clamp(56px,8vw,110px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <p className="about-big m-0 font-medium text-[clamp(22px,2.4vw,32px)] leading-[1.3] tracking-[-0.01em] max-w-[30ch] text-pretty">{about.intro}</p>
            <Facts rows={about.facts} className="mt-8" />
          </div>
          <Facts rows={about.skills} />
        </div>
      </div>
    </section>
  )
}
