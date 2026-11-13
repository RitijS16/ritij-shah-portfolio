import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { finePointer, reduceMotion } from '../lib/env'
import { sites } from '../data/resume'
import Strip from '../components/Strip'
import VarTitle from '../components/VarTitle'
import Magnetic from '../components/Magnetic'

const src = (f) => `${import.meta.env.BASE_URL}sites/${f}.webp`

// A browser window you scrub by moving across it; it cycles on its own when left alone.
function Site({ site, index }) {
  const root = useRef(null), stage = useRef(null)
  const [frame, setFrame] = useState(0)
  const n = site.frames.length

  useGSAP(() => {
    const imgs = gsap.utils.toArray('.frame-img', root.current)
    const reduce = reduceMotion()
    let cur = 0, timer = 0, hovering = false
    gsap.set(imgs.slice(1), { autoAlpha: 0 })
    const show = (k) => {
      k = (k + n) % n
      if (k === cur) return
      gsap.to(imgs[cur], { autoAlpha: 0, duration: reduce ? 0 : 0.45, overwrite: true })
      gsap.fromTo(imgs[k], { autoAlpha: 0, scale: reduce ? 1 : 1.04 }, { autoAlpha: 1, scale: 1, duration: reduce ? 0 : 0.6, ease: 'power2.out', overwrite: true })
      cur = k
      setFrame(k)
    }
    const stop = () => clearInterval(timer)
    const start = () => { stop(); if (!reduce) timer = setInterval(() => { if (!hovering) show(cur + 1) }, 2400 + index * 300) }
    const st = ScrollTrigger.create({ trigger: stage.current, start: 'top 90%', end: 'bottom 10%', onToggle: (s) => (s.isActive ? start() : stop()) })

    const el = stage.current
    const fine = finePointer()
    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.8, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.8, ease: 'power3.out' })
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height
      hovering = true
      show(Math.min(n - 1, Math.max(0, Math.floor(fx * n))))
      if (!reduce) { ry((fx - 0.5) * 10); rx(-(fy - 0.5) * 8) }
    }
    const leave = () => { hovering = false; rx(0); ry(0) }
    const tap = (e) => { if (e.pointerType !== 'mouse') { show(cur + 1); start() } }
    if (fine) { el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave) }
    el.addEventListener('pointerup', tap)

    if (!reduce) {
      gsap.from(root.current, { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: index * 0.12, scrollTrigger: { trigger: root.current, start: 'top 90%', once: true } })
      gsap.fromTo(root.current.querySelector('.phone'), { yPercent: 14 }, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    }
    return () => { stop(); st.kill(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointerup', tap) }
  }, { scope: root })

  return (
    <article ref={root} className="grid gap-[clamp(28px,4vw,72px)] items-center lg:grid-cols-12" aria-labelledby={'site-' + site.id}>
      <div className={'site-stage-wrap lg:col-span-8' + (index % 2 ? ' lg:order-2' : '')}>
        <div ref={stage} className="site-stage" data-cursor="scrub">
          <div className="browser">
            <div className="browser-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="url">{site.domain}</span>
            </div>
            <div className="browser-view">
              {site.frames.map(([f, cap], i) => (
                <img key={f} className="frame-img" src={src(f)} alt={`${site.name}: ${cap}`} width="1600" height="1000" loading={i ? 'lazy' : 'eager'} decoding="async" draggable="false" />
              ))}
            </div>
          </div>
          <div className="phone" aria-hidden="true"><img src={src(site.mobile)} alt="" width="780" height="1560" loading="lazy" draggable="false" /></div>
        </div>
        <div className="frame-ticks" aria-hidden="true">
          {site.frames.map(([f, cap], i) => <span key={f} className={i === frame ? 'on' : ''}><b />{cap}</span>)}
        </div>
      </div>
      <div className={'grid gap-6 content-center lg:col-span-4' + (index % 2 ? ' lg:order-1' : '')}>
        <div>
          <span className="label">{String(index + 1).padStart(2, '0')} · {site.kind}</span>
          <h3 id={'site-' + site.id} className="site-title">{site.name}</h3>
        </div>
        <p className="m-0 text-ink-2 text-lg max-w-[30ch]">{site.desc}</p>
        <div className="tags flex flex-wrap gap-1.5">{site.tags.map((t) => <span key={t}>{t}</span>)}</div>
        <div><Magnetic className="btn go" href={site.url} target="_blank" rel="noopener" data-cursor="visit">Visit site <span className="arr" aria-hidden="true">↗</span></Magnetic></div>
      </div>
    </article>
  )
}

export default function LiveSites() {
  return (
    <section className="module" id="work" aria-labelledby="sites-title">
      <div className="wrap">
        <Strip><span className="name">Work</span><span><b>{sites.length}</b> live sites</span><span className="end">Hover to scrub</span></Strip>
        <div className="module-head"><VarTitle id="sites-title" text="Live sites" /></div>
        <div className="grid gap-[clamp(96px,12vw,180px)]">
          {sites.map((s, i) => <Site key={s.id} site={s} index={i} />)}
        </div>
      </div>
    </section>
  )
}
