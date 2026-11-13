// Line-drawn face that blends four expressions by how close the pointer is to each corner.
import { gsap } from './gsap'
import { clamp, reduceMotion, tok, onTheme } from './env'

export const EMOTIONS = ['Happy', 'Angry', 'Sad', 'Neutral']
const CORNERS = [[1, 0], [0, 0], [0, 1], [1, 1]]
const SHAPES = [
  { mouth: 1, open: 0.35, brow: -0.15, browY: 0.12, eye: 0.62 },
  { mouth: -0.45, open: 0.12, brow: 1, browY: -0.18, eye: 0.85 },
  { mouth: -0.9, open: 0, brow: -0.8, browY: 0.1, eye: 0.7 },
  { mouth: 0.02, open: 0, brow: 0, browY: 0, eye: 1 },
]

export function weights(x, y) {
  const w = CORNERS.map(([cx, cy]) => 1 / Math.pow((x - cx) ** 2 + (y - cy) ** 2 + 0.02, 1.6))
  const s = w.reduce((a, b) => a + b, 0)
  return w.map((v) => v / s)
}

export function createFace(cv, { onMix } = {}) {
  const g = cv.getContext('2d')
  const reduce = reduceMotion()
  const ptr = { x: 0.78, y: 0.22 }
  const cur = { ...SHAPES[0] }
  let user = false, visible = false, running = false, t = 0
  const qx = gsap.quickTo(ptr, 'x', { duration: 0.5, ease: 'power3.out', onUpdate: () => kick() })
  const qy = gsap.quickTo(ptr, 'y', { duration: 0.5, ease: 'power3.out' })

  function drawFace() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), S = cv.clientWidth
    if (!S) return
    if (cv.width !== Math.round(S * dpr)) cv.width = cv.height = Math.round(S * dpr)
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, S, S)
    const ink = tok('--ink'), ink3 = tok('--ink-3'), sig = tok('--signal')
    g.font = '500 10px "IBM Plex Mono", monospace'; g.fillStyle = ink3
    g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText('ANGRY', 10, 10)
    g.textAlign = 'right'; g.fillText('HAPPY', S - 10, 10)
    g.textBaseline = 'bottom'; g.fillText('NEUTRAL', S - 10, S - 10)
    g.textAlign = 'left'; g.fillText('SAD', 10, S - 10)
    const cx = S / 2, cy = S / 2 + S * 0.02, R = S * 0.3, c = cur
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = ink; g.lineWidth = Math.max(2, S * 0.008)
    g.beginPath(); g.ellipse(cx, cy, R * 0.92, R, 0, 0, Math.PI * 2); g.stroke()
    const lookX = (ptr.x - 0.5) * 2, lookY = (ptr.y - 0.5) * 2
    for (const side of [-1, 1]) {
      const ex = cx + side * R * 0.36, ey = cy - R * 0.14, eh = R * 0.13 * c.eye
      g.beginPath(); g.ellipse(ex, ey, R * 0.15, Math.max(1, eh), 0, 0, Math.PI * 2); g.stroke()
      g.fillStyle = ink; g.beginPath(); g.arc(ex + lookX * R * 0.06, ey + lookY * eh * 0.4, R * 0.055, 0, Math.PI * 2); g.fill()
      const by = ey - R * (0.26 + c.browY * 0.5), innerY = by + c.brow * R * 0.12, outerY = by - c.brow * R * 0.06
      g.beginPath(); g.moveTo(ex + side * R * 0.2, outerY); g.lineTo(ex - side * R * 0.04, innerY); g.stroke()
    }
    const my = cy + R * 0.42, mw = R * 0.42, curve = c.mouth * R * 0.24
    g.beginPath(); g.moveTo(cx - mw, my - curve * 0.25); g.quadraticCurveTo(cx, my + curve, cx + mw, my - curve * 0.25)
    if (c.open > 0.05) { g.quadraticCurveTo(cx, my + curve * (1 - c.open * 1.6) - c.open * R * 0.05, cx - mw, my - curve * 0.25); g.fillStyle = sig; g.fill() }
    g.stroke()
    g.strokeStyle = sig; g.lineWidth = 1.5; g.beginPath(); g.arc(ptr.x * S, ptr.y * S, 7, 0, Math.PI * 2); g.stroke()
  }
  function tick(_time, deltaMs) {
    t += deltaMs / 1000
    if (!user && !reduce) { ptr.x = 0.5 + 0.38 * Math.cos(t * 0.45); ptr.y = 0.5 + 0.36 * Math.sin(t * 0.62) }
    const w = weights(ptr.x, ptr.y)
    let settled = true
    for (const k in cur) {
      const target = SHAPES.reduce((a, s, i) => a + s[k] * w[i], 0)
      cur[k] += (target - cur[k]) * 0.2
      if (Math.abs(target - cur[k]) > 0.001) settled = false
    }
    drawFace()
    onMix?.(w)
    if (!visible || document.hidden || (user && settled && !gsap.isTweening(ptr))) { running = false; gsap.ticker.remove(tick) }
  }
  function kick() { if (!running && visible) { running = true; gsap.ticker.add(tick) } }
  function setFrom(e) {
    const r = cv.getBoundingClientRect()
    user = true
    qx(clamp((e.clientX - r.left) / r.width, 0, 1)); qy(clamp((e.clientY - r.top) / r.height, 0, 1))
    kick()
  }
  const onMove = (e) => { if (e.pointerType === 'mouse' || e.buttons) setFrom(e) }
  const onDown = (e) => { cv.setPointerCapture(e.pointerId); setFrom(e) }
  const onKey = (e) => {
    const k = { ArrowLeft: [-0.08, 0], ArrowRight: [0.08, 0], ArrowUp: [0, -0.08], ArrowDown: [0, 0.08] }[e.key]
    if (!k) return
    e.preventDefault(); user = true
    qx(clamp(ptr.x + k[0], 0, 1)); qy(clamp(ptr.y + k[1], 0, 1)); kick()
  }
  cv.addEventListener('pointermove', onMove)
  cv.addEventListener('pointerdown', onDown)
  cv.addEventListener('keydown', onKey)
  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick() }, { threshold: 0.05 })
  io.observe(cv)
  const ro = new ResizeObserver(() => { drawFace(); onMix?.(weights(ptr.x, ptr.y)) })
  ro.observe(cv)
  const offTheme = onTheme(drawFace)
  return {
    destroy() {
      gsap.ticker.remove(tick); io.disconnect(); ro.disconnect(); offTheme()
      cv.removeEventListener('pointermove', onMove); cv.removeEventListener('pointerdown', onDown); cv.removeEventListener('keydown', onKey)
    },
  }
}
