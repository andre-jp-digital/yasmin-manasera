import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { education } from '../content/profile'
import { useFinePointer, useMediaQuery } from '../hooks/useMediaQuery'
import { Eyebrow } from './SectionHead'
import { MaskLines } from './ui/Reveal'
import './Education.css'

const ease = [0.22, 1, 0.36, 1] as const
const spring = { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 } as const

/**
 * Geometria do diagrama (em % do palco), por orientação.
 *  - d     : diâmetro do círculo no eixo principal (% do comprimento do eixo)
 *  - off   : posição de repouso (desligado)
 *  - on    : posição ligada (sozinho)
 *  - both  : posição com os dois ligados (sobreposição)
 *  - label : deslocamento do texto para fora da interseção quando unidos
 */
const GEO = {
  x: { d: 36, off: [25, 75], on: [31, 69], both: [40.5, 59.5], label: 6 },
  y: { d: 46.7, off: [24, 76], on: [28, 72], both: [34, 66], label: 7.5 },
}

export function Education() {
  const horizontal = useMediaQuery('(min-width: 760px)')
  const fine = useFinePointer()
  const axis = horizontal ? 'x' : 'y'
  const g = GEO[axis]
  const [active, setActive] = useState<[boolean, boolean]>([false, false])
  const [touched, setTouched] = useState(false)
  const both = active[0] && active[1]

  const toggle = (i: 0 | 1) => {
    setTouched(true)
    setActive((a) => (i === 0 ? [!a[0], a[1]] : [a[0], !a[1]]))
  }
  const pos = (i: 0 | 1) => (both ? g.both[i] : active[i] ? g.on[i] : g.off[i])
  const labelPos = (i: 0 | 1) => pos(i) + (both ? (i === 0 ? -g.label : g.label) : 0)

  // Interseção: o círculo B recortado pelo círculo A (clip-path no referencial de B)
  const dist = pos(1) - pos(0)
  const offset = 50 - (dist / g.d) * 100
  const lensClip = horizontal ? `circle(50% at ${offset}% 50%)` : `circle(50% at 50% ${offset}%)`

  const place = (p: number) => (horizontal ? { left: `${p}%` } : { top: `${p}%` })
  const [com, gest] = education.items
  const items = [com, gest] as const

  return (
    <section id="formacao" className="section education" data-theme="light" aria-labelledby="formacao-title">
      <div className="container">
        <div className="education__head">
          <div>
            <Eyebrow index="03" label={education.eyebrow} />
            <MaskLines
              id="formacao-title"
              className="h2 education__title"
              lines={[education.titleLead, education.titleAccent]}
              maskClass="education__title-mask"
              lineClass={(i) => `education__title-line${i === 1 ? ' serif-accent' : ''}`}
              stagger={0.12}
            />
          </div>
          <p className="education__hint">
            <span className="education__hint-dot" aria-hidden="true" />
            {fine ? 'Clique' : 'Toque'} nos dois círculos para somar as formações.
          </p>
        </div>

        <div className={`venn venn--${axis}${both ? ' is-both' : ''}${touched ? ' is-touched' : ''}`}>
          {/* círculos */}
          {items.map((it, i) => (
            <motion.button
              key={it.institution}
              type="button"
              className={`venn__circle venn__circle--${i}${active[i] ? ' is-on' : ''}`}
              aria-pressed={active[i]}
              aria-label={`${it.word}: ${it.degree}, ${it.institution}. ${active[i] ? 'Ativo' : 'Ativar'}`}
              onClick={() => toggle(i as 0 | 1)}
              initial={false}
              animate={place(pos(i as 0 | 1))}
              transition={spring}
            >
              <span className="venn__pulse" aria-hidden="true" />
            </motion.button>
          ))}

          {/* interseção */}
          <motion.div
            className="venn__lens"
            aria-hidden="true"
            initial={false}
            animate={{ ...place(pos(1)), clipPath: lensClip, opacity: both ? 1 : 0 }}
            transition={{ ...spring, opacity: { duration: 0.35, delay: both ? 0.25 : 0 } }}
          />
          <AnimatePresence>
            {both && (
              <motion.p
                key="lens-text"
                className="venn__lens-text serif"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, ease, delay: 0.45 }}
              >
                marca
                <span>&amp;</span>
                negócio
              </motion.p>
            )}
          </AnimatePresence>

          {/* operador entre os círculos */}
          <motion.span
            className="venn__plus"
            aria-hidden="true"
            initial={false}
            animate={{ opacity: both ? 0 : 1, scale: both ? 0.4 : 1 }}
            transition={{ duration: 0.3 }}
          >
            +
          </motion.span>

          {/* textos (sempre visíveis; não dependem da interação) */}
          {items.map((it, i) => (
            <motion.div
              key={`label-${it.institution}`}
              className={`venn__label venn__label--${i}${active[i] ? ' is-on' : ''}`}
              aria-hidden="true"
              initial={false}
              animate={place(labelPos(i as 0 | 1))}
              transition={spring}
            >
              <span className="venn__note">{it.note}</span>
              <span className="venn__word">{it.word}</span>
              <span className="venn__degree">{it.degree}</span>
              <span className="venn__inst serif">{it.institution}</span>
            </motion.div>
          ))}
        </div>

        {/* resultado */}
        <div className="venn__result" aria-live="polite">
          <span className={`venn__eq${both ? ' is-on' : ''}`} aria-hidden="true">
            =
          </span>
          <div className="venn__result-body">
            <AnimatePresence mode="wait" initial={false}>
              {both ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.6, ease, delay: 0.35 }}
                >
                  <p className="venn__result-text">{education.result}</p>
                  <p className="venn__result-sub">{education.text}</p>
                </motion.div>
              ) : (
                <motion.p
                  key="placeholder"
                  className="venn__placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {active[0] || active[1] ? 'Falta uma parte da conta…' : '?'}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
