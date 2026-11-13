import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { finePointer, reduceMotion } from '../lib/env'
import { sites } from '../data/resume'
import Strip from '../components/Strip'
import VarTitle from '../components/VarTitle'
import Magnetic from '../components/Magnetic'

const src = (f) => `${import.meta.env.BASE_URL}sites/${f}.webp`

function Site({ site, index }) {
  const root = useRef(null), stage = useRef(null), browser = useRef(null)
  const [frame, setFrame] = useState(0)
  const n = site.frames.length

  useGSAP(() => {
    const imgs = gsap.utils.toArray('.frame-img', root.current)
    const reduce = reduceMotion()
    gsap.set(imgs.slice(1), { autoAlpha: 0 })
    const mm = gsap.matchMedia()

    // Desktop: pin the block and scrub through the site's frames as you scroll.
    mm.add('(min-width: 1024px)', () => {
      if (reduce) return
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top top+=72', end: () => '+=' + window.innerHeight * (0.55 * n + 0.3),
          pin: true, scrub: 0.8, anticipatePin: 1,
          onUpdate: (self) => setFrame(Math.min(n - 1, Math.floor(self.progress * n * 0.999))),
        },
      })
      tl.fromTo(browser.current, { rotateX: 14, y: 40 }, { rotateX: 0, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
      imgs.forEach((img, i) => {
        if (!i) return
        tl.fromTo(img, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 1 }, i - 0.5)
        tl.to(imgs[i - 1], { scale: 0.96, duration: 1 }, i - 0.5)
      })
      tl.fromTo('.phone', { yPercent: 18 }, { yPercent: -14, duration: n }, 0)
      tl.to({}, { duration: 0.4 })
      return () => setFrame(0)
    })

    // Smaller screens: frames advance on their own while visible, and on tap.
    mm.add('(max-width: 1023px)', () => {
      let i = 0, timer = 0
      const show = (k) => {
        const prev = imgs[i]; i = (k + n) % n
        gsap.to(prev, { autoAlpha: 0, duration: reduce ? 0 : 0.6 })
        gsap.fromTo(imgs[i], { autoAlpha: 0, scale: reduce ? 1 : 1.05 }, { autoAlpha: 1, scale: 1, duration: reduce ? 0 : 0.8, ease: 'power2.out' })
        setFrame(i)
      }
      const start = () => { stop(); if (!reduce) timer = setInterval(() => show(i + 1), 2600) }
      const stop = () => clearInterval(timer)
      const st = ScrollTrigger.create({ trigger: stage.current, start: 'top 85%', end: 'bottom 15%', onToggle: (s) => (s.isActive ? start() : stop()) })
      const tap = () => { show(i + 1); start() }
      stage.current.addEventListener('click', tap)
      return () => { stop(); st.kill(); stage.current?.removeEventListener('click', tap); gsap.set(imgs, { autoAlpha: (k) => (k ? 0 : 1), scale: 1 }) }
    })

    // Pointer tilt on the browser window (desktop pointers only)
    if (finePointer() && !reduce) {
      const el = stage.current
      const rx = gsap.quickTo(el, 'rotateX', { duration: 0.8, ease: 'power3.out' })
      const ry = gsap.quickTo(el, 'rotateY', { duration: 0.8, ease: 'power3.out' })
      const move = (e) => {
        const r = el.getBoundingClientRect()
        ry(((e.clientX - r.left) / r.width - 0.5) * 10)
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8)
      }
      const leave = () => { rx(0); ry(0) }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); mm.revert() }
    }
    return () => mm.revert()
  }, { scope: root })

  return (
    <article ref={root} className="site grid gap-[clamp(24px,4vw,64px)] items-center py-[clamp(28px,4vw,48px)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:min-h-[calc(100vh-72px)]" aria-labelledby={'site-' + site.id}>
      <div className="grid gap-5 content-start">
        <span className="label">{String(index + 1).padStart(2, '0')} / {String(sites.length).padStart(2, '0')} · {site.kind}</span>
        <VarTitle as="h3" className="site-title" id={'site-' + site.id} text={site.name} radius={220} />
        <p className="m-0 text-ink-2 max-w-[52ch]">{site.desc}</p>
        <ul className="list-none m-0 p-0 border-t border-rule font-mono text-[13px]">
          {site.features.map((f) => <li key={f} className="py-2 border-b border-rule flex gap-3"><span className="text-signal" aria-hidden="true">+</span>{f}</li>)}
        </ul>
        <div className="tags flex flex-wrap gap-1.5">{site.tags.map((t) => <span key={t}>{t}</span>)}</div>
        <div><Magnetic className="btn go" href={site.url} target="_blank" rel="noopener" data-cursor="visit">Visit {site.domain.replace('.vercel.app', '')} <span className="arr" aria-hidden="true">↗</span></Magnetic></div>
      </div>

      <div className="site-stage-wrap relative">
        <div ref={stage} className="site-stage" data-cursor="tilt">
          <div ref={browser} className="browser">
            <div className="browser-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="url">{site.domain}</span>
              <span className="label hidden sm:inline">{frame + 1}/{n} · {site.frames[frame][1]}</span>
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
          {site.frames.map(([f, cap], i) => <span key={f} className={i <= frame ? 'on' : ''}><b />{cap}</span>)}
        </div>
      </div>
    </article>
  )
}

export default function LiveSites() {
  return (
    <section className="module" id="work" aria-labelledby="sites-title">
      <div className="wrap">
        <Strip><span className="name">Work</span><span>Live sites</span><span><b>{sites.length}</b> shipped</span><span className="end">Scroll to play through each site</span></Strip>
        <div className="module-head">
          <VarTitle id="sites-title" text="Live sites" />
          <p>Two websites that are out in the world. Scroll through each one here, or open the real thing.</p>
        </div>
        <div className="border-t border-rule">
          {sites.map((s, i) => <Site key={s.id} site={s} index={i} />)}
        </div>
      </div>
    </section>
  )
}
