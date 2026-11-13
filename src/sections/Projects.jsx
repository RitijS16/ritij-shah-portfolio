import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { onTheme, reduceMotion, tok } from '../lib/env'
import { createFace, EMOTIONS } from '../lib/face'
import { projects } from '../data/resume'
import Strip from '../components/Strip'
import VarTitle from '../components/VarTitle'

const inr = (x) => '₹' + Math.round(x).toLocaleString('en-IN')

function Tween({ value, format }) {
  const ref = useRef(null), state = useRef({ v: value })
  useEffect(() => {
    gsap.to(state.current, {
      v: value, duration: reduceMotion() ? 0 : 0.7, ease: 'power3.out', overwrite: true,
      onUpdate: () => { if (ref.current) ref.current.textContent = format(state.current.v) },
    })
  }, [value, format])
  return <b className="num" ref={ref}>{format(value)}</b>
}

function Slider({ id, label, value, min, max, step, onChange, show }) {
  return (
    <div className="grid gap-1">
      <div className="sl-head"><label className="label" htmlFor={id}>{label}</label><output htmlFor={id}>{show(value)}</output></div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} data-cursor="drag"
        style={{ '--fill': ((value - min) / (max - min)) * 100 + '%' }} onChange={(e) => onChange(+e.target.value)} />
    </div>
  )
}

function EmiToy() {
  const [amt, setAmt] = useState(500000), [rate, setRate] = useState(10.5), [ten, setTen] = useState(36)
  const cv = useRef(null)
  const { emi, rows, cross } = useMemo(() => {
    const r = rate / 1200, f = Math.pow(1 + r, ten)
    const e = r ? (amt * r * f) / (f - 1) : amt / ten
    const rows = []; let bal = amt, cross = 0
    for (let k = 0; k < ten; k++) { const i = bal * r, pr = e - i; bal -= pr; rows.push([pr, i]); if (!cross && pr >= i) cross = k + 1 }
    return { emi: e, rows, cross }
  }, [amt, rate, ten])

  useEffect(() => {
    const c = cv.current, g = c.getContext('2d')
    const draw = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2), w = c.clientWidth, h = c.clientHeight
      if (!w) return
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr)
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h)
      const n = rows.length, gap = n > 48 ? 0.5 : 1.5, bw = (w - gap * (n - 1)) / n, top = 8, bottom = h - 18
      const ink3 = tok('--ink-3'), sig = tok('--signal'), ink2 = tok('--ink-2')
      rows.forEach(([pr, i], k) => {
        const x = k * (bw + gap), hp = ((bottom - top) * pr) / (pr + i), hi = ((bottom - top) * i) / (pr + i)
        g.fillStyle = ink3; g.fillRect(x, bottom - hp, bw, hp)
        g.fillStyle = sig; g.fillRect(x, bottom - hp - hi, bw, hi)
      })
      g.fillStyle = ink2; g.font = '400 11px "IBM Plex Mono", monospace'
      g.textAlign = 'left'; g.fillText('Month 1', 0, h - 3)
      g.textAlign = 'right'; g.fillText('Month ' + n, w, h - 3)
    }
    draw()
    const ro = new ResizeObserver(draw); ro.observe(c)
    const off = onTheme(draw)
    return () => { ro.disconnect(); off() }
  }, [rows])

  return (
    <div className="grid gap-5 sm:grid-cols-2" aria-label="EMI calculator">
      <div className="grid gap-3 content-start">
        <Slider id="emi-amt" label="Loan" value={amt} min={50000} max={5000000} step={10000} onChange={setAmt} show={inr} />
        <Slider id="emi-rate" label="Rate" value={rate} min={6} max={24} step={0.1} onChange={setRate} show={(v) => v.toFixed(1) + '%'} />
        <Slider id="emi-ten" label="Months" value={ten} min={6} max={84} step={1} onChange={setTen} show={(v) => String(v)} />
      </div>
      <div className="grid gap-3 content-start">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div className="grid gap-1 [&_b]:text-signal"><span className="label">EMI / month</span><Tween value={emi} format={inr} /></div>
          <div className="grid gap-1"><span className="label">Interest</span><Tween value={emi * ten - amt} format={inr} /></div>
        </div>
        <canvas ref={cv} className="w-full h-[110px] block" role="img" aria-label="Each month's EMI split into principal (grey) and interest (orange)" />
      </div>
    </div>
  )
}

function FaceToy() {
  const cv = useRef(null), list = useRef(null)
  useEffect(() => {
    const lis = [...list.current.children]
    const f = createFace(cv.current, {
      onMix: (w) => {
        const top = w.indexOf(Math.max(...w))
        lis.forEach((li, i) => {
          li.classList.toggle('pick', i === top)
          li.querySelector('.fill').style.width = (w[i] * 100).toFixed(1) + '%'
          li.querySelector('.pct').textContent = Math.round(w[i] * 100) + '%'
        })
      },
    })
    return () => f.destroy()
  }, [])
  return (
    <div className="grid gap-5 grid-cols-[minmax(0,180px)_minmax(0,1fr)] items-center">
      <canvas ref={cv} className="face" tabIndex={0} data-cursor="move" role="img" aria-label="A line-drawn face. Move the pointer toward a corner, or use the arrow keys, to blend in that expression." />
      <ul className="bars" ref={list} aria-label="Expression mix">
        {EMOTIONS.map((e) => (
          <li key={e}><span className="word">{e}</span><span className="track"><span className="fill" style={{ transition: 'none' }} /></span><span className="pct">0%</span></li>
        ))}
      </ul>
    </div>
  )
}

export default function Projects() {
  const root = useRef(null)
  useGSAP(() => {
    if (reduceMotion()) return
    gsap.from('.proj', { y: 50, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.proj', start: 'top 88%', once: true } })
  }, { scope: root })

  const spans = { finance: 'lg:col-span-7', emotion: 'lg:col-span-5', shap: 'lg:col-span-6', uber: 'lg:col-span-6' }
  return (
    <section className="module" id="projects" ref={root} aria-labelledby="projects-title">
      <div className="wrap">
        <Strip><span className="name">Projects</span><span>ML · vision · data</span><span className="end">Two are playable</span></Strip>
        <div className="module-head"><VarTitle id="projects-title" text="Projects" /></div>
        <div className="grid gap-[clamp(16px,1.6vw,24px)] lg:grid-cols-12">
          {projects.map((p) => (
            <article key={p.id} className={'proj card ' + spans[p.id]} aria-labelledby={'p-' + p.id}>
              <div className="proj-reveal flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0"><span className="label">{p.kind}</span><h3 id={'p-' + p.id}>{p.title}</h3></div>
                <div className="tags flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
              </div>
              <p className="proj-reveal m-0 text-ink-2 max-w-[52ch]">{p.desc}</p>
              {p.toy === 'emi' && <EmiToy />}
              {p.toy === 'face' && <FaceToy />}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
