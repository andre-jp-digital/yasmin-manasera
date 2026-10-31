import { motion } from 'motion/react'
import { career, type CareerChapter } from '../content/profile'
import { Eyebrow } from './SectionHead'
import { Reveal, RevealWords } from './ui/Reveal'
import { Arrow } from './ui/Arrow'
import './Career.css'

const ease = [0.22, 1, 0.36, 1] as const

function Chapter({ data, latest }: { data: CareerChapter; latest?: boolean }) {
  return (
    <article className={`chapter${latest ? ' chapter--latest' : ''}`} aria-labelledby={`ch-${data.yearsStart}`}>
      <div className="chapter__years" aria-hidden="true">
        <div className="chapter__years-inner">
          <motion.span
            className="chapter__year"
            initial={{ y: '40%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
          >
            {data.yearsStart}
          </motion.span>
          <span className="chapter__year-rule" />
          <motion.span
            className="chapter__year chapter__year--end"
            initial={{ y: '40%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.12 }}
          >
            {data.yearsEnd}
          </motion.span>
        </div>
      </div>

      <div className="chapter__body">
        <Reveal>
          <p className="chapter__label">
            <span>{data.chapter}</span>
            <span aria-hidden="true">·</span>
            <span>{data.theme}</span>
          </p>
          <h3 id={`ch-${data.yearsStart}`} className="chapter__company">
            {data.company}
          </h3>
          <p className="chapter__role">
            <strong>{data.role}</strong>
            <span>{data.period}</span>
          </p>
        </Reveal>

        {data.progression && (
          <Reveal delay={0.08}>
            <ol className="chapter__progression" aria-label="Evolução da atuação">
              {data.progression.map((step, i) => (
                <li key={step}>
                  <span className="chapter__step-num">{String.fromCharCode(65 + i)}</span>
                  <span>{step}</span>
                  {i < data.progression!.length - 1 && (
                    <span className="chapter__step-arrow" aria-hidden="true">
                      <Arrow size={22} />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <p className="chapter__summary">{data.summary}</p>
        </Reveal>

        <div className="chapter__groups">
          {data.groups.map((g, gi) => (
            <Reveal key={g.title} delay={0.1 + gi * 0.08} className="chapter__group">
              <h4>
                <span>{String(gi + 1).padStart(2, '0')}</span>
                {g.title}
              </h4>
              <ul>
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  )
}

export function Career() {
  const [first, second] = career.chapters
  return (
    <section id="trajetoria" className="section career" data-theme="light" aria-labelledby="trajetoria-title">
      <div className="container">
        <header className="career__head">
          <div>
            <Eyebrow index="02" label={career.eyebrow} />
            <RevealWords id="trajetoria-title" text={career.title} className="h2 career__title" accentFrom={4} />
          </div>
          <Reveal delay={0.15} className="career__intro">
            <p className="lead">{career.intro}</p>
          </Reveal>
        </header>

        <Chapter data={first} />
      </div>

      <div className="career__bridge" data-theme-zone="light">
        <div className="container career__bridge-inner">
          <span className="career__bridge-mark serif" aria-hidden="true">
            “
          </span>
          <RevealWords
            as="p"
            text={`${career.bridge.lead} ${career.bridge.accent}`}
            className="career__bridge-quote"
            accentFrom={career.bridge.lead.split(' ').length}
          />
          <Reveal delay={0.2}>
            <p className="career__bridge-text">{career.bridge.text}</p>
          </Reveal>
        </div>
      </div>

      <div className="container">
        <Chapter data={second} latest />
      </div>
    </section>
  )
}
