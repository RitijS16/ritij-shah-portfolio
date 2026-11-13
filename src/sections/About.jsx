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

// Skills ticker: drifts on its own, speeds up with scroll velocity and reverses when you scroll up.
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
    gsap.from('.about-in > *', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.about-in', start: 'top 88%', once: true } })
    gsap.from('.skill-chip', { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.02, ease: 'power2.out', scrollTrigger: { trigger: '.skills', start: 'top 90%', once: true } })
  }, { scope: root })
  return (
    <section className="module" id="about" ref={root} aria-labelledby="about-title">
      <div className="wrap">
        <Strip><span className="name">About</span><span>{person.city}</span><span className="end">Local time <Clock /> IST</span></Strip>
        <div className="module-head"><VarTitle id="about-title" text="About" /></div>
      </div>
      <Marquee />
      <div className="wrap">
        <div className="grid gap-[clamp(28px,5vw,72px)] pt-[clamp(28px,4vw,48px)] lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
          <div className="about-in grid gap-6 content-start">
            <p className="m-0 font-medium text-[clamp(22px,2.4vw,30px)] leading-[1.3] tracking-[-0.01em] max-w-[26ch] text-pretty">{about.intro}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {about.badges.map(([k, v]) => (
                <div key={k} className="card !p-4 grid gap-1"><b className="text-[15px] font-semibold">{k}</b><span className="text-[13px] text-ink-2">{v}</span></div>
              ))}
            </div>
          </div>
          <div className="skills grid gap-3 content-start">
            {about.skills.map(([group, list]) => (
              <div key={group} className="grid grid-cols-[9ch_minmax(0,1fr)] gap-3 items-baseline">
                <span className="label">{group}</span>
                <div className="flex flex-wrap gap-1.5">{list.map((s) => <span key={s} className="skill-chip">{s}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
