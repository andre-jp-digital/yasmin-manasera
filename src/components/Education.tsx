import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { education } from '../content/profile'
import { useFinePointer } from '../hooks/useMediaQuery'
import { Eyebrow } from './SectionHead'
import { Arrow } from './ui/Arrow'
import { RevealWords } from './ui/Reveal'
import './Education.css'

const ease = [0.22, 1, 0.36, 1] as const
type Sym = 'C' | 'G' | 't'
const ORDER: Sym[] = ['C', 'G', 't']

/** Sinal de integral desenhado em SVG (a fonte não tem o glifo ∫). */
function Integral({ draw }: { draw: boolean }) {
  return (
    <svg className="eq__int-svg" viewBox="0 0 60 200" aria-hidden="true">
      <motion.path
        d="M50 16 C47 5 35 4 32 18 C29 34 30 60 29 100 C28 140 30 166 27 182 C24 196 12 196 10 185"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: draw ? 1 : 0 }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.circle cx="51" cy="17" r="5.5" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: draw ? 1 : 0 }} transition={{ delay: 1, duration: 0.3 }} />
      <motion.circle cx="9" cy="184" r="5.5" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: draw ? 1 : 0 }} transition={{ delay: 1, duration: 0.3 }} />
    </svg>
  )
}

export function Education() {
  const fine = useFinePointer()
  const [focus, setFocus] = useState<Sym | null>(null)
  // passo da resolução: 0 = não resolvida · 1..3 = validando C, G, t · 4 = resolvida
  const [step, setStep] = useState(0)
  const [inView, setInView] = useState(false)
  const timers = useRef<number[]>([])
  const solved = step === 4
  const solving = step > 0 && step < 4

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Demonstração passo a passo: C → G → t → R (cada passo fica ~2,6 s na tela)
  const STEP_MS = 2600
  const solve = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setFocus(null)
    setStep(1)
    ;[2, 3, 4].forEach((n, i) => timers.current.push(window.setTimeout(() => setStep(n), STEP_MS * (i + 1))))
  }
  const skip = () => {
    timers.current.forEach(clearTimeout)
    setStep(4)
  }
  const reset = () => {
    timers.current.forEach(clearTimeout)
    setStep(0)
  }

  // variável já validada na resolução (C no passo ≥2, G ≥3, t ≥4)
  const validated = (s: Sym) => step > ORDER.indexOf(s) + 1
  // variável em destaque: foco do usuário ou a que está sendo validada agora
  const isLit = (s: Sym) => focus === s || (solving && ORDER[step - 1] === s)

  const renderVar = (s: Sym) => (
    <button
      type="button"
      className={`eq__var${isLit(s) ? ' is-lit' : ''}${validated(s) ? ' is-ok' : ''}`}
      onMouseEnter={() => fine && setFocus(s)}
      onMouseLeave={() => fine && setFocus(null)}
      onFocus={() => setFocus(s)}
      onBlur={() => setFocus(null)}
      onClick={() => setFocus((f) => (f === s ? null : s))}
      aria-describedby={`eq-def-${s}`}
      aria-label={`Variável ${s}`}
    >
      {s}
    </button>
  )

  return (
    <section id="formacao" className="section education" data-theme="light" aria-labelledby="formacao-title">
      <div className="container">
        <div className="education__head">
          <Eyebrow index="03" label={education.eyebrow} />
          <RevealWords id="formacao-title" text={education.title} className="h2 education__title" accentFrom={5} />
        </div>

        <motion.div
          className={`eq${solved ? ' is-solved' : ''}`}
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, margin: '0px 0px -20% 0px' }}
        >
          <p className="sr-only">{education.equationSpoken}</p>

          {/* ---------- Equação ---------- */}
          <div className="eq__paper">
            <div className="eq__row">
            <div className="eq__line">
              <span className={`eq__r${solved ? ' is-ok' : ''}`} aria-hidden="true">
                R
                {!solved && <span className="eq__r-q">?</span>}
              </span>
              <span className="eq__op" aria-hidden="true">
                =
              </span>
              <span className="eq__int" aria-hidden="true">
                <Integral draw={inView} />
                <span className="eq__lim eq__lim--to">{education.limits.to}</span>
                <span className="eq__lim eq__lim--from">{education.limits.from}</span>
              </span>
              <span className="eq__paren" aria-hidden="true">
                (
              </span>
              {renderVar('C')}
              <span className="eq__op eq__op--dot" aria-hidden="true">
                ·
              </span>
              {renderVar('G')}
              <span className="eq__paren" aria-hidden="true">
                )
              </span>
              <span className="eq__d" aria-hidden="true">
                d
              </span>
              {renderVar('t')}
            </div>
            <span className="eq__num" aria-hidden="true">
              (1)
            </span>
            </div>

            {/* ---------- Resolução: no mesmo lugar onde o olhar está ---------- */}
            <div className="eq__cta-zone" aria-live="polite">
              {step > 0 && (
                <ol className="eq__progress" aria-label="Etapas da resolução">
                  {(['C', 'G', 't', 'R'] as const).map((k, i) => (
                    <li key={k} className={solved || step > i + 1 ? 'is-done' : step === i + 1 ? 'is-current' : undefined}>
                      <span className="serif">{k}</span>
                      {step === i + 1 && i < 3 && (
                        <motion.i
                          key={`bar-${step}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                        />
                      )}
                    </li>
                  ))}
                </ol>
              )}
              <AnimatePresence mode="wait" initial={false}>
                {solving ? (
                  <motion.div
                    key={`step-${step}`}
                    className="eq__step"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.55, ease }}
                  >
                    {(() => {
                      const v = education.variables[step - 1]
                      return (
                        <>
                          <p className="eq__step-head">
                            <span className="eq__step-sym serif">{v.symbol}</span>
                            <span className="eq__step-eq">=</span>
                            <span className="eq__step-name">{v.name}</span>
                          </p>
                          <p className="eq__step-kind">{v.kind}</p>
                          <p className="eq__step-detail">{v.detail}</p>
                          <p className="eq__step-source serif">{v.source}</p>
                        </>
                      )
                    })()}
                    <button type="button" className="eq__skip" onClick={skip}>
                      Pular para o resultado <Arrow size={14} />
                    </button>
                  </motion.div>
                ) : solved ? (
                  <motion.div
                    key="r"
                    className="eq__result-inner"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.8, ease }}
                  >
                    <p className="eq__step-head eq__step-head--r">
                      <span className="eq__step-sym serif">R</span>
                      <span className="eq__step-eq">=</span>
                      <span className="eq__step-name">Resultado da prática</span>
                    </p>
                    <p className="eq__result-line">
                      <span className="eq__therefore" role="img" aria-label="portanto">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="eq__result-text">{education.result}</span>
                    </p>
                    <p className="eq__result-sub">{education.text}</p>
                    <button type="button" className="eq__redo" onClick={reset}>
                      Refazer o cálculo <Arrow dir="up" size={16} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cta"
                    className="eq__cta-wrap"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <button type="button" className="eq__cta" onClick={solve}>
                      <span className="eq__cta-chip serif" aria-hidden="true">
                        R = ?
                      </span>
                      <span className="eq__cta-label">Resolver a equação</span>
                      <span className="eq__cta-arrow" aria-hidden="true">
                        <Arrow size={20} />
                      </span>
                    </button>
                    <p className="eq__cta-hint">Descubra o valor de R, variável por variável</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ---------- Legenda ("onde:") ---------- */}
          <div className="eq__where">
            <p className="eq__where-label serif">onde:</p>
            <dl className="eq__defs">
              {education.variables.map((v) => {
                const s = v.symbol as Sym
                return (
                  <div
                    key={s}
                    id={`eq-def-${s}`}
                    className={`eq__def${isLit(s) ? ' is-lit' : ''}${validated(s) ? ' is-ok' : ''}`}
                    onMouseEnter={() => fine && setFocus(s)}
                    onMouseLeave={() => fine && setFocus(null)}
                  >
                    <dt>
                      <span className="eq__def-sym serif">{s}</span>
                      <span className="eq__def-eq">=</span>
                      <span className="eq__def-name">{v.name}</span>
                    </dt>
                    <dd>
                      <span className="eq__def-kind">{v.kind}</span>
                      <span className="eq__def-detail">{v.detail}</span>
                      <span className="eq__def-source serif">{v.source}</span>
                    </dd>
                    <span className="eq__check" aria-hidden="true" />
                  </div>
                )
              })}
            </dl>
            <p className={`eq__dt${isLit('t') ? ' is-lit' : ''}`}>
              <span className="eq__dt-sym serif" aria-hidden="true">
                d<i>t</i>
              </span>
              <span className="eq__def-eq" aria-hidden="true">
                =
              </span>
              <span>
                <span className="sr-only">d t: </span>
                {education.dtNote}
              </span>
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
