// Shared helpers: motion/pointer preferences and live theme tokens.
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
export const tok = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const listeners = new Set()
let wired = false
function wire() {
  if (wired) return
  wired = true
  const fire = () => listeners.forEach((fn) => fn())
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', fire)
  new MutationObserver(fire).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
}
export function onTheme(fn) {
  wire()
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const fontsReady = () =>
  document.fonts && document.fonts.load
    ? Promise.race([
        Promise.all([
          document.fonts.load('800 40px Archivo'),
          document.fonts.load('400 14px "IBM Plex Mono"'),
          document.fonts.load('600 14px "IBM Plex Mono"'),
        ]),
        new Promise((r) => setTimeout(r, 2500)),
      ])
    : Promise.resolve()
