import { useEffect, useRef } from 'react'
import { pointer, reducedMotion } from '../hooks/pointer'
import './Face.css'

export type Who = 'chao' | 'alice' | 'bob'

/** A crew member's head whose eyes follow the pointer. Used across pages as avatars. */
export default function Face({ who, size = 56, className = '' }: { who: Who; size?: number; className?: string }) {
  const svg = useRef<SVGSVGElement>(null)
  const pupils = useRef<SVGGElement>(null)
  const head = useRef<SVGGElement>(null)

  useEffect(() => {
    if (reducedMotion()) return
    let raf = 0
    let px = 0
    let py = 0
    let a = 0
    const loop = () => {
      const el = svg.current
      if (el) {
        const r = el.getBoundingClientRect()
        const inView = r.bottom > 0 && r.top < window.innerHeight
        if (inView) {
          const dx = pointer.x - (r.left + r.width / 2)
          const dy = pointer.y - (r.top + r.height / 2)
          const d = Math.hypot(dx, dy) || 1
          const k = Math.min(1, d / 90) * 4.2
          px += ((dx / d) * k - px) * 0.2
          py += ((dy / d) * k - py) * 0.2
          a += (Math.max(-10, Math.min(10, dx / 40)) - a) * 0.12
          pupils.current?.setAttribute('transform', `translate(${px.toFixed(2)} ${py.toFixed(2)})`)
          head.current?.setAttribute('transform', `rotate(${a.toFixed(2)} 0 30)`)
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg ref={svg} className={`face face-${who} ${className}`} width={size} height={size} viewBox="-58 -66 116 124" aria-hidden="true">
      <g ref={head}>
        {who === 'alice' && (
          <>
            <line x1="0" y1="-40" x2="0" y2="-54" />
            <circle cx="0" cy="-59" r="5.5" className="led" />
            <rect x="-59" y="-14" width="10" height="28" rx="4" className="fill" />
            <rect x="49" y="-14" width="10" height="28" rx="4" className="fill" />
            <rect x="-50" y="-40" width="100" height="82" rx="26" className="fill" />
            <rect x="-39" y="-29" width="78" height="60" rx="18" className="visor" />
            <g className="eyes">
              <g ref={pupils}>
                <rect x="-24" y="-12" width="13" height="20" rx="6.5" className="led" />
                <rect x="11" y="-12" width="13" height="20" rx="6.5" className="led" />
              </g>
            </g>
            <path d="M-7 18 Q0 23 7 18" fill="none" />
          </>
        )}
        {who === 'chao' && (
          <>
            <ellipse rx="40" ry="43" className="fill" />
            <path d="M-40 -6 Q-42 -46 -2 -46 Q36 -46 41 -8 Q30 -26 14 -24 Q8 -36 -6 -30 Q-16 -38 -24 -26 Q-36 -24 -40 -6 Z" className="hair" />
            <ellipse cx="-24" cy="16" rx="6" ry="3.4" className="blush" />
            <ellipse cx="24" cy="16" rx="6" ry="3.4" className="blush" />
            <g className="eyes">
              <ellipse cx="-13" cy="0" rx="9" ry="12" className="eye" />
              <ellipse cx="13" cy="0" rx="9" ry="12" className="eye" />
              <g ref={pupils}>
                <circle cx="-13" cy="1" r="5" className="pupil" />
                <circle cx="13" cy="1" r="5" className="pupil" />
              </g>
            </g>
            <path d="M-9 23 Q0 31 9 23" fill="none" />
          </>
        )}
        {who === 'bob' && (
          <>
            <rect x="-52" y="-40" width="104" height="84" rx="34" className="fill" />
            <path d="M-57 2 Q-59 -58 0 -58 Q59 -58 57 2" fill="none" />
            <rect x="-62" y="-14" width="12" height="30" rx="5" className="fill" />
            <rect x="50" y="-14" width="12" height="30" rx="5" className="fill" />
            <path d="M-56 16 Q-53 36 -28 37" fill="none" />
            <circle cx="-25" cy="37" r="3.5" className="led" />
            <rect x="-41" y="-29" width="82" height="60" rx="22" className="visor" />
            <circle cx="-18" cy="-2" r="11.5" fill="none" className="eye-ring" />
            <circle cx="18" cy="-2" r="11.5" fill="none" className="eye-ring" />
            <g className="eyes">
              <g ref={pupils}>
                <circle cx="-18" cy="-2" r="5.2" className="led" />
                <circle cx="18" cy="-2" r="5.2" className="led" />
              </g>
            </g>
            <path d="M-7 19 Q0 24 7 19" fill="none" />
          </>
        )}
      </g>
    </svg>
  )
}
