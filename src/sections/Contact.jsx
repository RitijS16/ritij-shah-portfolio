import { useRef, useState } from 'react'
import { person } from '../data/resume'
import Strip from '../components/Strip'
import VarTitle from '../components/VarTitle'
import Magnetic from '../components/Magnetic'

export default function Contact() {
  const mail = useRef(null)
  const [copied, setCopied] = useState('')
  const copy = () => {
    const done = () => { setCopied('Copied'); setTimeout(() => setCopied(''), 2200) }
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(mail.current)
      const s = getSelection(); s.removeAllRanges(); s.addRange(r)
      setCopied('Selected, press Ctrl+C')
    }
    try { navigator.clipboard.writeText(person.email).then(done, fallback) } catch { fallback() }
  }
  return (
    <section className="module" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <Strip><span className="name">Contact</span><span>{person.city} · IST (UTC+5:30)</span></Strip>
        <div className="grid gap-7 pt-7 pb-[clamp(40px,6vw,64px)]">
          <VarTitle id="contact-title" text="Say hello" className="vt" radius={300} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <a ref={mail} href={'mailto:' + person.email} data-cursor="email" className="font-mono font-medium text-[clamp(20px,3vw,34px)] leading-tight no-underline break-all border-b-2 border-signal">{person.email}</a>
            <button className="btn" type="button" onClick={copy}>Copy email</button>
            <span className="font-mono text-xs text-ink-2 min-w-[10ch]" aria-live="polite">{copied}</span>
          </div>
          <div className="flex flex-wrap gap-x-[18px] gap-y-3.5 items-center">
            <Magnetic className="btn go" href={person.links.linkedin} target="_blank" rel="noopener" data-cursor="open">LinkedIn <span className="arr" aria-hidden="true">↗</span></Magnetic>
            <Magnetic className="btn" href={person.links.github} target="_blank" rel="noopener" data-cursor="open">GitHub <span className="arr" aria-hidden="true">↗</span></Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
