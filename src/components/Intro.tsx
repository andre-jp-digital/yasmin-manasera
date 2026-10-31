import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { person } from '../content/profile'
import { useIntro } from '../hooks/IntroContext'
import { useFinePointer } from '../hooks/useMediaQuery'
import './Intro.css'

const ease = [0.22, 1, 0.36, 1] as const
const easeInOut = [0.76, 0, 0.24, 1] as const
const WORD = 'PRAZER'.split('')

export function Intro() {
  const { phase } = useIntro()
  const visible = phase === 'intro' || phase === 'reveal'
  return <AnimatePresence>{visible && <IntroScreen key="intro" />}</AnimatePresence>
}

/** Palavra do nome: inicial sempre visível, restante oculto até a resposta. */
function NameWord({ word, layoutId, revealed, delay }: { word: string; layoutId: string; revealed: boolean; delay: number }) {
  const [initial, ...rest] = word.split('')
  return (
    <motion.span layoutId={layoutId} className="intro__name-word">
      <span className="intro__name-initial">{initial}</span>
      <span className="intro__name-rest">
        {rest.map((ch, i) => (
          <span className="intro__name-mask" key={i}>
            <motion.span
              initial={false}
              animate={{ y: revealed ? '0%' : '105%' }}
              transition={{ duration: 0.55, ease, delay: revealed ? delay + i * 0.035 : 0 }}
            >
              {ch}
            </motion.span>
          </span>
        ))}
        <motion.span
          className="intro__name-blank"
          aria-hidden="true"
          initial={false}
          animate={{ scaleX: revealed ? 0 : 1 }}
          transition={{ duration: 0.5, ease: easeInOut, delay: revealed ? delay : 0 }}
        />
      </span>
    </motion.span>
  )
}

function IntroScreen() {
  const { phase, enter, skip } = useIntro()
  const fine = useFinePointer()
  const [ready, setReady] = useState(false)
  // Qualquer fase após 'intro' (reveal, morph) mantém PRAZER fora e o nome completo.
  const revealed = phase !== 'intro'

  // Aguarda as fontes (máx. 900 ms) para que a composição não "pule".
  useEffect(() => {
    let alive = true
    const t = new Promise((r) => setTimeout(r, 900))
    Promise.race([document.fonts?.ready ?? Promise.resolve(), t]).then(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])

  // Teclado: Esc pula; Enter/Espaço (sem foco em outro controle) apresenta.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip()
      const idle = document.activeElement === document.body || document.activeElement === null
      if (idle && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        enter()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enter, skip])

  const state = revealed ? 'out' : ready ? 'in' : 'hidden'

  return (
    <motion.div
      className="intro"
      role="dialog"
      aria-modal="true"
      aria-label="Apresentação de Yasmin Manasera"
      exit={{ opacity: 1, transition: { duration: 1 } }}
    >
      {/* Cortina em duas camadas: tinta e, logo atrás, o vermelho-sinal. */}
      <motion.div
        className="intro__curtain intro__curtain--signal"
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.85, ease: easeInOut, delay: 0.14 } }}
      />
      <motion.div
        className="intro__curtain intro__curtain--ink"
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.8, ease: easeInOut } }}
      />

      {/* Iniciais fantasmas — viajam para a composição da home. */}
      <motion.span
        layoutId="mono-y"
        className="intro__ghost intro__ghost--y serif"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2, ease, delay: 0.35 }}
      >
        Y
      </motion.span>
      <motion.span
        layoutId="mono-m"
        className="intro__ghost intro__ghost--m serif"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2, ease, delay: 0.5 }}
      >
        M
      </motion.span>

      <motion.div
        className="intro__chrome"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready && !revealed ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="intro__top">
          <span className="intro__label">
            <span className="intro__dot" aria-hidden="true" /> Nº 01<span className="intro__long">&nbsp;— Uma apresentação</span>
          </span>
          <button type="button" className="intro__skip" onClick={skip}>
            Pular<span className="intro__long">&nbsp;introdução</span> <span aria-hidden="true">↘</span>
          </button>
        </div>
        <div className="intro__bottom" aria-hidden="true">
          <span>Estratégia · Marketing · Vendas</span>
          <span>Consultoria & diagnóstico de negócios</span>
        </div>
      </motion.div>

      <div className="intro__center">
        <button
          type="button"
          className="intro__word"
          onClick={enter}
          aria-label="Prazer — entrar no site"
          disabled={phase !== 'intro'}
        >
          {WORD.map((ch, i) => (
            <span className="intro__mask" key={i} aria-hidden="true">
              <motion.span
                className="intro__letter"
                style={{ ['--i' as string]: i }}
                initial={{ y: '110%' }}
                animate={state === 'in' ? { y: '0%' } : state === 'out' ? { y: '-112%' } : { y: '110%' }}
                transition={
                  state === 'out'
                    ? { duration: 0.55, ease: easeInOut, delay: i * 0.035 }
                    : { duration: 1, ease, delay: 0.15 + i * 0.06 }
                }
              >
                {ch}
              </motion.span>
            </span>
          ))}
          <span className="intro__mask" aria-hidden="true">
            <motion.span
              className="intro__letter intro__letter--dot"
              initial={{ scale: 0 }}
              animate={state === 'in' ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, ease, delay: state === 'in' ? 0.85 : 0 }}
            >
              .
            </motion.span>
          </span>
        </button>

        <motion.p
          className="intro__name"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
          transition={{ duration: 0.8, ease, delay: 0.75 }}
        >
          <NameWord word={person.firstName} layoutId="name-first" revealed={revealed} delay={0.05} />{' '}
          <NameWord word={person.lastName} layoutId="name-last" revealed={revealed} delay={0.18} />
        </motion.p>

        <motion.p
          className="intro__hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready && !revealed ? 1 : 0 }}
          transition={{ duration: 0.6, delay: revealed ? 0 : 1.15 }}
        >
          <span className="intro__pulse" aria-hidden="true" />
          {fine ? 'Clique em “prazer” para se apresentar' : 'Toque em “prazer” para se apresentar'}
        </motion.p>
      </div>
    </motion.div>
  )
}
