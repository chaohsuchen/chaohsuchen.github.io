import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import Crew from '../components/Crew'
import Tilt from '../components/Tilt'
import Reveal from '../components/Reveal'
import Face from '../components/Face'
import { news, profile, research } from '../data/content'
import './Home.css'

const MANIFESTO =
  'I don’t just want to build smarter AI. I want to build AI that makes *real people’s lives* better: agents that work *with us*, explain themselves, and leave us more capable than before.'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <IdCard />
        </motion.div>
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Crew />
          <p className="crew-hint">hover the menu · click the crew</p>
        </motion.div>
        <button className="scroll-cue" aria-label="Scroll down" onClick={() => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })}>
          <span />
        </button>
      </section>

      <Manifesto />
      <Updates />

      <section className="signoff">
        <Reveal>
          <p className="signoff-title serif">Thanks for stopping by.</p>
          <p className="signoff-text">
            If you’re building AI for real people, or just want to swap ideas about agents and HCI, I’d love to hear from you at{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </Reveal>
      </section>
    </div>
  )
}

function IdCard() {
  const [time, setTime] = useState(() => torontoTime())
  useEffect(() => {
    const id = window.setInterval(() => setTime(torontoTime()), 15000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <Tilt className="id-card glass" max={7}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      <span className="holo" aria-hidden="true" />

      <div className="id-chips">
        {profile.focus.map((f, i) => (
          <span key={f} className="chip" style={{ color: ['var(--human)', 'var(--ai1)', 'var(--ai2)'][i % 3] }}>
            <span className="dot" />
            <span style={{ color: '#d9d8ea' }}>{f}</span>
          </span>
        ))}
      </div>

      <h1 className="hero-name">
        {profile.name.split(' ').map((part, i) => (
          <span key={i} className="name-line">
            {part}
          </span>
        ))}
      </h1>
      <p className="hero-at">
        <span className="at">@</span> {profile.school}
      </p>
      <p className="hero-prog serif">{profile.program}</p>
      <p className="hero-tag">{profile.tagline}</p>

      <div className="hero-actions">
        <Link to="/research" className="btn btn-primary">
          See research <span className="arrow">→</span>
        </Link>
        <Link to="/about" className="btn btn-ghost">
          About me
        </Link>
      </div>

      <div className="id-foot">
        <span>43.66°N · 79.39°W</span>
        <span className="live">
          <i /> Toronto · {time}
        </span>
      </div>
    </Tilt>
  )
}

function torontoTime() {
  try {
    return new Intl.DateTimeFormat('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Toronto' }).format(new Date())
  } catch {
    return ''
  }
}

/** Words light up one by one as you scroll. *starred* phrases get the HAI gradient. */
function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })

  const words: { w: string; hi: boolean }[] = []
  MANIFESTO.split(/(\*[^*]+\*)/).forEach((chunk) => {
    const hi = chunk.startsWith('*')
    chunk
      .replace(/\*/g, '')
      .split(' ')
      .filter(Boolean)
      .forEach((w) => words.push({ w, hi }))
  })

  return (
    <section id="manifesto" className="manifesto">
      <Reveal>
        <p className="eyebrow">
          <span className="hai-text">✦</span> Why I do this
        </p>
      </Reveal>
      <div ref={ref} className="manifesto-text">
        {words.map((item, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} hi={item.hi}>
            {item.w}
          </Word>
        ))}
      </div>
    </section>
  )
}

function Word({ children, progress, range, hi }: { children: string; progress: MotionValue<number>; range: [number, number]; hi: boolean }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const blur = useTransform(progress, range, ['blur(4px)', 'blur(0px)'])
  return (
    <motion.span className={`m-word ${hi ? 'hai-text' : ''}`} style={{ opacity, filter: blur }}>
      {children}{' '}
    </motion.span>
  )
}

const TAG_COLOR = { paper: 'var(--human)', award: '#ffd76a', job: 'var(--ai1)', school: 'var(--ai2)' }

function Updates() {
  const paper = research[0]
  return (
    <section className="updates">
      <div className="news">
        <Reveal>
          <p className="eyebrow">Recently</p>
          <h2 className="section-title">
            News & <span className="hai-text">notes</span>
          </h2>
        </Reveal>
        <ul className="news-list">
          {news.map((n, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <li className="news-item">
                <span className="news-when">{n.when}</span>
                <span className="news-dot" style={{ background: n.tag ? TAG_COLOR[n.tag] : '#fff' }} />
                <span className="news-text">{n.text}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      <Reveal delay={0.12} className="featured-wrap">
        <p className="eyebrow">Featured paper</p>
        <Tilt className="featured glass hai-border" max={6}>
          <span className="holo" aria-hidden="true" />
          <div className="featured-art" aria-hidden="true">
            <Face who="alice" size={46} />
            <Face who="chao" size={58} />
            <Face who="bob" size={46} />
          </div>
          <span className="chip">{paper.venue}</span>
          <h3 className="featured-title">{paper.title}</h3>
          <p className="featured-sub serif">{paper.subtitle}</p>
          <p className="featured-body">{paper.oneLiner}</p>
          <div className="featured-stats">
            {paper.stats.slice(0, 1).map((s) => (
              <span key={s.label}>
                <b>{s.n}</b> {s.label}
              </span>
            ))}
            <span>
              <b>1st</b> author
            </span>
          </div>
          <div className="featured-actions">
            {paper.links?.[0] && (
              <a className="btn btn-primary" href={paper.links[0].href} target="_blank" rel="noreferrer">
                Read paper <span className="arrow">↗</span>
              </a>
            )}
            <Link className="btn btn-ghost" to="/research">
              All research →
            </Link>
          </div>
        </Tilt>
      </Reveal>
    </section>
  )
}
