import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Starfield from './components/Starfield'
import CursorGlow from './components/CursorGlow'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Research from './pages/Research'
import Jobs from './pages/Jobs'
import Contests from './pages/Contests'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { StageProvider, useStage } from './hooks/stage'
import { warp } from './hooks/pointer'
import { profile } from './data/content'

const TITLES: Record<string, string> = {
  '/': `${profile.name} · Human × AI`,
  '/about': `About · ${profile.name}`,
  '/research': `Research · ${profile.name}`,
  '/jobs': `Jobs · ${profile.name}`,
  '/contests': `Contests · ${profile.name}`,
  '/contact': `Contact · ${profile.name}`,
}

function AnimatedRoutes() {
  const location = useLocation()
  const { setMode } = useStage()
  const first = useRef(true)

  useEffect(() => {
    document.title = TITLES[location.pathname] ?? `Lost in space · ${profile.name}`
    setMode('home')
    if (first.current) {
      first.current = false
      warp.kick(0.6) // a little "arrival" jump on first load
      return
    }
    warp.kick(1)
  }, [location.pathname, setMode])

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.985, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.015, filter: 'blur(10px)' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<Research />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <StageProvider>
          <Starfield />
          <CursorGlow />
          <div className="app">
            <Nav />
            <AnimatedRoutes />
            <Footer />
          </div>
        </StageProvider>
      </MotionConfig>
    </BrowserRouter>
  )
}
