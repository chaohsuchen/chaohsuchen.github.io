import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStage, type Mode } from '../hooks/stage'
import { profile } from '../data/content'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import './Nav.css'

export const NAV: { to: string; label: string; mode: Mode }[] = [
  { to: '/about', label: 'About', mode: 'about' },
  { to: '/research', label: 'Research', mode: 'research' },
  { to: '/jobs', label: 'Jobs', mode: 'jobs' },
  { to: '/contests', label: 'Contests', mode: 'contests' },
  { to: '/contact', label: 'Contact', mode: 'contact' },
]

export default function Nav() {
  const { setMode } = useStage()
  const { pathname } = useLocation()
  const [hovered, setHovered] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const leave = () => {
    setHovered(null)
    setMode('home')
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Link to="/" className="logo" aria-label={`${profile.name}, home`}>
        <span className="logo-orbs" aria-hidden="true">
          <i className="o-human" />
          <i className="o-ai" />
        </span>
        <span className="logo-text hai-text">chao·hsu</span>
      </Link>

      <nav className="pill-nav hai-border" onMouseLeave={leave} aria-label="Main">
        <span className="cap cap-l" aria-hidden="true" />
        {NAV.map((item) => {
          const active = pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`pill-link ${active ? 'is-active' : ''}`}
              onMouseEnter={() => {
                setHovered(item.to)
                setMode(item.mode)
              }}
              onFocus={() => setMode(item.mode)}
              onBlur={() => setMode('home')}
            >
              {active && <motion.span layoutId="nav-active" className="pill-active" transition={{ type: 'spring', stiffness: 520, damping: 36 }} />}
              {hovered === item.to && !active && (
                <motion.span layoutId="nav-hover" className="pill-hover" transition={{ type: 'spring', stiffness: 700, damping: 40 }} />
              )}
              <span className="pill-label">{item.label}</span>
            </NavLink>
          )
        })}
        <span className="cap cap-r" aria-hidden="true" />
        <span className="signal" aria-hidden="true" />
      </nav>

      <div className="header-social">
        <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          <GitHubIcon />
        </a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
        <a href={`mailto:${profile.email}`} aria-label="Email">
          <MailIcon size={20} />
        </a>
      </div>
    </header>
  )
}
