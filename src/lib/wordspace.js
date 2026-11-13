// Word cloud in 3D, projected by hand onto a 2D canvas so the text stays crisp.
import { gsap } from './gsap'
import { clamp, reduceMotion, tok, onTheme } from './env'

export function createWordSpace(cv, data, { onSelect, initial = 'king' } = {}) {
  const g = cv.getContext('2d')
  const reduce = reduceMotion()
  const n = data.words.length
  const rmax = Math.max(...data.pos.map((p) => Math.hypot(p[0], p[1], p[2])))
  const pos = data.pos.map((p) => {
    const r = Math.hypot(p[0], p[1], p[2]) || 1e-3
    const k = Math.pow(r / rmax, -0.38)
    return [p[0] * k, p[1] * k, p[2] * k]
  })
  const index = new Map(data.words.map((w, i) => [w, i]))
  const maxLog = Math.log(Math.max(...data.count))
  const P = new Float32Array(n * 4)
  const order = [...Array(n).keys()]
  const view = { yaw: -0.5, pitch: 0.22 }
  let W = 0, H = 0, dpr = 1, vyaw = 0, vpitch = 0, sel = index.get(initial) ?? 0, hover = -1, colors = {}
  let flying = null, lastAct = 0, drag = null

  const readColors = () => { colors = { ink: tok('--ink'), ink2: tok('--ink-2'), ink3: tok('--ink-3'), sig: tok('--signal'), steel: tok('--steel') }; wake() }
  function size() {
    const r = cv.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = r.width; H = r.height
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
    wake()
  }
  const narrow = () => W < 760
  function project() {
    const cy = Math.cos(view.yaw), sy = Math.sin(view.yaw), cp = Math.cos(view.pitch), sp = Math.sin(view.pitch)
    const D = 4.6, U = Math.min(W * (narrow() ? 0.36 : 0.26), H * 0.34)
    const cx = narrow() ? W / 2 : W * 0.47, cyy = H / 2
    for (let i = 0; i < n; i++) {
      const p = pos[i]
      const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy
      const y2 = p[1] * cp - z1 * sp, z2 = p[1] * sp + z1 * cp
      const s = D / (D - z2)
      P[i * 4] = cx + x1 * s * U; P[i * 4 + 1] = cyy - y2 * s * U; P[i * 4 + 2] = z2; P[i * 4 + 3] = s
    }
  }
  function label(text, x, y, fg, bg, border) {
    const w = g.measureText(text).width + 12, h = parseFloat(g.font.split(' ')[1]) + 9
    g.fillStyle = bg; g.strokeStyle = border; g.lineWidth = 1
    g.beginPath()
    if (g.roundRect) g.roundRect(x - w / 2, y - h / 2, w, h, 4)
    else g.rect(x - w / 2, y - h / 2, w, h)
    g.fill(); g.stroke()
    g.fillStyle = fg; g.fillText(text, x, y + 0.5)
  }
  function draw() {
    if (!W) return
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, W, H)
    project()
    order.sort((a, b) => P[a * 4 + 2] - P[b * 4 + 2])
    const nn = new Set(data.nn[sel].slice(0, 6))
    const sx = P[sel * 4], sy = P[sel * 4 + 1]
    g.lineWidth = 1; g.strokeStyle = colors.sig; g.globalAlpha = 0.75
    for (const j of nn) { g.beginPath(); g.moveTo(sx, sy); g.lineTo(P[j * 4], P[j * 4 + 1]); g.stroke() }
    g.globalAlpha = 1
    g.textAlign = 'center'; g.textBaseline = 'middle'
    for (const i of order) {
      if (i === sel || nn.has(i)) continue
      const z = P[i * 4 + 2], s = P[i * 4 + 3]
      const depth = clamp((z + 1.7) / 3.4, 0, 1)
      const f = Math.log(data.count[i]) / maxLog
      g.globalAlpha = i === hover ? 1 : 0.14 + 0.72 * depth * depth
      g.fillStyle = i === hover ? colors.ink : depth > 0.55 ? colors.ink2 : colors.ink3
      g.font = `${i === hover ? 600 : 400} ${((10 + 6 * f) * s).toFixed(1)}px "IBM Plex Mono", ui-monospace, monospace`
      g.fillText(data.words[i], P[i * 4], P[i * 4 + 1])
    }
    g.globalAlpha = 1
    for (const j of nn) {
      g.font = `600 ${(13 * P[j * 4 + 3]).toFixed(1)}px "IBM Plex Mono", ui-monospace, monospace`
      label(data.words[j], P[j * 4], P[j * 4 + 1], colors.ink, colors.steel, colors.sig)
    }
    g.font = `700 ${(17 * P[sel * 4 + 3]).toFixed(1)}px "IBM Plex Mono", ui-monospace, monospace`
    label(data.words[sel], sx, sy, colors.steel, colors.sig, colors.sig)
  }

  function select(i, rotate = true) {
    if (i == null || i < 0) return
    sel = i
    onSelect?.(i)
    if (rotate) {
      const p = pos[i]
      let ty = Math.atan2(-p[0], p[2])
      const tp = clamp(Math.atan2(p[1], Math.hypot(p[0], p[2])), -1.1, 1.1)
      while (ty - view.yaw > Math.PI) ty -= 2 * Math.PI
      while (ty - view.yaw < -Math.PI) ty += 2 * Math.PI
      vyaw = vpitch = 0
      flying?.kill()
      flying = gsap.to(view, { yaw: ty, pitch: tp, duration: reduce ? 0 : 1.1, ease: 'power3.inOut', onUpdate: wake, onComplete: () => { flying = null; lastAct = performance.now() } })
    }
    wake()
  }
  function find(q) {
    q = q.trim().toLowerCase()
    if (!q) return -1
    let i = index.get(q)
    if (i == null) i = data.words.findIndex((w) => w.startsWith(q))
    if (i >= 0) select(i)
    return i
  }

  const onDown = (e) => {
    drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false, type: e.pointerType }
    if (e.pointerType === 'mouse') cv.setPointerCapture(e.pointerId)
    flying?.kill(); flying = null
    cv.classList.add('dragging')
  }
  const onMove = (e) => {
    const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y
      drag.x = e.clientX; drag.y = e.clientY
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 5) drag.moved = true
      view.yaw += dx * 0.007; vyaw = dx * 0.007
      if (drag.type === 'mouse') { view.pitch = clamp(view.pitch + dy * 0.006, -1.2, 1.2); vpitch = dy * 0.006 }
      lastAct = performance.now(); wake()
      return
    }
    let best = -1, bd = 18 * 18
    for (let i = 0; i < n; i++) {
      const dx = P[i * 4] - mx, dy = P[i * 4 + 1] - my, d = dx * dx + dy * dy
      if (d < bd && P[i * 4 + 2] > -1.4) { bd = d; best = i }
    }
    if (best !== hover) { hover = best; cv.setAttribute('data-cursor', best >= 0 ? 'select' : 'spin'); wake() }
  }
  const onUp = () => {
    if (!drag) return
    if (!drag.moved && hover >= 0) select(hover)
    drag = null; cv.classList.remove('dragging'); lastAct = performance.now(); wake()
  }
  const onCancel = () => { drag = null; cv.classList.remove('dragging') }
  const onLeave = () => { if (!drag && hover !== -1) { hover = -1; wake() } }
  cv.addEventListener('pointerdown', onDown)
  cv.addEventListener('pointermove', onMove)
  cv.addEventListener('pointerup', onUp)
  cv.addEventListener('pointercancel', onCancel)
  cv.addEventListener('pointerleave', onLeave)

  let running = false, onScreen = false, wakeUntil = 0
  function wake() {
    wakeUntil = performance.now() + 400
    if (!running && onScreen && !document.hidden) { running = true; gsap.ticker.add(tick) }
  }
  function tick(_t, deltaMs) {
    const now = performance.now(), dt = Math.min(0.05, deltaMs / 1000)
    let moving = !!flying
    if (!flying && !drag) {
      if (Math.abs(vyaw) + Math.abs(vpitch) > 0.0004) {
        view.yaw += vyaw; view.pitch = clamp(view.pitch + vpitch, -1.2, 1.2); vyaw *= 0.92; vpitch *= 0.92; moving = true
      } else if (!reduce && now - lastAct > 2500) { view.yaw += dt * 0.07; moving = true }
    }
    draw()
    if (!onScreen || document.hidden || !(moving || drag || now < wakeUntil)) { running = false; gsap.ticker.remove(tick) }
  }
  const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; if (onScreen) wake() }, { threshold: 0.02 })
  io.observe(cv)
  const ro = new ResizeObserver(size)
  ro.observe(cv)
  const offTheme = onTheme(readColors)
  readColors(); size(); select(sel, false); draw()

  return {
    select, find, index,
    destroy() {
      gsap.ticker.remove(tick); flying?.kill()
      io.disconnect(); ro.disconnect(); offTheme()
      cv.removeEventListener('pointerdown', onDown); cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerup', onUp); cv.removeEventListener('pointercancel', onCancel); cv.removeEventListener('pointerleave', onLeave)
    },
  }
}
