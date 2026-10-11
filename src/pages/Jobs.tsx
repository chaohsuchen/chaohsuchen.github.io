import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import PageHead from '../components/PageHead'
import Face from '../components/Face'
import { jobs } from '../data/content'
import './Jobs.css'

export default function Jobs() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.65', 'end 0.65'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })
  const top = useTransform(progress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`)

  return (
    <div className="page jobs">
      <PageHead eyebrow="Experience" title="Jobs">
        Where the ideas met real users. Scroll and Alice will fly you through it.
      </PageHead>

      <div ref={ref} className="timeline">
        <div className="tl-rail" aria-hidden="true">
          <motion.div className="tl-fill" style={{ scaleY: progress }} />
          <motion.div className="tl-rider" style={{ top }}>
            <Face who="alice" size={46} />
            <span className="tl-flame" />
          </motion.div>
        </div>

        {jobs.map((j, k) => (
          <div key={j.role + j.org} className={`tl-row ${k % 2 ? 'right' : 'left'}`}>
            <motion.span
              className="tl-star"
              initial={{ scale: 0.4, opacity: 0.3 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ margin: '-45% 0px -45% 0px' }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              aria-hidden="true"
            />
            <motion.article
              className="tl-card glass"
              initial={{ opacity: 0, x: k % 2 ? 50 : -50, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="tl-meta">
                <span className="tl-when">{j.when}</span>
                <span className="tl-where">{j.where}</span>
              </div>
              <h2 className="tl-role">{j.role}</h2>
              <p className="tl-org serif">{j.org}</p>
              {j.team && <p className="tl-team">{j.team}</p>}
              <ul className="tl-points">
                {j.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <div className="tags">
                {j.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </motion.article>
          </div>
        ))}

        <div className="tl-end">
          <span className="eyebrow">Next stop</span>
          <p className="serif">Maybe your team?</p>
        </div>
      </div>
    </div>
  )
}
