import { Link } from 'react-router-dom'
import Face from '../components/Face'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="page lost">
      <div className="lost-float">
        <Face who="alice" size={120} />
      </div>
      <p className="eyebrow">Error 404 · signal lost</p>
      <h1 className="serif">Lost in space</h1>
      <p className="muted">Alice searched every star and this page isn’t here. Let’s get you home.</p>
      <Link to="/" className="btn btn-primary">
        Beam me home <span className="arrow">→</span>
      </Link>
    </div>
  )
}
