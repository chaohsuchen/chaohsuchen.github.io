import { Link } from 'react-router-dom'
import { profile } from '../data/content'
import './Footer.css'

const LINE = `© ${new Date().getFullYear()} ${profile.name.toUpperCase()} · TORONTO · UOFT · COMPUTER SCIENCE · HUMAN × AI · `

export default function Footer() {
  const socials = [
    ['GitHub', profile.links.github],
    ['LinkedIn', profile.links.linkedin],
    ['Scholar', profile.links.scholar],
    ['CV', profile.links.cv],
  ].filter(([, href]) => href)

  return (
    <footer className="site-footer">
      <div className="footer-row">
        <Link to="/" className="footer-mark">
          <span className="serif">Human</span> <span className="x">×</span> <span className="serif hai-text">AI</span>
        </Link>
        <div className="footer-links">
          {socials.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              {label} ↗
            </a>
          ))}
        </div>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>{LINE}</span>
          ))}
        </div>
      </div>
      <p className="sr-only">{LINE}</p>
    </footer>
  )
}
