import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { contact, sections } from '../content/profile'
import { useIntro } from '../hooks/IntroContext'
import './SideRail.css'

/** Trilho lateral fixo (desktop): seção atual, progresso e atalhos de contato. */
export function SideRail({ active, theme }: { active: string; theme: string }) {
  const { homeVisible, phase } = useIntro()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const current = sections.find((s) => s.id === active) ?? sections[0]

  return (
    <motion.aside
      className="rail"
      data-theme={theme}
      aria-label="Navegação lateral"
      inert={phase === 'intro' || phase === 'reveal'}
      initial={{ x: '-100%' }}
      animate={{ x: homeVisible ? '0%' : '-100%' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: homeVisible ? 1 : 0 }}
    >
      <div className="rail__current" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current.id}
            className="rail__current-text"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <b>{current.index}</b> — {current.label}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="rail__links">
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (abre em nova aba)">
          in
        </a>
        <a href={`mailto:${contact.email}`} aria-label={`Enviar e-mail para ${contact.email}`}>
          e-mail
        </a>
      </div>

      <motion.span className="rail__progress" style={{ scaleY: progress }} aria-hidden="true" />
    </motion.aside>
  )
}
