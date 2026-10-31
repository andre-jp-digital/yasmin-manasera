import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { thinking } from '../content/profile'
import { useFinePointer } from '../hooks/useMediaQuery'
import { Eyebrow } from './SectionHead'
import { Reveal, RevealWords } from './ui/Reveal'
import { Arrow } from './ui/Arrow'
import './Thinking.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Thinking() {
  const [active, setActive] = useState(0)
  const fine = useFinePointer()
  const uid = useId()
  const titleWords = `${thinking.titleLead} ${thinking.titleAccent}`
  const accentFrom = thinking.titleLead.split(' ').length

  return (
    <section id="pensamento" className="section thinking" data-theme="dark" aria-labelledby="pensamento-title">
      <div className="container">
        <div className="thinking__intro">
          <div className="thinking__title-col">
            <Eyebrow index="01" label={thinking.eyebrow} />
            <RevealWords
              id="pensamento-title"
              text={titleWords}
              className="h2 thinking__title"
              accentFrom={accentFrom}
              accentClass="serif-accent thinking__accent"
            />
          </div>

          <div className="thinking__text-col">
            <Reveal>
              <p className="thinking__qintro">{thinking.questionsIntro}</p>
            </Reveal>
            <ol className="thinking__questions">
              {thinking.questions.map((q, i) => (
                <motion.li
                  key={q}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.06 }}
                >
                  <span className="thinking__qnum">{String(i + 1).padStart(2, '0')}</span>
                  <span className="thinking__q">
                    {q.replace(/\?$/, '')}
                    <b>?</b>
                  </span>
                </motion.li>
              ))}
            </ol>
            <Reveal delay={0.1}>
              <p className="thinking__closing">{thinking.closing}</p>
            </Reveal>
          </div>
        </div>

        {/* ---------- Quatro verbos, um método ---------- */}
        <div className="verbs">
          <div className="verbs__head">
            <p className="verbs__label">Quatro verbos, um método</p>
            <p className="verbs__hint">
              {fine ? 'Passe o cursor ou clique em cada verbo' : 'Toque em cada verbo'}
            </p>
          </div>

          <div className="verbs__grid">
            <ul className="verbs__list" role="list">
              {thinking.verbs.map((v, i) => {
                const isActive = i === active
                return (
                  <li key={v.word} className={`verbs__item${isActive ? ' is-active' : ''}`}>
                    <button
                      type="button"
                      className="verbs__btn"
                      aria-expanded={isActive}
                      aria-controls={`${uid}-panel-${i}`}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => fine && setActive(i)}
                      onFocus={() => setActive(i)}
                    >
                      <span className="verbs__num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="verbs__word">{v.word}</span>
                      <span className="verbs__arrow" aria-hidden="true">
                        <Arrow size={40} stroke={1.4} />
                      </span>
                    </button>
                    {/* Mobile / tablet: texto logo abaixo do verbo ativo */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id={`${uid}-panel-${i}`}
                          className="verbs__inline"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease }}
                        >
                          <p>{v.text}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>

            {/* Desktop: painel de leitura fixo ao lado */}
            <div className="verbs__readout" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  className="verbs__readout-inner"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <span className="verbs__readout-num serif">{String(active + 1).padStart(2, '0')}</span>
                  <p className="verbs__readout-word">{thinking.verbs[active].word}</p>
                  <p className="verbs__readout-text">{thinking.verbs[active].text}</p>
                </motion.div>
              </AnimatePresence>
              <div className="verbs__dots" aria-hidden="true">
                {thinking.verbs.map((_, i) => (
                  <i key={i} className={i === active ? 'is-active' : undefined} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
