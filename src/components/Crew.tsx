import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { pointer, reducedMotion } from '../hooks/pointer'
import { useStage, type Mode } from '../hooks/stage'
import './Crew.css'

/*
 * Alice (AI agent) · Chao-Hsu (human) · Bob (AI agent), holding hands on a little planet.
 * Heads and eyes follow the pointer. The crew reacts to whichever nav item is hovered.
 */

type Who = 'alice' | 'chao' | 'bob'

// head centre in viewBox space, used for gaze maths
const HEADS: Record<Who, { x: number; y: number; neck: [number, number] }> = {
  alice: { x: 150, y: 403 - 134, neck: [0, -90] },
  chao: { x: 320, y: 390 - 200, neck: [0, -158] },
  bob: { x: 490, y: 403 - 151, neck: [0, -106] },
}

// where speech bubbles anchor (top of each head), in viewBox space
const BUBBLE_AT: Record<Who, [number, number]> = {
  alice: [150, 188],
  chao: [320, 140],
  bob: [490, 182],
}

const SIGN: Record<Mode, string> = {
  home: 'Human × AI',
  about: 'About me',
  research: 'Research',
  jobs: 'Jobs',
  contests: 'Contests',
  contact: 'Contact',
}

const ROUTE: Record<Mode, string> = {
  home: '/about',
  about: '/about',
  research: '/research',
  jobs: '/jobs',
  contests: '/contests',
  contact: '/contact',
}

const MODE_LINE: Partial<Record<Mode, { who: Who; text: string }>> = {
  about: { who: 'chao', text: 'Hi, that’s me!' },
  research: { who: 'alice', text: 'A CHI ’26 paper inside!' },
  jobs: { who: 'bob', text: 'Logitech, UofT & more' },
  contests: { who: 'alice', text: 'We won a hackathon!' },
  contact: { who: 'bob', text: 'Chao-Hsu reads every email ✦' },
}

const QUIPS: Record<Who, string[]> = {
  alice: ['I’m Alice. I plan things.', 'Beep boop. Human detected: friendly.', 'I never let go of Chao-Hsu’s hand.', 'Running on curiosity.exe'],
  chao: ['I’m Chao-Hsu, the human here.', 'AI should make people better.', 'These two are my teammates.', 'Psst, try clicking me a few more times.'],
  bob: ['I’m Bob. I double-check facts.', 'I listen first, then answer.', 'Humans + agents > either alone.', 'I explain my reasoning, promise.'],
}

