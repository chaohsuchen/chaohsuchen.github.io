import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './Lightbox.css'

export type LightboxItem = { type: 'image'; src: string; alt: string } | { type: 'video'; href: string }

const youTubeId = (href: string) => {
  try {
    const u = new URL(href)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    return u.searchParams.get('v') ?? ''
  } catch {
    return ''
  }
}

/** Full-screen viewer for figures and videos. Esc or a click outside closes it. */
export default function Lightbox({ item, onClose }: { item: LightboxItem | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!item) return
    const prevFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus()
    }
  }, [item, onClose])

  const id = item?.type === 'video' ? youTubeId(item.href) : ''

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.type === 'video' ? 'Video player' : 'Figure'}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`lightbox-body lightbox-${item.type}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          >
            {item.type === 'image' ? (
              <img src={item.src} alt={item.alt} />
            ) : (
              <div className="video-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                  title="Project video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
            <div className="lightbox-bar">
              {item.type === 'video' && (
                <a href={item.href} target="_blank" rel="noreferrer">
                  Open on YouTube ↗
                </a>
              )}
              <button ref={closeRef} onClick={onClose}>
                Close ✕
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
