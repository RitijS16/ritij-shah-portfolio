import { useEffect, useRef, useState } from 'react'
import { createWordSpace } from '../lib/wordspace'
import data from '../data/wordspace.json'
import Strip from '../components/Strip'
import VarTitle from '../components/VarTitle'

const sorted = [...data.words].sort()

export default function WordSpace() {
  const cv = useRef(null), api = useRef(null)
  const [sel, setSel] = useState(data.words.indexOf('king'))
  const [q, setQ] = useState('')
  const [msg, setMsg] = useState('')
  useEffect(() => {
    const ws = createWordSpace(cv.current, data, { onSelect: (i) => { setSel(i); setMsg('') } })
    api.current = ws
    return () => ws.destroy()
  }, [])
  const submit = (e) => {
    e.preventDefault()
    const v = q.trim().toLowerCase()
    if (!v) return
    if (api.current.find(v) < 0) setMsg(`“${v}” isn't one of the ${data.words.length} mapped words.`)
  }
  return (
    <section className="module" id="space" aria-labelledby="space-title">
      <div className="wrap">
        <Strip><span className="name">Playground</span><span><b>{data.words.length}</b> words in 3D</span><span className="end">Drag · click · search</span></Strip>
        <div className="module-head">
          <VarTitle id="space-title" text="Word space" />
          <p>Shakespeare’s vocabulary as a map: words used alike sit together.</p>
        </div>
      </div>
      <div className="ws relative grid md:block md:h-[clamp(420px,62vh,620px)] border-y border-rule">
        <canvas ref={cv} data-cursor="spin" className="order-1 relative h-[52vh] min-h-[340px] w-full block md:absolute md:inset-0 md:h-full" role="img" aria-label="A rotating 3D cloud of words. The selected word is joined by lines to its nearest neighbours, listed in the panel." />
        <div className="wrap order-2 relative flex flex-col items-stretch gap-4 py-4 md:absolute md:inset-0 md:flex-row md:justify-between md:items-start md:py-[18px] md:pointer-events-none [&>*]:pointer-events-auto">
          <form className="flex gap-2 items-end w-full md:w-[320px]" onSubmit={submit}>
            <div className="field">
              <label className="label" htmlFor="ws-q">Find a word</label>
              <input id="ws-q" type="search" list="ws-words" placeholder="king, night, love…" autoComplete="off" spellCheck="false" value={q} onChange={(e) => setQ(e.target.value)} className="!bg-panel" />
              <datalist id="ws-words">{sorted.map((w) => <option key={w} value={w} />)}</datalist>
            </div>
            <button className="btn" type="submit">Go</button>
          </form>
          <div className="w-full md:w-[300px] bg-panel border border-rule rounded-[10px] px-4 pt-4 pb-3" aria-live="polite">
            <span className="label">Selected</span>
            <h3 className="mt-1 mb-0.5 font-display font-bold text-[34px] leading-none tracking-[-0.01em] break-words">{data.words[sel]}</h3>
            <p className="mt-0 mb-3 font-mono text-xs text-ink-3">{data.count[sel].toLocaleString('en-US')} uses · neighbours</p>
            <ul className="list-none m-0 p-0 grid gap-0.5">
              {data.nn[sel].slice(0, 6).map((j, k) => {
                const v = Math.max(0, data.sim[sel][k])
                return (
                  <li key={j}>
                    <button type="button" onClick={() => api.current.select(j)} className="w-full grid grid-cols-[minmax(0,1fr)_70px_4ch] gap-2.5 items-center border-0 bg-transparent px-1.5 py-[7px] rounded-[5px] text-left font-mono text-sm hover:bg-steel">
                      <span>{data.words[j]}</span>
                      <span className="h-1 bg-rule rounded-sm overflow-hidden"><i className="block h-full bg-signal" style={{ width: (v * 100).toFixed(0) + '%' }} /></span>
                      <span className="text-xs text-ink-3 text-right tabular-nums">{v.toFixed(2)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className="mt-2 mb-0 font-mono text-xs text-ink-2 min-h-[1.4em]">{msg}</p>
          </div>
        </div>
      </div>
      <div className="wrap">
        <p className="fine pt-3">Co-occurrence embeddings (PPMI + SVD), not the LSTM’s weights.</p>
      </div>
    </section>
  )
}
