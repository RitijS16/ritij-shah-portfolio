import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { reduceMotion } from '../lib/env'
import { buildModel, clean, nextOdds, sample } from '../lib/markov'
import { lstm } from '../data/resume'
import Strip from '../components/Strip'
import VarTitle from '../components/VarTitle'
import Magnetic from '../components/Magnetic'

const describe = (t) => {
  if (t < 0.45) return 'Cautious. It takes the likeliest word nearly every time, so it starts repeating itself.'
  if (t <= 1.2) return Math.abs(t - 0.8) < 0.001 ? 'Balanced. 0.8 is what the original script uses.' : 'Balanced. Likely words win most of the time, with some surprises.'
  return 'Reckless. Rare words get a real chance, and the text drifts into nonsense.'
}
const SAMPLE = 'a soul of the unworthy a maid never doubt till that time of night together had quiet'.split(' ').map((w) => ({ w, hot: false }))

export default function TextGenerator() {
  const root = useRef(null), model = useRef(null), runId = useRef(0)
  const [seed, setSeed] = useState(lstm.seeds[0])
  const [temp, setTemp] = useState(0.8)
  const [shownSeed, setShownSeed] = useState(lstm.seeds[0])
  const [words, setWords] = useState(SAMPLE)
  const [odds, setOdds] = useState(null)
  const [status, setStatus] = useState('Sonnets + Hamlet')
  const [note, setNote] = useState('')
  const [ready, setReady] = useState(false)

  async function run(instant, seedText = seed) {
    const m = model.current
    if (!m) return
    const id = ++runId.current
    let ctx = clean(seedText)
    let msg = ''
    if (!ctx.length) ctx = clean(lstm.seeds[0])
    if (!m.uni.has(ctx[ctx.length - 1])) { msg = `“${ctx[ctx.length - 1]}” isn't in the text, so it starts from “the”. `; ctx.push('the') }
    setNote(msg)
    setShownSeed(ctx.join(' '))
    setWords([])
    const out = []
    for (let k = 1; k <= 28; k++) {
      if (id !== runId.current) return
      const d = nextOdds(m, ctx, temp)
      if (!d) break
      const w = sample(d.list)
      ctx.push(w)
      out.push({ w, hot: d.list[0][0] !== w })
      const top = d.list.slice(0, 6)
      if (!top.some(([x]) => x === w)) { const c = d.list.find(([x]) => x === w); if (c) top[5] = c }
      if (!instant || k === 28) { setWords([...out]); setOdds({ step: k, from: d.from, top, pick: w }) }
      if (!instant && !reduceMotion()) await new Promise((r) => setTimeout(r, 75))
    }
    setWords([...out])
  }

  useEffect(() => {
    let alive = true
    fetch(`${import.meta.env.BASE_URL}data/corpus.txt`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.text() })
      .then((txt) => {
        if (!alive) return
        model.current = buildModel(txt)
        setStatus(`${model.current.words.toLocaleString('en-US')} words · ${model.current.vocab.toLocaleString('en-US')} unique`)
        setReady(true)
      })
      .catch(() => { setStatus('Corpus unavailable'); setNote('The text corpus could not be loaded, so the console is showing a saved sample.') })
    return () => { alive = false; runId.current++ }
  }, [])
  useEffect(() => { if (ready) run(true) }, [ready]) // eslint-disable-line react-hooks/exhaustive-deps

  useGSAP(() => {
    if (reduceMotion()) return
    gsap.from('.tg-about > *', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.tg-about', start: 'top 85%', once: true } })
    gsap.from('.console', { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.console', start: 'top 88%', once: true } })
  }, { scope: root })

  const fill = ((temp - 0.1) / 1.9) * 100
  return (
    <section className="module" id="lstm" ref={root} aria-labelledby="work-title">
      <div className="wrap">
        <Strip><span className="name">Lab</span><span>LSTM text generator</span><span>Python · TensorFlow · Keras</span><span className="end">Corpus <b>5.3 MB</b> of Shakespeare</span></Strip>
        <div className="module-head">
          <VarTitle id="work-title" text="Text generator" />
          <p>A word-level language model trained on the complete works of Shakespeare. It reads ten words and predicts the eleventh, then feeds its own guess back in to keep writing.</p>
        </div>
        <div className="grid gap-[clamp(28px,4vw,64px)] items-start pb-[clamp(56px,8vw,110px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="tg-about grid gap-6 content-start">
            <dl className="spec">
              {lstm.spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <p className="m-0 max-w-[52ch]">The interesting part is the last line. A model only gives you odds for the next word; temperature decides how boldly you sample from them. The console on the right lets you feel that difference.</p>
            <div><Magnetic className="btn" href={lstm.repo} target="_blank" rel="noopener" data-cursor="open">View the code <span className="arr" aria-hidden="true">↗</span></Magnetic></div>
          </div>

          <div className="console" aria-labelledby="console-title">
            <div className="console-top"><span className="label" id="console-title">Temperature console</span><span className="label">{status}</span></div>
            <div className="grid gap-5 p-[clamp(16px,2.4vw,26px)]">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Seed phrases from the original script">
                {lstm.seeds.map((s) => (
                  <button key={s} className="chip" type="button" aria-pressed={seed === s} onClick={() => { setSeed(s); run(false, s) }}>{s}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="field">
                  <label className="label" htmlFor="seed">Seed</label>
                  <input id="seed" type="text" value={seed} maxLength={80} autoComplete="off" spellCheck="false"
                    onChange={(e) => setSeed(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); run(false) } }} />
                </div>
                <Magnetic as="button" className="btn go" type="button" data-cursor="write" disabled={!ready} onClick={() => run(false)}>Generate</Magnetic>
              </div>
              <div className="grid gap-2">
                <div className="temp-head"><label className="label" htmlFor="temp">Temperature</label><output htmlFor="temp">{temp.toFixed(2)}</output></div>
                <input id="temp" type="range" min="0.1" max="2" step="0.05" value={temp} data-cursor="drag" style={{ '--fill': fill + '%' }} onChange={(e) => setTemp(+e.target.value)} />
                <p className="m-0 text-[13px] text-ink-2 min-h-[2.6em]">{note}{describe(+temp.toFixed(2))}</p>
              </div>
              <p className="gen" aria-live="polite">
                <span className="seed">{shownSeed}</span>
                {words.map((x, i) => <span key={i} className={'w' + (x.hot ? ' hot' : '')}>{' ' + x.w}</span>)}
              </p>
              <div>
                <div className="temp-head mb-2.5"><span className="label">Odds for the last word</span><span className="label">{odds ? `word ${odds.step} · from ${odds.from}` : ''}</span></div>
                <ol className="bars" aria-label="Probability of the most likely next words">
                  {odds?.top.map(([w, p]) => (
                    <li key={w} className={w === odds.pick ? 'pick' : ''}>
                      <span className="word">{w}</span>
                      <span className="track"><span className="fill" style={{ width: (p * 100).toFixed(1) + '%' }} /></span>
                      <span className="pct">{(p * 100).toFixed(p < 0.1 ? 1 : 0)}%</span>
                    </li>
                  ))}
                </ol>
              </div>
              <p className="fine">This console runs a word-pair model built in your browser from the Sonnets and Hamlet. The trained LSTM isn't loaded here; the console shows how temperature reshapes the odds it would hand you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
