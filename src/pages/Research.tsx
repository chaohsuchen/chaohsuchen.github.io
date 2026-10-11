import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import Face from '../components/Face'
import Lightbox, { type LightboxItem } from '../components/Lightbox'
import { ongoing, research, type Project } from '../data/content'
import { useMedia } from '../hooks/useMedia'
import './Research.css'

const LOOP = [
  { k: 'Observe', d: 'Sit with real people. Find the friction worth removing.', who: 'chao' as const },
  { k: 'Prototype', d: 'Build an agent that takes on part of the work.', who: 'alice' as const },
  { k: 'Study', d: 'Measure trust, reliance, and outcomes, not just accuracy.', who: 'bob' as const },
  { k: 'Ship', d: 'Put it into someone’s actual day. Then listen again.', who: 'chao' as const },
]

// The pinned deck only fits when the window is wide and tall enough; otherwise cards simply stack.
const PINNED_QUERY = '(min-width: 961px) and (min-height: 740px)'

export default function Research() {
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null)
  const pinned = useMedia(PINNED_QUERY)
  const close = useCallback(() => setLightbox(null), [])

  return (
    <div className="page research">
      <PageHead eyebrow="Publications & projects" title="Research">
        Projects where people and agents share the work.
      </PageHead>

      <section className="ongoing">
        <Reveal>
          <p className="eyebrow section-label">
            <span className="live-dot" /> Now
          </p>
        </Reveal>
        {ongoing.map((o) => (
          <Reveal key={o.title} delay={0.05}>
            <article className="ongoing-card glass hai-border">
              <div className="ongoing-text">
                <span className="status status-ongoing">
                  <i /> Ongoing @ UofT
                </span>
                <h2 className="ongoing-title">{o.title}</h2>
                <p className="ongoing-one serif">{o.oneLiner}</p>
                <div className="tags">
                  {o.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <TrajectoryArt />
            </article>
          </Reveal>
        ))}
      </section>

      <section className="completed">
        <Reveal>
          <p className="eyebrow section-label">✓ Completed</p>
        </Reveal>
        {pinned ? (
          <PinnedDeck onOpen={setLightbox} />
        ) : (
          <div className="stack">
            {research.map((p, k) => (
              <Reveal key={p.title}>
                <ProjectCard p={p} k={k} onOpen={setLightbox} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="hai-loop">
        <Reveal className="center-head">
          <p className="eyebrow">How I work</p>
          <h2 className="section-title">
            The <span className="hai-text">HAI loop</span>
          </h2>
        </Reveal>
        <div className="loop-steps">
          {LOOP.map((s, k) => (
            <Reveal key={s.k} delay={k * 0.12}>
              <div className="loop-step glass">
                <div className="loop-step-top">
                  <Face who={s.who} size={40} />
                  <span className="loop-n">0{k + 1}</span>
                </div>
                <h3 className="serif">{s.k}</h3>
                <p>{s.d}</p>
              </div>
            </Reveal>
          ))}
          <div className="loop-track" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>

      <Lightbox item={lightbox} onClose={close} />
    </div>
  )
}

/**
 * Scroll-driven deck: the section is tall, the deck is sticky, and scroll progress picks the card.
 * Scrolling down past Dr. Ei automatically deals TAI to the front.
 */
function PinnedDeck({ onOpen }: { onOpen: (item: LightboxItem) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const n = research.length
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const iRef = useRef(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const k = Math.min(n - 1, Math.max(0, Math.floor(v * n)))
    if (k !== iRef.current) {
      setDir(k > iRef.current ? 1 : -1)
      iRef.current = k
      setI(k)
    }
  })

  const jump = useCallback(
    (k: number) => {
      const el = ref.current
      if (!el) return
      const k2 = Math.max(0, Math.min(n - 1, k))
      const top = el.getBoundingClientRect().top + window.scrollY
      const travel = el.offsetHeight - window.innerHeight
      window.scrollTo({ top: top + ((k2 + 0.5) / n) * travel, behavior: 'smooth' })
    },
    [n],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = ref.current
      if (!el || (e.target as HTMLElement)?.closest('input, textarea, [role="dialog"]')) return
      const r = el.getBoundingClientRect()
      if (r.top > window.innerHeight * 0.5 || r.bottom < window.innerHeight * 0.5) return
      if (e.key === 'ArrowRight') jump(iRef.current + 1)
      if (e.key === 'ArrowLeft') jump(iRef.current - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  return (
    <div ref={ref} className="deck-scroll" style={{ height: `calc(100vh + ${n * 75}vh)` }}>
      <div className="deck-sticky">
        <nav className="deck-tabs" aria-label="Completed projects">
          {research.map((r, k) => (
            <button key={r.title} className={`deck-tab ${k === i ? 'on' : ''}`} onClick={() => jump(k)} aria-current={k === i}>
              <span className="deck-num">{String(k + 1).padStart(2, '0')}</span>
              <span className="deck-name">
                {r.title}
                <small>{r.subtitle}</small>
              </span>
              <TabProgress progress={scrollYProgress} k={k} n={n} />
            </button>
          ))}
          <span className="deck-hint" aria-hidden="true">
            {i < n - 1 ? 'Scroll for the next project ↓' : 'Keep scrolling ↓'}
          </span>
        </nav>

        <div className="deck">
          {research.map((_, k) => {
            const depth = (k - i + n) % n
            if (depth === 0) return null
            return <div key={k} className="deck-ghost" style={{ ['--d' as string]: depth, zIndex: n - depth }} aria-hidden="true" />
          })}
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={i}
              className="deck-slot"
              custom={dir}
              variants={{
                enter: (d: number) => ({ y: d > 0 ? 70 : -70, scale: 0.94, opacity: 0 }),
                center: { y: 0, x: 0, rotate: 0, scale: 1, opacity: 1 },
                exit: (d: number) => ({ y: d > 0 ? -50 : 50, x: d > 0 ? -40 : 40, rotate: d > 0 ? -4 : 4, opacity: 0, scale: 0.96 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ zIndex: n + 1 }}
            >
              <ProjectCard p={research[i]} k={i} onOpen={onOpen} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function TabProgress({ progress, k, n }: { progress: MotionValue<number>; k: number; n: number }) {
  const scaleX = useTransform(progress, [k / n, (k + 1) / n], [0, 1])
  return <motion.span className="tab-bar" style={{ scaleX }} aria-hidden="true" />
}

function ProjectCard({ p, k, onOpen }: { p: Project; k: number; onOpen: (item: LightboxItem) => void }) {
  return (
    <article className="deck-card">
      <div className="card-top">
        <span className={`status status-${p.status}`}>{p.status === 'completed' ? '✓ Completed' : 'Ongoing'}</span>
        <span className="chip">{p.venue}</span>
        <span className="card-idx">{p.year}</span>
      </div>

      <div className="card-body">
        <div className="card-text">
          <h2 className="card-title">{p.title}</h2>
          <p className="card-sub">{p.subtitle}</p>
          {p.firstAuthor ? <span className="first-author">★ First Author</span> : <p className="card-role">{p.role}</p>}
          <p className="card-one serif">{p.oneLiner}</p>
          <p className="card-desc">{p.description}</p>
          <div className="card-stats">
            {p.stats.map((s) => (
              <div key={s.label} className="card-stat">
                <span className="hai-text">{s.n}</span>
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="card-media">
          {p.image && (
            <figure>
              <button
                className="media-frame"
                onClick={() => onOpen({ type: 'image', src: p.image!.src, alt: p.image!.alt })}
                aria-label={`Enlarge figure: ${p.image.caption}`}
              >
                <img src={p.image.src} alt={p.image.alt} loading="lazy" />
                <span className="media-zoom">⤢ Enlarge</span>
              </button>
              <figcaption>{p.image.caption}</figcaption>
            </figure>
          )}
          <div className="loop-diagram" aria-label="Who does what">
            <div className="loop-side">
              <Face who="chao" size={38} />
              <div>
                <span className="eyebrow">Human</span>
                <p>{p.human}</p>
              </div>
            </div>
            <div className="loop-wire" aria-hidden="true">
              <span />
            </div>
            <div className="loop-side right">
              <div>
                <span className="eyebrow">Agent</span>
                <p>{p.agent}</p>
              </div>
              <Face who={k % 2 ? 'bob' : 'alice'} size={38} />
            </div>
          </div>
        </div>
      </div>

      <div className="card-foot">
        <div className="tags">
          {p.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <div className="card-links">
          {p.links?.map((l) =>
            l.kind === 'video' ? (
              <button key={l.href} className="btn btn-primary btn-video" onClick={() => onOpen({ type: 'video', href: l.href })}>
                <span className="play" aria-hidden="true">
                  ▶
                </span>
                {l.label}
              </button>
            ) : (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn btn-primary">
                {l.label} <span className="arrow">↗</span>
              </a>
            ),
          )}
        </div>
      </div>
      {p.linkNote && <p className="link-note">↳ {p.linkNote}</p>}
    </article>
  )
}

/** A car drifting toward the point of no return, with an early-warning ring before it. */
function TrajectoryArt() {
  return (
    <svg className="trajectory" viewBox="0 0 320 150" aria-hidden="true">
      <defs>
        <linearGradient id="road" x1="0" x2="1">
          <stop offset="0" stopColor="#7cf3ff" stopOpacity=".25" />
          <stop offset=".6" stopColor="#b69cff" stopOpacity=".8" />
          <stop offset="1" stopColor="#ff6b7a" />
        </linearGradient>
        <radialGradient id="danger">
          <stop offset="0" stopColor="#ff6b7a" stopOpacity=".45" />
          <stop offset="1" stopColor="#ff6b7a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="268" cy="44" r="52" fill="url(#danger)" />
      <circle cx="268" cy="44" r="30" className="no-return" />
      <text x="268" y="104" className="traj-label danger">
        unrecoverable
      </text>
      <path id="traj-path" d="M14 128 C 90 128, 130 70, 200 58 S 250 44, 268 44" fill="none" stroke="url(#road)" strokeWidth="2.4" strokeDasharray="6 6" />
      <circle cx="198" cy="58" r="9" className="warn-ring" />
      <text x="190" y="86" className="traj-label">
        early warning
      </text>
      <g className="car">
        <rect x="-9" y="-5" width="18" height="10" rx="4" />
        <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" keyPoints="0;0.8;0.8" keyTimes="0;0.75;1" calcMode="linear">
          <mpath href="#traj-path" />
        </animateMotion>
      </g>
    </svg>
  )
}
