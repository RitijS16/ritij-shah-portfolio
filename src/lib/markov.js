// Word-pair model with temperature sampling, built from the same Shakespeare text the LSTM used.
export function buildModel(text) {
  const W = text.split(' ')
  const uni = new Map(), bi = new Map()
  const add = (m, k, w) => { let x = m.get(k); if (!x) { x = new Map(); m.set(k, x) } x.set(w, (x.get(w) || 0) + 1) }
  for (let i = 0; i < W.length - 1; i++) {
    add(uni, W[i], W[i + 1])
    if (i > 0) add(bi, W[i - 1] + ' ' + W[i], W[i + 1])
  }
  return { uni, bi, words: W.length, vocab: uni.size }
}

export function nextOdds(model, ctx, t) {
  const a = ctx.slice(-2)
  let m = a.length === 2 ? model.bi.get(a.join(' ')) : null
  let from = 'last two words'
  if (!m || m.size < 2) { m = model.uni.get(a[a.length - 1]); from = 'last word' }
  if (!m) return null
  const e = [...m]
  const ws = e.map(([, c]) => Math.pow(c, 1 / t))
  const z = ws.reduce((x, y) => x + y, 0)
  return { from, list: e.map(([w], i) => [w, ws[i] / z]).sort((x, y) => y[1] - x[1]) }
}

export function sample(list) {
  let r = Math.random(), acc = 0
  for (const [w, p] of list) { acc += p; if (r <= acc) return w }
  return list[list.length - 1][0]
}

export const clean = (s) => s.toLowerCase().replace(/[’']/g, ' ').replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean)