const VW = 640
const VY = 56 // crop the empty sky above the crew so they render larger
const VH = 424 - VY
const FAST = { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const }
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export default function Crew() {
  const { mode } = useStage()
  const navigate = useNavigate()
  const svgRef = useRef<SVGSVGElement>(null)
  const heads = useRef<Record<Who, SVGGElement | null>>({ alice: null, chao: null, bob: null })
  const pupils = useRef<Record<Who, SVGGElement | null>>({ alice: null, chao: null, bob: null })
  const [quip, setQuip] = useState<{ who: Who; text: string; id: number } | null>(null)
  const [party, setParty] = useState(false)
  const clicks = useRef<number[]>([])
  const quipTimer = useRef<number>(0)

  // gaze loop: writes SVG transforms directly, no React renders
  useEffect(() => {
    const svg = svgRef.current!
    const pt = svg.createSVGPoint()
    const state: Record<Who, { a: number; tx: number; ty: number; px: number; py: number }> = {
      alice: { a: 0, tx: 0, ty: 0, px: 0, py: 0 },
      chao: { a: 0, tx: 0, ty: 0, px: 0, py: 0 },
      bob: { a: 0, tx: 0, ty: 0, px: 0, py: 0 },
    }
    const still = reducedMotion()
    let raf = 0

    const loop = (now: number) => {
      const ctm = svg.getScreenCTM()
      const live = pointer.inside || !pointer.fine
      ;(Object.keys(HEADS) as Who[]).forEach((who, i) => {
        const h = HEADS[who]
        const s = state[who]
        let tx = 0
        let ty = 0
        let a = 0
        let px = 0
        let py = 0
        if (ctm && live && !still) {
          pt.x = h.x
          pt.y = h.y
          const sp = pt.matrixTransform(ctm)
          const dx = pointer.x - sp.x
          const dy = pointer.y - sp.y
          const dist = Math.hypot(dx, dy) || 1
          a = clamp(dx / 28, -14, 14)
          tx = clamp(dx * 0.02, -7, 7)
          ty = clamp(dy * 0.02, -6, 5)
          const reach = Math.min(1, dist / 120) * 5
          px = (dx / dist) * reach
          py = (dy / dist) * reach
        } else if (!still) {
          // idle: gently look around
          const t = now / 1000 + i * 1.7
          a = Math.sin(t * 0.6) * 6
          px = Math.sin(t * 0.8) * 3.5
          py = Math.cos(t * 0.5) * 2
        }
        s.a += (a - s.a) * 0.14
        s.tx += (tx - s.tx) * 0.14
        s.ty += (ty - s.ty) * 0.14
        s.px += (px - s.px) * 0.25
        s.py += (py - s.py) * 0.25
        const head = heads.current[who]
        const pup = pupils.current[who]
        if (head) head.setAttribute('transform', `translate(${s.tx.toFixed(2)} ${s.ty.toFixed(2)}) rotate(${s.a.toFixed(2)} ${h.neck[0]} ${h.neck[1]})`)
        if (pup) pup.setAttribute('transform', `translate(${s.px.toFixed(2)} ${s.py.toFixed(2)})`)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => () => window.clearTimeout(quipTimer.current), [])

  const say = (who: Who) => {
    const now = Date.now()
    if (who === 'chao') {
      clicks.current = [...clicks.current.filter((t) => now - t < 1800), now]
      if (clicks.current.length >= 5) {
        clicks.current = []
        setParty(true)
        setQuip({ who: 'chao', text: 'HAI-five!! ✋', id: now })
        window.clearTimeout(quipTimer.current)
        quipTimer.current = window.setTimeout(() => {
          setParty(false)
          setQuip(null)
        }, 2600)
        return
      }
    }
    const pool = QUIPS[who]
    const prev = quip?.who === who ? quip.text : ''
    const options = pool.filter((q) => q !== prev)
    setQuip({ who, text: options[(Math.random() * options.length) | 0], id: now })
    window.clearTimeout(quipTimer.current)
    quipTimer.current = window.setTimeout(() => setQuip(null), 2600)
  }

  const modeLine = MODE_LINE[mode]
  const bubble = quip ?? (modeLine ? { ...modeLine, id: -1 } : null)
  const signText = party ? '✦ HAI-five ✦' : SIGN[mode]

  const charProps = (who: Who, label: string) => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    onClick: () => say(who),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        say(who)
      }
    },
    'data-glow': true,
  })

  return (
    <div className={`crew mode-${mode} ${party ? 'party' : ''}`}>
      <div className="crew-stage">
        <AnimatePresence>
          {mode !== 'home' && mode !== 'about' && !party && (
            <motion.div
              key={mode}
              className={`crew-prop prop-${mode}`}
              initial={{ opacity: 0, scale: 0.55, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 700, damping: 30 } }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
              aria-hidden="true"
            >
              <Prop mode={mode} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {bubble && (
            <motion.div
              key={`${bubble.who}-${bubble.text}`}
              className={`bubble bubble-${bubble.who}`}
              style={{ left: `${(BUBBLE_AT[bubble.who][0] / VW) * 100}%`, top: `${((BUBBLE_AT[bubble.who][1] - VY) / VH) * 100}%` }}
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 700, damping: 32 } }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              role="status"
            >
              {bubble.text}
            </motion.div>
          )}
        </AnimatePresence>

        <svg ref={svgRef} className="crew-svg" viewBox={`0 ${VY} ${VW} ${VH}`} aria-label="Two AI agents holding hands with a human, standing on a small planet">
          <defs>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="rim" x1="0" x2="1">
              <stop offset="0" stopColor="#ffc27a" stopOpacity="0" />
              <stop offset=".25" stopColor="#ffc27a" />
              <stop offset=".5" stopColor="#ff8fd8" />
              <stop offset=".75" stopColor="#7cf3ff" />
              <stop offset="1" stopColor="#7cf3ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1a1630" />
              <stop offset="1" stopColor="#0a0912" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="clasp">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".45" stopColor="#ffe48a" />
              <stop offset="1" stopColor="#ff8fd8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* sparkles */}
          <g className="sparkles" aria-hidden="true">
            {[
              [70, 120, 0],
              [590, 100, 1.2],
              [610, 250, 2.1],
              [36, 290, 0.6],
              [240, 90, 1.8],
              [410, 80, 2.6],
            ].map(([x, y, d], i) => (
              <path
                key={i}
                d={`M${x} ${y - 7} L${x + 1.6} ${y - 1.6} L${x + 7} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 7} L${x - 1.6} ${y + 1.6} L${x - 7} ${y} L${x - 1.6} ${y - 1.6} Z`}
                style={{ animationDelay: `${d}s` }}
              />
            ))}
          </g>

          {/* the little planet they stand on */}
          <path d="M60 420 Q320 360 580 420 Z" fill="url(#ground)" />
          <path d="M60 420 Q320 360 580 420" fill="none" stroke="url(#rim)" strokeWidth="2.5" filter="url(#glow)" />
          <g className="craters" opacity=".5">
            <ellipse cx="250" cy="405" rx="14" ry="3" />
            <ellipse cx="410" cy="408" rx="10" ry="2.4" />
            <ellipse cx="120" cy="414" rx="8" ry="2" />
            <ellipse cx="530" cy="414" rx="9" ry="2" />
          </g>

          <g className="crew-body">
            {/* arms linking human ⇄ agents */}
            <g className="links" fill="none" strokeLinecap="round" strokeWidth="3.2" filter="url(#glow)">
              <path d="M188 332 Q214 336 238 318" stroke="var(--ai1)" />
              <path d="M290 242 Q258 270 238 318" stroke="var(--human)" />
              <path d="M350 242 Q382 270 408 320" stroke="var(--human)" />
              <path d="M458 308 Q432 324 408 320" stroke="var(--ai2)" />
            </g>
            <g className="pulses" fill="none" strokeLinecap="round" strokeWidth="3.2">
              <path className="pulse pulse-l" pathLength={100} d="M290 242 Q258 270 238 318 Q214 336 188 332" />
              <path className="pulse pulse-r" pathLength={100} d="M350 242 Q382 270 408 320 Q432 324 458 308" />
            </g>
            <circle className="clasp" cx="238" cy="318" r="12" fill="url(#clasp)" />
            <circle className="clasp" cx="408" cy="320" r="12" fill="url(#clasp)" style={{ animationDelay: '.9s' }} />

            {/* ───── Alice: AI agent #1, a classic little robot with a screen face ───── */}
            <g className="char char-alice" transform="translate(150 403)" {...charProps('alice', 'Alice, an AI agent. Click to chat.')}>
              <g className="char-inner" filter="url(#glow)">
                <ellipse cx="-17" cy="-12" rx="11" ry="13" className="fill" />
                <ellipse cx="17" cy="-12" rx="11" ry="13" className="fill" />
                <rect x="-36" y="-84" width="72" height="66" rx="26" className="fill" />
                <rect x="-17" y="-67" width="34" height="18" rx="6" className="panel" />
                <circle cx="-8" cy="-58" r="2.6" className="led-dot" />
                <circle cx="0" cy="-58" r="2.6" className="led-dot" style={{ animationDelay: '.2s' }} />
                <circle cx="8" cy="-58" r="2.6" className="led-dot" style={{ animationDelay: '.4s' }} />
                <g className="arm-free arm-free-l">
                  <path d="M-36 -72 Q-56 -60 -60 -40" fill="none" />
                  <circle cx="-60" cy="-36" r="6" className="fill" />
                </g>
              </g>
              <g ref={(el) => void (heads.current.alice = el)}>
                <g className="head-float" filter="url(#glow)">
                  <line x1="0" y1="-92" x2="0" y2="-84" />
                  <line x1="0" y1="-178" x2="0" y2="-195" />
                  <circle cx="0" cy="-201" r="6" className="antenna" />
                  <rect x="-63" y="-149" width="10" height="30" rx="4" className="fill" />
                  <rect x="53" y="-149" width="10" height="30" rx="4" className="fill" />
                  <rect x="-54" y="-178" width="108" height="88" rx="28" className="fill" />
                  <rect x="-43" y="-167" width="86" height="64" rx="19" className="visor" />
                  <g className="eyes">
                    <g ref={(el) => void (pupils.current.alice = el)}>
                      <rect x="-27" y="-147" width="14" height="21" rx="7" className="led" />
                      <rect x="13" y="-147" width="14" height="21" rx="7" className="led" />
                      <circle cx="-23" cy="-142" r="2" className="shine" />
                      <circle cx="17" cy="-142" r="2" className="shine" />
                    </g>
                  </g>
                  <path d="M-8 -118 Q0 -112 8 -118" fill="none" className="led-line" />
                </g>
              </g>
            </g>

            {/* ───── Chao-Hsu: the human ───── */}
            <g className="char char-chao" transform="translate(320 390)" {...charProps('chao', 'Chao-Hsu, the human. Click to chat.')}>
              <g className="char-inner" filter="url(#glow)">
                <rect x="-26" y="-80" width="19" height="80" rx="9.5" className="fill" />
                <rect x="7" y="-80" width="19" height="80" rx="9.5" className="fill" />
                <path d="M-30 -150 Q0 -160 30 -150 L38 -80 Q0 -70 -38 -80 Z" className="fill" strokeLinejoin="round" />
                <path d="M-10 -152 L0 -138 L10 -152" fill="none" />
              </g>
              <g ref={(el) => void (heads.current.chao = el)}>
                <g className="head-float" filter="url(#glow)">
                  <line x1="0" y1="-160" x2="0" y2="-152" />
                  <ellipse cx="0" cy="-200" rx="40" ry="43" className="fill" />
                  {/* hair */}
                  <path
                    d="M-40 -206 Q-42 -246 -2 -246 Q36 -246 41 -208 Q30 -226 14 -224 Q8 -236 -6 -230 Q-16 -238 -24 -226 Q-36 -224 -40 -206 Z"
                    className="hair"
                    strokeLinejoin="round"
                  />
                  <path d="M-18 -246 Q-14 -258 -6 -262 M0 -247 Q4 -260 12 -262 M14 -245 Q22 -254 28 -254" fill="none" />
                  <ellipse cx="-24" cy="-184" rx="6" ry="3.4" className="blush" />
                  <ellipse cx="24" cy="-184" rx="6" ry="3.4" className="blush" />
                  <g className="eyes">
                    <ellipse cx="-13" cy="-200" rx="9" ry="12" className="eye" />
                    <ellipse cx="13" cy="-200" rx="9" ry="12" className="eye" />
                    <g ref={(el) => void (pupils.current.chao = el)}>
                      <circle cx="-13" cy="-199" r="5" className="pupil" />
                      <circle cx="13" cy="-199" r="5" className="pupil" />
                      <circle cx="-11" cy="-201.5" r="1.5" className="shine" />
                      <circle cx="15" cy="-201.5" r="1.5" className="shine" />
                    </g>
                  </g>
                  <path d="M-9 -177 Q0 -169 9 -177" fill="none" className="smile" />
                </g>
              </g>
            </g>

            {/* ───── Bob: AI agent #2, an assistant bot with a headset ───── */}
            <g className="char char-bob" transform="translate(490 403)" {...charProps('bob', 'Bob, an AI agent. Click to chat.')}>
              <g className="char-inner" filter="url(#glow)">
                <rect x="-21" y="-30" width="15" height="30" rx="7.5" className="fill" />
                <rect x="6" y="-30" width="15" height="30" rx="7.5" className="fill" />
                <rect x="-32" y="-100" width="64" height="72" rx="24" className="fill" />
                <rect x="-14" y="-82" width="28" height="20" rx="5" className="panel" />
                <path d="M-7 -72 l4 4 l8 -8" fill="none" className="check" />
                <g className="arm-free arm-free-r">
                  <path d="M32 -88 Q52 -76 58 -56" fill="none" />
                  <circle cx="58" cy="-52" r="6" className="fill" />
                </g>
              </g>
              <g ref={(el) => void (heads.current.bob = el)}>
                <g className="head-float" filter="url(#glow)">
                  <line x1="0" y1="-108" x2="0" y2="-100" />
                  <rect x="-56" y="-196" width="112" height="90" rx="36" className="fill" />
                  <path d="M-62 -150 Q-64 -214 0 -214 Q64 -214 62 -150" fill="none" className="band" />
                  <rect x="-67" y="-168" width="13" height="34" rx="5" className="fill" />
                  <rect x="54" y="-168" width="13" height="34" rx="5" className="fill" />
                  <path d="M-61 -136 Q-58 -114 -32 -113" fill="none" className="band" />
                  <circle cx="-28" cy="-113" r="4" className="led" />
                  <rect x="-44" y="-184" width="88" height="64" rx="24" className="visor" />
                  <circle cx="-19" cy="-154" r="12.5" fill="none" className="eye-ring" />
                  <circle cx="19" cy="-154" r="12.5" fill="none" className="eye-ring" />
                  <g className="eyes">
                    <g ref={(el) => void (pupils.current.bob = el)}>
                      <circle cx="-19" cy="-154" r="5.6" className="led" />
                      <circle cx="19" cy="-154" r="5.6" className="led" />
                      <circle cx="-17.5" cy="-156" r="1.6" className="shine" />
                      <circle cx="20.5" cy="-156" r="1.6" className="shine" />
                    </g>
                  </g>
                  <path d="M-8 -132 Q0 -126 8 -132" fill="none" className="led-line" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <button className="crew-sign hai-border" onClick={() => navigate(party ? '/about' : ROUTE[mode])} data-glow>
        <span className="sign-spark" aria-hidden="true">
          ✧
        </span>
        <span className="sign-slot" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={signText}
              className="sign-text"
              initial={{ y: '55%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1, transition: FAST }}
              exit={{ y: '-55%', opacity: 0, transition: { duration: 0.1 } }}
            >
              {signText}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="sign-spark" aria-hidden="true">
          ✧
        </span>
      </button>
    </div>
  )
}

function Prop({ mode }: { mode: Mode }) {
  const common = { width: 84, height: 84, viewBox: '0 0 80 80', fill: 'none', strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (mode) {
    case 'research':
      return (
        <svg {...common}>
          <path d="M40 14a18 18 0 0 0-10 33v7h20v-7a18 18 0 0 0-10-33z" />
          <path d="M32 60h16M34 66h12" />
          <path d="M40 4v4M16 14l3 3M64 14l-3 3M10 32h4M66 32h4" className="rays" />
          <path d="M35 40l5-8 5 8" />
        </svg>
      )
    case 'jobs':
      return (
        <svg {...common}>
          <rect x="12" y="26" width="56" height="38" rx="7" />
          <path d="M30 26v-6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6M12 42h56" />
          <rect x="36" y="38" width="8" height="8" rx="2" />
        </svg>
      )
    case 'contests':
      return (
        <svg {...common}>
          <path d="M26 12h28v16a14 14 0 0 1-28 0V12z" />
          <path d="M26 18H16a8 8 0 0 0 10 14M54 18h10a8 8 0 0 1-10 14M40 42v12M30 66h20M33 54h14v12H33z" />
          <path d="M40 18l2.4 5 5.4.6-4 3.6 1.2 5.3L40 30l-5 2.5 1.2-5.3-4-3.6 5.4-.6z" className="star" />
        </svg>
      )
    case 'contact':
      return (
        <svg {...common}>
          <path d="M8 38L70 12 58 66 38 50 8 38z" />
          <path d="M70 12L38 50v16l8-10" />
          <path d="M4 58c6-2 10-6 12-12M10 70c8-2 14-8 16-16" className="trail" />
        </svg>
      )
    default:
      return null
  }
}
