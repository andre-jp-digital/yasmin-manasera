import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

/**
 * Fases da abertura "Prazer":
 *  - intro  : tela de apresentação aguardando a interação
 *  - reveal : "PRAZER" sai e o nome se completa (resposta à apresentação)
 *  - morph  : a tela se abre e nome + iniciais viajam até a home
 *  - done   : home ativa
 */
export type IntroPhase = 'intro' | 'reveal' | 'morph' | 'done'

const STORAGE_KEY = 'ym:intro-seen'
export const TIMING = { reveal: 820, morph: 1100 }

type IntroState = {
  phase: IntroPhase
  /** true quando a home foi revelada pela abertura (para coreografar a entrada) */
  cameFromIntro: boolean
  /** a home já pode exibir seus elementos */
  homeVisible: boolean
  enter: () => void
  skip: () => void
  replay: () => void
}

const Ctx = createContext<IntroState | null>(null)

function shouldPlayIntro() {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* modo privado sem storage: ignora */
  }
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>(() => (shouldPlayIntro() ? 'intro' : 'done'))
  const [cameFromIntro, setCameFromIntro] = useState(phase !== 'done')
  const timers = useRef<number[]>([])

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const phaseRef = useRef(phase)
  const go = (p: IntroPhase) => {
    phaseRef.current = p
    setPhase(p)
  }

  const enter = useCallback(() => {
    if (phaseRef.current !== 'intro') return
    markSeen()
    go('reveal')
    timers.current.push(
      window.setTimeout(() => go('morph'), TIMING.reveal),
      window.setTimeout(() => go('done'), TIMING.reveal + TIMING.morph),
    )
  }, [])

  const skip = useCallback(() => {
    const p = phaseRef.current
    if (p === 'done' || p === 'morph') return
    clear()
    markSeen()
    go('morph')
    timers.current.push(window.setTimeout(() => go('done'), TIMING.morph))
  }, [])

  const replay = useCallback(() => {
    clear()
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
    setCameFromIntro(true)
    go('intro')
  }, [])

  // Trava a rolagem durante a abertura e garante topo da página.
  useEffect(() => {
    const root = document.documentElement
    if (phase === 'intro' || phase === 'reveal') {
      root.classList.add('is-locked')
      window.scrollTo(0, 0)
    } else {
      root.classList.remove('is-locked')
    }
    if (phase === 'done') root.classList.remove('intro-pending')
  }, [phase])

  useEffect(() => clear, [])

  const value = useMemo<IntroState>(
    () => ({
      phase,
      cameFromIntro,
      homeVisible: phase === 'morph' || phase === 'done',
      enter,
      skip,
      replay,
    }),
    [phase, cameFromIntro, enter, skip, replay],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useIntro() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useIntro precisa de <IntroProvider>')
  return ctx
}
