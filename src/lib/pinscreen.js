// 3D pin-art wall. Each pin is an instance of one cylinder; only its z translation changes,
// so a frame is a single typed-array pass plus one draw call (and one shadow pass on desktop).
import * as THREE from 'three'
import { gsap } from './gsap'
import { clamp, reduceMotion, tok, onTheme } from './env'

export function createPinscreen(host, { word = 'RITIJ', onCount } = {}) {
  let gl = false
  try {
    const c = document.createElement('canvas')
    gl = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { /* no webgl */ }
  if (!gl) {
    host.classList.add('off')
    return { setWord() {}, destroy() { host.classList.remove('off') } }
  }

  const reduce = reduceMotion()
  const W0 = host.clientWidth, H0 = host.clientHeight
  const small = W0 < 760
  const aspect0 = clamp(W0 / Math.max(1, H0), 0.4, 3)
  const COLS = small ? 34 : 92
  const ROWS = Math.ceil((COLS / aspect0) * 1.25) + 6
  const N = COLS * ROWS
  const LEN = 7, RAD = 0.45, LH = 3.1, REST = 0.14, K = 85, C = 10
  onCount?.(N)

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 2 : 1.6))
  const shadows = !small
  renderer.shadowMap.enabled = shadows
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, W0 / H0, 1, 2000)
  const geo = new THREE.CylinderGeometry(RAD, RAD, LEN, small ? 10 : 14, 1)
  geo.rotateX(Math.PI / 2)
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.34, metalness: 0.4 })
  const mesh = new THREE.InstancedMesh(geo, mat, N)
  mesh.castShadow = shadows
  mesh.receiveShadow = shadows
  mesh.frustumCulled = false

  const gx = new Float32Array(N), gy = new Float32Array(N), z = new Float32Array(N), v = new Float32Array(N)
  const base = new Float32Array(N), next = new Float32Array(N), switchAt = new Float32Array(N), paint = new Float32Array(N)
  const tm = new THREE.Matrix4(), white = new THREE.Color(1, 1, 1)
  for (let r = 0, i = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++, i++) {
    gx[i] = c; gy[i] = r; z[i] = REST
    tm.makeTranslation(c - (COLS - 1) / 2, (ROWS - 1) / 2 - r, REST - LEN / 2)
    mesh.setMatrixAt(i, tm)
    mesh.setColorAt(i, white)
  }
  scene.add(mesh)

  const plateMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const plateGeo = new THREE.PlaneGeometry(COLS * 4, ROWS * 4)
  scene.add(new THREE.Mesh(plateGeo, plateMat))
  const shadeMat = new THREE.ShadowMaterial({ opacity: 0.2 })
  const shade = new THREE.Mesh(plateGeo, shadeMat)
  shade.position.z = 0.02
  shade.receiveShadow = shadows
  scene.add(shade)

  const hemi = new THREE.HemisphereLight(0xffffff, 0x9aa1ab, 0.72 * Math.PI)
  scene.add(hemi)
  const sun = new THREE.DirectionalLight(0xffffff, 0.95 * Math.PI)
  sun.position.set(-COLS * 0.45, ROWS * 0.7, 70)
  sun.castShadow = shadows
  if (shadows) {
    sun.shadow.mapSize.set(2048, 2048)
    const sc = sun.shadow.camera, half = Math.max(COLS, ROWS) * 0.72
    Object.assign(sc, { left: -half, right: half, top: half, bottom: -half, near: 1, far: 400 })
    sun.shadow.bias = -0.0006
  }
  scene.add(sun, sun.target)

  const pinC = new THREE.Color(), sigC = new THREE.Color(), clear = new THREE.Color()
  function readTheme() {
    pinC.set(tok('--pin') || '#d2d6dc')
    sigC.set(tok('--signal') || '#ff5a1f')
    const plateHex = tok('--plate') || '#e7e9ec'
    plateMat.color.set(plateHex)
    clear.set(plateHex)
    renderer.setClearColor(clear, 1)
    const dark = plateMat.color.r + plateMat.color.g + plateMat.color.b < 0.3
    shadeMat.opacity = dark ? 0.55 : 0.2
    hemi.intensity = (dark ? 0.55 : 0.72) * Math.PI
    sun.intensity = (dark ? 1.15 : 0.95) * Math.PI
    wake()
  }

  let dist = 100, visRows = ROWS
  const TILT = 0.34
  function resize() {
    const w = host.clientWidth, h = host.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    dist = (COLS * 0.9) / (2 * Math.tan(THREE.MathUtils.degToRad(15)) * camera.aspect)
    visRows = (COLS * 0.9) / camera.aspect
    camera.updateProjectionMatrix()
    wake()
  }

  function field(str) {
    const cv = document.createElement('canvas')
    cv.width = COLS; cv.height = ROWS
    const g = cv.getContext('2d', { willReadFrequently: true })
    const out = new Float32Array(N)
    if (!str) return out
    const maxW = COLS * 0.86
    let size = visRows * (small ? 0.3 : 0.42)
    const font = (s) => `800 ${s}px Archivo, "Arial Black", Arial, sans-serif`
    g.font = font(size)
    const w = g.measureText(str).width
    if (w > maxW) { size *= maxW / w; g.font = font(size) }
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'
    g.fillText(str, COLS / 2, ROWS / 2 - visRows * (small ? 0.22 : 0.15))
    const d = g.getImageData(0, 0, COLS, ROWS).data
    for (let i = 0; i < N; i++) out[i] = d[i * 4 + 3] / 255
    return out
  }

  let T = 0, lastInput = -10
  function setWord(str, instant) {
    const f = field(str)
    for (let i = 0; i < N; i++) {
      next[i] = f[i]
      switchAt[i] = instant || reduce ? T + 1e-4 : T + 0.03 + gx[i] * 0.011 + Math.random() * 0.06
    }
    lastInput = T
    wake()
  }

  // pointer → grid coordinates
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2()
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.2), hit = new THREE.Vector3()
  let pIn = false, pDown = false, hx = -99, hy = -99, tx = -99, ty = -99, hov = 0
  let camX = 0, camY = 0, camTX = 0, camTY = 0
  const waves = []
  function toGrid(e) {
    const r = host.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    camTX = ndc.x; camTY = ndc.y
    ray.setFromCamera(ndc, camera)
    if (!ray.ray.intersectPlane(plane, hit)) return false
    tx = hit.x + (COLS - 1) / 2
    ty = (ROWS - 1) / 2 - hit.y
    return true
  }
  function stamp(cx, cy, rad, amt) {
    const r2 = rad * rad
    const c0 = Math.max(0, Math.floor(cx - rad)), c1 = Math.min(COLS - 1, Math.ceil(cx + rad))
    const r0 = Math.max(0, Math.floor(cy - rad)), r1 = Math.min(ROWS - 1, Math.ceil(cy + rad))
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
      const dx = c - cx, dy = r - cy, d2 = dx * dx + dy * dy
      if (d2 >= r2) continue
      const f = 1 - d2 / r2, i = r * COLS + c
      paint[i] = Math.max(paint[i], amt * f * f)
    }
  }
  const onMove = (e) => {
    if (!toGrid(e)) return
    pIn = e.pointerType === 'mouse' || pDown
    if (pDown) stamp(tx, ty, small ? 2.6 : 3.2, 2.7)
    lastInput = T
    wake()
  }
  const onEnter = (e) => { if (e.pointerType === 'mouse') { pIn = true; if (toGrid(e)) { hx = tx; hy = ty } } }
  const onLeave = () => { pIn = false; pDown = false; camTX = 0; camTY = 0 }
  const onDown = (e) => {
    if (!toGrid(e)) return
    pDown = true
    if (e.pointerType !== 'mouse') { hx = tx; hy = ty }
    waves.push({ x: tx, y: ty, t: T })
    if (waves.length > 6) waves.shift()
    stamp(tx, ty, small ? 2.6 : 3.2, 2.7)
    lastInput = T
    wake()
  }
  const onUp = () => { pDown = false }
  const onCancel = () => { pDown = false; pIn = false }
  host.addEventListener('pointermove', onMove, { passive: true })
  host.addEventListener('pointerenter', onEnter)
  host.addEventListener('pointerleave', onLeave)
  host.addEventListener('pointerdown', onDown)
  host.addEventListener('pointercancel', onCancel)
  window.addEventListener('pointerup', onUp)

  // frame loop on gsap.ticker; sleeps when the wall is still or off-screen
  let running = false, onScreen = true, idleUntil = 0
  const arr = mesh.instanceMatrix.array
  function wake() {
    idleUntil = T + 6
    if (!running && onScreen && !document.hidden) { running = true; gsap.ticker.add(tick) }
  }
  function sleep() { running = false; gsap.ticker.remove(tick) }
  function tick(_time, deltaMs) {
    const dt = Math.min(0.033, Math.max(0.001, deltaMs / 1000))
    T += dt
    hov += ((pIn ? 1 : 0) - hov) * Math.min(1, dt * 7)
    if (hx < -50) { hx = tx; hy = ty }
    hx += (tx - hx) * Math.min(1, dt * 16)
    hy += (ty - hy) * Math.min(1, dt * 16)
    const quiet = T - lastInput
    const idleAmp = reduce ? 0 : clamp((quiet - 2.5) * 0.4, 0, 1) * 0.17
    for (let k = waves.length - 1; k >= 0; k--) if (T - waves[k].t > 3) waves.splice(k, 1)
    const HR = small ? 3.6 : 5.2, HR2 = HR * HR, HOV = 1.5 * hov
    const decay = Math.pow(0.5, dt / 1.3)
    const carr = mesh.instanceColor.array
    let energy = 0
    for (let i = 0; i < N; i++) {
      if (switchAt[i] && T >= switchAt[i]) { base[i] = next[i]; switchAt[i] = 0 }
      let tgt = REST + base[i] * LH + paint[i], tint = paint[i] * 0.28
      if (HOV > 0.01) {
        const dx = gx[i] - hx, dy = gy[i] - hy, d2 = dx * dx + dy * dy
        if (d2 < HR2) { const f = 1 - d2 / HR2, h = f * f * HOV; tgt += h; tint += h * 0.45 }
      }
      for (let k = 0; k < waves.length; k++) {
        const w = waves[k], dx = gx[i] - w.x, dy = gy[i] - w.y, age = T - w.t
        const q = Math.sqrt(dx * dx + dy * dy) - age * 28
        if (q > -5 && q < 5) { const a = Math.exp((-q * q) / 4) * Math.exp(-age * 1.3) * 1.8; tgt += a; tint += a * 0.25 }
      }
      if (idleAmp) tgt += idleAmp * Math.sin(gx[i] * 0.19 + T * 1.25) * Math.sin(gy[i] * 0.23 - T * 0.85)
      if (paint[i] > 0.002) paint[i] *= decay
      else paint[i] = 0
      const acc = K * (tgt - z[i]) - C * v[i]
      v[i] += acc * dt
      z[i] += v[i] * dt
      energy += Math.abs(v[i])
      arr[i * 16 + 14] = z[i] - LEN / 2
      if (tint > 1) tint = 1
      const j = i * 3
      carr[j] = pinC.r + (sigC.r - pinC.r) * tint
      carr[j + 1] = pinC.g + (sigC.g - pinC.g) * tint
      carr[j + 2] = pinC.b + (sigC.b - pinC.b) * tint
    }
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor.needsUpdate = true
    camX += (camTX - camX) * Math.min(1, dt * 3)
    camY += (camTY - camY) * Math.min(1, dt * 3)
    const yawA = reduce ? 0 : camX * 0.12, tiltA = TILT + (reduce ? 0 : camY * 0.06)
    camera.position.set(Math.sin(yawA) * dist * Math.cos(tiltA), Math.sin(tiltA) * dist, Math.cos(yawA) * dist * Math.cos(tiltA))
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
    const busy = energy > N * 0.002 || waves.length || hov > 0.02 || idleAmp > 0 || T < idleUntil
    if (!onScreen || document.hidden || !busy) sleep()
  }

  const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; if (onScreen) wake() }, { threshold: 0.02 })
  io.observe(host)
  const onVis = () => { if (!document.hidden) wake() }
  document.addEventListener('visibilitychange', onVis)
  const ro = new ResizeObserver(resize)
  ro.observe(host)
  const offTheme = onTheme(readTheme)
  readTheme()
  resize()
  renderer.render(scene, camera)
  if (word) setWord(word)

  return {
    setWord,
    destroy() {
      sleep()
      io.disconnect(); ro.disconnect(); offTheme()
      document.removeEventListener('visibilitychange', onVis)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerenter', onEnter)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointerdown', onDown)
      host.removeEventListener('pointercancel', onCancel)
      window.removeEventListener('pointerup', onUp)
      geo.dispose(); mat.dispose(); plateGeo.dispose(); plateMat.dispose(); shadeMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
