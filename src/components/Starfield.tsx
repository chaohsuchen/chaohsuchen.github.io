import { useEffect, useRef } from 'react'
import { pointer, reducedMotion, warp } from '../hooks/pointer'
import './Starfield.css'

type Star = { x: number; y: number; d: number; r: number; ph: number; sp: number; c: string }
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number }

const TINTS = ['255,255,255', '255,255,255', '255,255,255', '255,222,180', '200,240,255', '214,200,255']
const LINK_RADIUS = 170
const MAX_LINKS = 6

/**
 * The universe. Parallax depth layers, twinkle, scroll drift, shooting stars,
 * a warp jump on page change, and "constellation links": the cursor (the human)
 * reaches out and connects to the stars (the agents) around it.
 */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const still = reducedMotion()
    let w = 0
    let h = 0
    let dpr = 1
    let stars: Star[] = []
    const meteors: Meteor[] = []
    let px = 0
    let py = 0
    let glow = 0
    let raf = 0
    let last = performance.now()

    const spawn = (x = Math.random() * w, y = Math.random() * h): Star => {
      const d = Math.pow(Math.random(), 1.6) * 0.85 + 0.15
      return {
        x,
        y,
        d,
        r: d * 1.35 + (Math.random() < 0.03 ? 0.9 : 0),
        ph: Math.random() * Math.PI * 2,
        sp: 0.6 + Math.random() * 2.2,
        c: TINTS[(Math.random() * TINTS.length) | 0],
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(950, Math.floor((w * h) / 2300))
      stars = Array.from({ length: count }, () => spawn())
    }
    resize()
    window.addEventListener('resize', resize)

    const frame = (now: number) => {
      const t = now / 1000
      const dt = Math.min(250, now - last) / 16.67 // frame-rate independent decay
      last = now
      ctx.clearRect(0, 0, w, h)

      // eased parallax target from the pointer
      const tx = pointer.x / w - 0.5
      const ty = pointer.y / h - 0.5
      px += (tx - px) * 0.04
      py += (ty - py) * 0.04
      glow += ((pointer.inside && pointer.fine ? 1 : 0) - glow) * 0.08

      const scroll = window.scrollY
      const wl = still ? 0 : warp.level
      const cx = w / 2
      const cy = h / 2
      const links: { x: number; y: number; dist: number; c: string }[] = []

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        if (!still) s.y -= s.d * 0.04 // slow cosmic drift

        if (wl > 0.01) {
          const dx = s.x - cx
          const dy = s.y - cy
          const len = Math.hypot(dx, dy) || 1
          const v = wl * s.d * 34
          s.x += (dx / len) * v
          s.y += (dy / len) * v
          if (s.x < -50 || s.x > w + 50 || s.y < -50 || s.y > h + 50) {
            const a = Math.random() * Math.PI * 2
            const rr = Math.random() * Math.min(w, h) * 0.25
            Object.assign(s, spawn(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr))
          }
        }

        let sx = s.x - px * s.d * 40
        let sy = s.y - py * s.d * 40 - scroll * s.d * 0.12
        sy = ((sy % (h + 20)) + h + 20) % (h + 20) - 10
        if (s.y < -10) s.y += h + 20

        const tw = still ? 0.85 : 0.55 + 0.45 * Math.sin(t * s.sp + s.ph)
        let a = (0.25 + s.d * 0.75) * tw
        let r = s.r

        if (glow > 0.01) {
          const dist = Math.hypot(sx - pointer.x, sy - pointer.y)
          if (dist < LINK_RADIUS) {
            const k = 1 - dist / LINK_RADIUS
            a = Math.min(1, a + k * 0.9 * glow)
            r += k * 1.2 * glow
            if (s.d > 0.35) links.push({ x: sx, y: sy, dist, c: s.c })
          }
        }

        if (wl > 0.01) {
          const dx = sx - cx
          const dy = sy - cy
          const len = Math.hypot(dx, dy) || 1
          const tail = wl * s.d * 70
          ctx.strokeStyle = `rgba(${s.c},${a})`
          ctx.lineWidth = r
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.lineTo(sx - (dx / len) * tail, sy - (dy / len) * tail)
          ctx.stroke()
        } else if (r < 1.1) {
          ctx.fillStyle = `rgba(${s.c},${a})`
          ctx.fillRect(sx, sy, r * 1.4, r * 1.4)
        } else {
          ctx.fillStyle = `rgba(${s.c},${a})`
          ctx.beginPath()
          ctx.arc(sx, sy, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // constellation links: human cursor ⇄ nearest stars
      if (links.length && glow > 0.01) {
        links.sort((p, q) => p.dist - q.dist)
        const picked = links.slice(0, MAX_LINKS)
        ctx.lineWidth = 0.8
        for (let i = 0; i < picked.length; i++) {
          const p = picked[i]
          const k = (1 - p.dist / LINK_RADIUS) * glow
          const g = ctx.createLinearGradient(pointer.x, pointer.y, p.x, p.y)
          g.addColorStop(0, `rgba(255,214,140,${0.55 * k})`)
          g.addColorStop(1, `rgba(124,243,255,${0.35 * k})`)
          ctx.strokeStyle = g
          ctx.beginPath()
          ctx.moveTo(pointer.x, pointer.y)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
          if (i > 0) {
            const q = picked[i - 1]
            ctx.strokeStyle = `rgba(182,156,255,${0.18 * k})`
            ctx.beginPath()
            ctx.moveTo(q.x, q.y)
            ctx.lineTo(p.x, p.y)
            ctx.stroke()
          }
        }
      }

      // shooting stars
      if (!still && wl < 0.05 && Math.random() < 0.004 && meteors.length < 2) {
        const fromLeft = Math.random() < 0.5
        const speed = 9 + Math.random() * 6
        meteors.push({
          x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5,
          y: Math.random() * h * 0.35,
          vx: (fromLeft ? 1 : -1) * speed,
          vy: speed * 0.45,
          life: 0,
          max: 55 + Math.random() * 30,
        })
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx
        m.y += m.vy
        m.life++
        const k = Math.sin((m.life / m.max) * Math.PI)
        const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 9, m.y - m.vy * 9)
        g.addColorStop(0, `rgba(255,255,255,${0.9 * k})`)
        g.addColorStop(0.3, `rgba(255,200,240,${0.35 * k})`)
        g.addColorStop(1, 'rgba(124,243,255,0)')
        ctx.strokeStyle = g
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.vx * 9, m.y - m.vy * 9)
        ctx.stroke()
        if (m.life > m.max) meteors.splice(i, 1)
      }

      warp.level *= Math.pow(0.935, dt)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="universe" aria-hidden="true">
      <div className="nebula" />
      <canvas ref={ref} />
    </div>
  )
}
