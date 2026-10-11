import Reveal from '../components/Reveal'
import Tilt from '../components/Tilt'
import Face, { type Who } from '../components/Face'
import PageHead from '../components/PageHead'
import { about, profile } from '../data/content'
import './About.css'

const WHO_MAP: Record<'human' | 'ai1' | 'ai2', Who> = { human: 'chao', ai1: 'alice', ai2: 'bob' }
const WHO_COLOR = { human: 'var(--human)', ai1: 'var(--ai1)', ai2: 'var(--ai2)' }

export default function About() {
  return (
    <div className="page about">
      <PageHead eyebrow="About · Chao-Hsu" title={about.headline} />

      <section className="about-grid">
        <div className="about-bio">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className={i === 0 ? 'lead' : ''}>{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <Tilt className="crew-id glass hai-border" max={9}>
            <span className="holo" aria-hidden="true" />
            <div className="crew-id-top">
              <span className="eyebrow">Crew ID · 001</span>
              <span className="badge">HUMAN</span>
            </div>
            <div className="crew-id-face">
              <Face who="chao" size={120} />
            </div>
            <h3>{profile.name}</h3>
            <p className="serif crew-id-prog">{profile.program}</p>
            <dl className="facts">
              {about.facts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
            <div className="crew-id-team">
              <span className="eyebrow">Teammates</span>
              <div className="team-faces">
                <Face who="alice" size={34} />
                <Face who="bob" size={34} />
              </div>
            </div>
            <div className="barcode" aria-hidden="true" />
          </Tilt>
        </Reveal>
      </section>

      <section className="principles">
        <Reveal className="center-head">
          <p className="eyebrow">Operating principles</p>
          <h2 className="section-title">
            What I <span className="hai-text">believe</span>
          </h2>
        </Reveal>
        <div className="principle-grid">
          {about.principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="principle glass" style={{ ['--pc' as string]: WHO_COLOR[p.who] }}>
                <div className="principle-face">
                  <Face who={WHO_MAP[p.who]} size={54} />
                  <span className="principle-num">0{i + 1}</span>
                </div>
                <h3 className="serif">{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="toolkit">
        <Reveal className="toolkit-copy">
          <p className="eyebrow">Toolkit</p>
          <h2 className="section-title">
            Things in my <span className="hai-text">orbit</span>
          </h2>
          <p className="muted">Hover the system to pause it. Inner ring: what I build with. Outer ring: what I think about.</p>
          <div className="edu">
            {about.education.map((e) => (
              <div className="edu-item" key={e.what}>
                <span className="edu-logo">
                  <img src={e.logo} alt={`${e.where} logo`} loading="lazy" />
                </span>
                <div>
                  <span className="edu-when">{e.when}</span>
                  <div className="edu-what">{e.what}</div>
                  <div className="edu-where">{e.where}</div>
                  {e.note && <div className="edu-note">{e.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Orbit />
        </Reveal>
      </section>
    </div>
  )
}

function Orbit() {
  const rings = [
    { items: about.skills.inner, r: 34, dur: 38, cls: 'inner' },
    { items: about.skills.outer, r: 48, dur: 64, cls: 'outer' },
  ]
  return (
    <div className="orbit-sys" aria-label="Skills">
      <div className="orbit-core">
        <Face who="chao" size={70} />
      </div>
      {rings.map((ring) => (
        <div key={ring.cls} className={`ring ring-${ring.cls}`} style={{ ['--r' as string]: ring.r, ['--dur' as string]: `${ring.dur}s` }}>
          {ring.items.map((s, i) => {
            const angle = (360 / ring.items.length) * i
            return (
              <div key={s} className="planet" style={{ transform: `rotate(${angle}deg) translateX(var(--rpx)) rotate(${-angle}deg)` }}>
                <span className="planet-label">{s}</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
