import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Mode = 'home' | 'about' | 'research' | 'jobs' | 'contests' | 'contact'

type Stage = { mode: Mode; setMode: (m: Mode) => void }

const StageContext = createContext<Stage>({ mode: 'home', setMode: () => {} })

/** Which nav item is being hovered or focused; the home-page crew reacts to it. */
export function StageProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('home')
  const value = useMemo(() => ({ mode, setMode }), [mode])
  return <StageContext.Provider value={value}>{children}</StageContext.Provider>
}

export const useStage = () => useContext(StageContext)
