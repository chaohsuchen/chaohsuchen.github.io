import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import Tilt from '../components/Tilt'
import { contests, extras, type Contest } from '../data/content'
import './Contests.css'

const TIER: Record<Contest['tier'], { label: string; icon: string }> = {
  gold: { label: 'Gold', icon: '★' },
  silver: { label: 'Silver', icon: '◆' },
  bronze: { label: 'Bronze', icon: '▲' },
  star: { label: 'Honour', icon: '✦' },
}

export default function Contests() {
  const podiums = contests.filter((c) => c.tier === 'gold' || c.tier === 'silver' || c.tier === 'bronze').length
  const field = contests.reduce((sum, c) => sum + (c.field ?? 0), 0)

  return (
    <div className="page contests">
      <PageHead eyebrow="Hackathons & awards" title="Contests">
        Late nights, small teams, and ideas built fast. Hover a card to catch the foil.
      </PageHead>

      <Reveal>
        <figure className="stage-photo">
          <img src="/images/hackathon-pitch.jpg" alt="Chao-Hsu on stage with a microphone, pitching a hackathon project; the slide behind lists Logitech MX Creative Keypad, Whisper and multi-agent." />
          <figcaption>On stage, pitching our multi-agent prototype built on the Logitech MX Creative Keypad and Whisper.</figcaption>
        </figure>
      </Reveal>

      <Reveal>
        <div className="stats">
          <Stat n={contests.length} label="Awards" />
          <Stat n={podiums} label="Podium finishes" />
          <Stat n={field} suffix="+" label="Fellow competitors" />
        </div>
      </Reveal>

      <div className="trophy-grid">
        {contests.map((c, k) => (
          <Reveal key={c.name + k} delay={(k % 3) * 0.08}>
            <Tilt className={`trophy tier-${c.tier}`} max={14}>
              <span className="foil" aria-hidden="true" />
              <span className="glare" aria-hidden="true" />
              <div className="trophy-inner">
                <div className="trophy-top">
                  <span className="trophy-year">{c.year}</span>
                  <span className="trophy-tier">
                    {TIER[c.tier].icon} {TIER[c.tier].label}
                  </span>
                </div>
                <div className="trophy-medal" aria-hidden="true">
                  <span>{TIER[c.tier].icon}</span>
                </div>
                <p className="trophy-result serif">{c.result}</p>
                <h3 className="trophy-name">{c.name}</h3>
                <p className="trophy-blurb">{c.blurb}</p>
                <div className="trophy-foot">
                  <span>Achievement unlocked</span>
                  <span>#{String(k + 1).padStart(3, '0')}</span>
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>

      {extras.length > 0 && (
        <Reveal>
          <section className="extras">
            <p className="eyebrow">Also on the record</p>
            <ul>
              {extras.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}
    </div>
  )
}

function Stat({ n, label, suffix = '' }: { n: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, n, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => ctrl.stop()
  }, [inView, n])
  return (
    <div ref={ref} className="stat glass">
      <span className="stat-n hai-text">
        {v}
        {suffix}
      </span>
      <span className="eyebrow">{label}</span>
    </div>
  )
}
