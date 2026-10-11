import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import Tilt from '../components/Tilt'
import Face from '../components/Face'
import { GitHubIcon, LinkedInIcon, MailIcon } from '../components/Icons'
import { faq, profile } from '../data/content'
import { reducedMotion } from '../hooks/pointer'
import './Contact.css'

type Msg = { id: number; from: 'you' | 'alice' | 'bob'; text: string; links?: { label: string; href: string }[] }

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const handle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

  return (
    <div className="page contact">
      <PageHead eyebrow="Get in touch" title="Contact">
        Research collaborations, questions about my work, or just a good idea about humans and AI. My inbox is open.
      </PageHead>

      <section className="contact-grid">
        <Reveal>
          <Tilt className="postcard-wrap" max={6}>
            <article className="postcard">
              <span className="holo" aria-hidden="true" />
              <div className="pc-left">
                <p className="pc-greet">Greetings from UofT</p>
                <div className="pc-note">
                  <p>Hi there,</p>
                  <p>
                    Thanks for drifting through my little corner of the universe. If you’re working on AI that helps real people, or want to talk agents, HCI or
                    research, I’d really like to hear from you.
                  </p>
                  <p className="pc-sign">
                    — {profile.shortName}
                  </p>
                </div>
              </div>

              <div className="pc-right">
                <div className="pc-stamp" aria-hidden="true">
                  <div className="pc-stamp-inner">
                    <div className="pc-stamp-faces">
                      <Face who="alice" size={24} />
                      <Face who="chao" size={28} />
                      <Face who="bob" size={24} />
                    </div>
                    <span>HUMAN × AI</span>
                  </div>
                </div>
                <svg className="pc-postmark" viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <path id="pm-circle" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
                  </defs>
                  <circle cx="50" cy="50" r="44" />
                  <circle cx="50" cy="50" r="28" />
                  <text>
                    <textPath href="#pm-circle">UNIVERSITY OF TORONTO · CANADA ·</textPath>
                  </text>
                  <text x="50" y="54" textAnchor="middle" className="pm-year">
                    {new Date().getFullYear()}
                  </text>
                </svg>

                <ul className="pc-lines">
                  <li>
                    <button onClick={copy} aria-label={`Copy email address ${profile.email}`}>
                      <MailIcon size={16} />
                      <span className="pc-mail">{profile.email}</span>
                      <AnimatePresence mode="wait">
                        <motion.small key={copied ? 'y' : 'n'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {copied ? 'copied ✓' : 'copy'}
                        </motion.small>
                      </AnimatePresence>
                    </button>
                  </li>
                  <li>
                    <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                      <LinkedInIcon size={15} /> {handle(profile.links.linkedin)}
                    </a>
                  </li>
                  <li>
                    <a href={profile.links.github} target="_blank" rel="noreferrer">
                      <GitHubIcon size={15} /> {handle(profile.links.github)}
                    </a>
                  </li>
                  <li className="pc-where">{profile.location}</li>
                </ul>
              </div>
            </article>
          </Tilt>
        </Reveal>

        <Reveal delay={0.12}>
          <AgentChat />
        </Reveal>
      </section>
    </div>
  )
}

function AgentChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, from: 'alice', text: 'Hi! I’m Alice. Bob and I know a lot about Chao-Hsu. Ask us anything below ↓' },
  ])
  const [typing, setTyping] = useState<'alice' | 'bob' | null>(null)
  const [asked, setAsked] = useState<number[]>([])
  const box = useRef<HTMLDivElement>(null)
  const timer = useRef(0)

  useEffect(() => {
    const el = box.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const ask = (k: number) => {
    if (typing) return
    const who = asked.length % 2 ? 'alice' : 'bob'
    setAsked((a) => [...a, k])
    setMsgs((m) => [...m, { id: Date.now(), from: 'you', text: faq[k].q }])
    setTyping(who)
    timer.current = window.setTimeout(() => {
      setTyping(null)
      setMsgs((m) => [...m, { id: Date.now() + 1, from: who, text: faq[k].a, links: faq[k].links }])
    }, 900)
  }

  const remaining = faq.map((f, k) => ({ ...f, k })).filter((f) => !asked.includes(f.k))

  return (
    <div className="chat glass hai-border">
      <div className="chat-head">
        <div className="chat-avatars">
          <Face who="alice" size={30} />
          <Face who="bob" size={30} />
        </div>
        <div>
          <div className="chat-title">Ask the agents</div>
          <div className="chat-status">
            <i /> Alice & Bob · online
          </div>
        </div>
      </div>

      <div className="chat-body" ref={box} aria-live="polite">
        {msgs.map((m, idx) => (
          <motion.div
            key={m.id}
            className={`msg msg-${m.from}`}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          >
            {m.from !== 'you' && <Face who={m.from} size={28} className="msg-face" />}
            <div className="msg-bubble">
              {m.from !== 'you' && idx > 0 ? <Typewriter text={m.text} /> : m.text}
              {m.links && (
                <motion.div
                  className="msg-links"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reducedMotion() ? 0 : m.text.length * 0.007 + 0.15 }}
                >
                  {m.links.map((l) => (
                    <a key={l.href} href={l.href} target={l.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                      {l.label} {l.href.startsWith('mailto:') ? '✉' : '↗'}
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className={`msg msg-${typing}`}>
            <Face who={typing} size={28} className="msg-face" />
            <div className="msg-bubble typing" aria-label={`${typing} is typing`}>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <div className="chat-chips">
        {remaining.length ? (
          remaining.map((f) => (
            <button key={f.k} className="chat-chip" onClick={() => ask(f.k)} disabled={!!typing}>
              {f.q}
            </button>
          ))
        ) : (
          <a className="chat-chip done" href={`mailto:${profile.email}`}>
            That’s all we know. Ask Chao-Hsu directly →
          </a>
        )}
      </div>
    </div>
  )
}

function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(() => (reducedMotion() ? text.length : 0))
  useEffect(() => {
    if (n >= text.length) return
    const id = window.setTimeout(() => setN((x) => Math.min(text.length, x + 2)), 14)
    return () => window.clearTimeout(id)
  }, [n, text])
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="caret" />}
    </>
  )
}
