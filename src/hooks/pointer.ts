/**
 * One global pointer tracker shared by the starfield, cursor glow and the crew.
 * Animation loops read this object directly every frame, so mouse movement never re-renders React.
 */
export const pointer = {
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  y: typeof window !== 'undefined' ? window.innerHeight * 0.4 : 0,
  inside: false,
  fine: typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : true,
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.inside = true
    },
    { passive: true },
  )
  document.addEventListener('pointerleave', () => (pointer.inside = false))
  window.addEventListener('blur', () => (pointer.inside = false))
}

/** Warp drive: route changes kick this up, the starfield eases it back to 0. */
export const warp = {
  level: 0,
  kick(amount = 1) {
    warp.level = Math.max(warp.level, amount)
  },
}

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
