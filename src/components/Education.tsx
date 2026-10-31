import { motion } from 'motion/react'
import { education } from '../content/profile'
import { Eyebrow } from './SectionHead'
import { MaskLines, Reveal } from './ui/Reveal'
import './Education.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Education() {
  const [com, gest] = education.items
  return (
    <section id="formacao" className="section education" data-theme="light" aria-labelledby="formacao-title">
      <div className="container">
        <div className="education__head">
          <Eyebrow index="04" label={education.eyebrow} />
          <MaskLines
            id="formacao-title"
            className="h2 education__title"
            lines={[education.titleLead, education.titleAccent]}
            maskClass="education__title-mask"
            lineClass={(i) => `education__title-line${i === 1 ? ' serif-accent' : ''}`}
            stagger={0.12}
          />
        </div>

        {/* Equação: Comunicação + Gestão = marca e negócio na mesma conversa */}
        <div className="equation">
          {[com, gest].map((item, i) => (
            <motion.article
              key={item.institution}
              className={`degree degree--${i}`}
              initial={{ opacity: 0, y: 50, rotate: i === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, ease, delay: i * 0.15 }}
            >
              <p className="degree__note">{item.note}</p>
              <p className="degree__word" aria-hidden="true">
                {item.word}
              </p>
              <div className="degree__meta">
                <h3 className="degree__name">{item.degree}</h3>
                <p className="degree__inst serif">{item.institution}</p>
              </div>
            </motion.article>
          ))}

          <motion.span
            className="equation__op equation__op--plus"
            aria-hidden="true"
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.35 }}
          >
            +
          </motion.span>
        </div>

        <div className="equation__result">
          <motion.span
            className="equation__op equation__op--eq"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            =
          </motion.span>
          <Reveal delay={0.15}>
            <p className="equation__result-text">
              <span className="sr-only">Comunicação mais gestão: </span>
              {education.result}
            </p>
          </Reveal>
          <Reveal delay={0.25} className="equation__text">
            <p>{education.text}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
