# Ritij Shah — portfolio

Vite + React + Tailwind CSS v4 + GSAP (ScrollSmoother, ScrollTrigger, SplitText) + Three.js.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## Where things live

- `src/data/resume.js` — all copy: projects, roles, skills, links. Edit content here.
- `src/sections/` — one component per page section.
- `src/lib/pinscreen.js` — the 3D pin wall in the hero (Three.js, instanced cylinders).
- `src/lib/wordspace.js` — the 3D word cloud (Canvas 2D with a hand-rolled projection).
- `src/lib/face.js`, `src/lib/markov.js` — the expression toy and the temperature console's word-pair model.
- `src/data/wordspace.json` — word positions and neighbours, computed from `public/data/corpus.txt`
  (Sonnets + Hamlet, cleaned the same way as the lstm-text-generator script).
- Colours and fonts are CSS variables at the top of `src/index.css`, exposed to Tailwind as
  `bg-steel`, `text-ink`, `border-rule`, `text-signal`, `font-display`, `font-mono`, etc.
