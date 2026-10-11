import { useEffect, useRef } from 'react'
import { pointer } from '../hooks/pointer'
import './CursorGlow.css'

/** A warm "human light" around the pointer. It swells over anything interactive. */
export default function CursorGlow() {
  const halo = useRef<HTMLDivElement>(null)
  const core = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pointer.fine) return
    let x = pointer.x
    let y = pointer.y
    let s = 1
    let target = 1
    let raf = 0

    const over = (e: PointerEvent) => {
      const el = e.target as Element | null
      target = el?.closest('a, button, [data-glow], input, textarea, select, [role="button"]') ? 1.9 : 1
    }
    window.addEventListener('pointerover', over, { passive: true })

    const loop = () => {
      x += (pointer.x - x) * 0.18
      y += (pointer.y - y) * 0.18
      s += (target - s) * 0.12
      const on = pointer.inside ? 1 : 0
      if (halo.current) {
        halo.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${s})`
        halo.current.style.opacity = String(on)
      }
      if (core.current) {
        core.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%) scale(${s > 1.3 ? 1.6 : 1})`
        core.current.style.opacity = String(on)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerover', over)
    }
  }, [])

  if (!pointer.fine) return null
  return (
    <>
      <div ref={halo} className="cursor-halo" aria-hidden="true" />
      <div ref={core} className="cursor-core" aria-hidden="true" />
    </>
  )
}
