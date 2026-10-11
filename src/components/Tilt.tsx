import { useRef, type CSSProperties, type ReactNode } from 'react'
import { reducedMotion } from '../hooks/pointer'

type Props = {
  children: ReactNode
  className?: string
  max?: number
  style?: CSSProperties
}

/** 3D tilt + moving glare. Sets --mx / --my (0–100%) for holographic CSS effects. */
export default function Tilt({ children, className = '', max = 10, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || reducedMotion() || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.style.setProperty('--glare', '1')
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg)`
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--glare', '0')
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      style={{ transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)', transformStyle: 'preserve-3d', ...style }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </div>
  )
}
