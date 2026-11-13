import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { reduceMotion } from '../lib/env'
import { roles, timeline } from '../data/resume'
import Strip from '../components/Strip'
import VarTitle from '../components/VarTitle'

export default function Experience() {
  const root = useRef(null)
  const [hl, setHl] = useState('')
  useGSAP(() => {
    if (reduceMotion()) return
    gsap.from('.g-bar', { scaleX: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.gantt', start: 'top 85%', once: true } })
    gsap.from('.role', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.role', start: 'top 90%', once: true } })
  }, { scope: root })

  const hover = (id) => ({ onPointerEnter: () => setHl(id), onPointerLeave: () => setHl('') })
  return (
    <section className="module" id="experience" ref={root} aria-labelledby="exp-title">
      <div className="wrap">
        <Strip><span className="name">Experience</span><span>{timeline.start} → now</span></Strip>
        <div className="module-head"><VarTitle id="exp-title" text="Experience" /></div>
        <div className="gantt grid gap-3 mb-[clamp(40px,5vw,64px)]" aria-hidden="true">
          {roles.map((r) => (
            <div key={r.id} className="grid grid-cols-[11ch_minmax(0,1fr)] sm:grid-cols-[17ch_minmax(0,1fr)] gap-3.5 items-center" {...hover(r.id)}>
              <span className="font-mono text-xs text-ink-2 truncate">{r.short}</span>
              <div className="g-track">
                <span className={`g-bar${r.now ? ' now' : ''}${hl === r.id ? ' hl' : ''}`} style={{ gridColumn: `${r.start + 1} / ${r.end + 1}` }} />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-[11ch_minmax(0,1fr)] sm:grid-cols-[17ch_minmax(0,1fr)] gap-3.5">
            <span />
            <div className="grid font-mono text-[11px] text-ink-3" style={{ gridTemplateColumns: `repeat(${timeline.months}, minmax(0, 1fr))` }}>
              {timeline.ticks.map(([i, t], k) => <span key={i} className={'whitespace-nowrap' + (k % 2 ? ' max-sm:invisible' : '')} style={{ gridColumn: i + 1, gridRow: 1 }}>{t}</span>)}
            </div>
          </div>
        </div>
        <div className="grid border-t border-rule">
          {roles.map((r) => (
            <article key={r.id} className={'role grid gap-x-6 gap-y-1 py-6 border-b border-rule md:grid-cols-[17ch_minmax(0,2fr)_minmax(0,3fr)] items-baseline' + (hl === r.id ? ' hl' : '')} {...hover(r.id)}>
              <span className="font-mono text-xs text-ink-3 tabular-nums">{r.when}</span>
              <h3 className="m-0 text-[17px] leading-snug font-semibold">{r.title} <span className="font-normal text-ink-2">· {r.org}</span></h3>
              <p className="m-0 text-ink-2">{r.line}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
