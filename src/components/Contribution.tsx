import { motion } from 'motion/react'
import { useId, useState } from 'react'
import { contribution } from '../content/profile'
import { useFinePointer, useMediaQuery } from '../hooks/useMediaQuery'
import { Eyebrow } from './SectionHead'
import { Reveal, RevealWords } from './ui/Reveal'
import './Contribution.css'

/** Pictogramas geométricos — um por frente, mesmo vocabulário de traço. */
function Glyph({ i }: { i: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }
  return (
    <svg className="area__glyph" viewBox="0 0 120 120" aria-hidden="true">
      {i === 0 && (
        <g {...common}>
          <circle cx="52" cy="52" r="34" />
          <circle cx="52" cy="52" r="14" />
          <path d="M52 8v20M52 76v20M8 52h20M76 52h20M78 78l30 30" />
        </g>
      )}
      {i === 1 && (
        <g {...common}>
          <circle cx="40" cy="60" r="8" fill="currentColor" />
          <path d="M58 34a36 36 0 0 1 0 52M72 22a54 54 0 0 1 0 76M86 10a72 72 0 0 1 0 100" />
        </g>
      )}
      {i === 2 && (
        <g {...common}>
          <path d="M10 18h100M24 44h72M38 70h44M52 96h16" />
          <path d="M10 18l42 78M110 18L68 96" strokeDasharray="3 5" />
        </g>
      )}
      {i === 3 && (
        <g {...common}>
          <rect x="12" y="14" width="22" height="22" />
          <rect x="49" y="49" width="22" height="22" />
          <rect x="86" y="84" width="22" height="22" fill="currentColor" />
          <path d="M34 25h26v24M71 60h26v24" />
        </g>
      )}
    </svg>
  )
}

const CONNECT = ['Marketing', 'Vendas', 'Operação', 'Retenção']

export function Contribution() {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const fine = useFinePointer()
  const [active, setActive] = useState(0)
  const uid = useId()

  return (
    <section id="atuacao" className="section contribution" data-theme="light" aria-labelledby="atuacao-title">
      <div className="container">
        <Eyebrow index="03" label={contribution.eyebrow} />
        <RevealWords id="atuacao-title" text={contribution.title} className="h2 contribution__title" accentFrom={3} />

        <div className="contribution__sub">
          <Reveal>
            <p className="lead">{contribution.intro}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="connect" aria-label="Áreas analisadas em conjunto">
              {CONNECT.map((c, i) => (
                <li key={c}>
                  <span>{c}</span>
                  {i < CONNECT.length - 1 && <i aria-hidden="true" />}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className={`areas${desktop ? ' areas--interactive' : ''}`}>
          {contribution.areas.map((a, i) => {
            const isActive = !desktop || i === active
            const num = String(i + 1).padStart(2, '0')
            return (
              <motion.article
                key={a.title}
                className={`area area--${i}${isActive ? ' is-active' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                onMouseEnter={() => desktop && fine && setActive(i)}
              >
                <h3 className="area__heading">
                  {desktop ? (
                    <button
                      type="button"
                      className="area__toggle"
                      aria-expanded={isActive}
                      aria-controls={`${uid}-area-${i}`}
                      onClick={() => setActive(i)}
                      onFocus={() => setActive(i)}
                    >
                      <span className="area__num serif">{num}</span>
                      <span className="area__vertical" aria-hidden="true">
                        {a.short}
                      </span>
                      <span className="area__title">{a.title}</span>
                    </button>
                  ) : (
                    <span className="area__toggle">
                      <span className="area__num serif">{num}</span>
                      <span className="area__title">{a.title}</span>
                    </span>
                  )}
                </h3>
                <div id={`${uid}-area-${i}`} className="area__content" aria-hidden={desktop && !isActive ? true : undefined}>
                  <Glyph i={i} />
                  <p className="area__text">{a.text}</p>
                  <ul className="area__keywords" aria-label="Palavras-chave">
                    {a.keywords.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
