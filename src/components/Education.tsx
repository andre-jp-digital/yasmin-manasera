import { motion } from 'motion/react'
import { education } from '../content/profile'
import { Eyebrow } from './SectionHead'
import { MaskLines } from './ui/Reveal'
import './Education.css'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Formação como uma "conta armada": as duas formações somadas em coluna,
 * linha da soma e o resultado. Operadores (+ e =) no mesmo eixo vertical.
 */
export function Education() {
  const [com, gest] = education.items
  const rows = [
    { op: null, item: com, outline: false },
    { op: '+', item: gest, outline: true },
  ]

  return (
    <section id="formacao" className="section education" data-theme="light" aria-labelledby="formacao-title">
      <div className="container">
        <div className="education__head">
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

        <motion.div
          className="sum"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ staggerChildren: 0.18 }}
        >
          <p className="sr-only">
            Comunicação mais gestão é igual a {education.result}
          </p>

          {rows.map(({ op, item, outline }) => (
            <motion.article
              key={item.institution}
              className="sum__row"
              variants={{ hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
            >
              <span className="sum__op" aria-hidden="true">
                {op && <span className="sum__op-glyph">{op}</span>}
              </span>
              <p className={`sum__word${outline ? ' sum__word--outline' : ''}`} aria-hidden="true">
                {item.word}
              </p>
              <div className="sum__meta">
                <p className="sum__note">{item.note}</p>
                <h3 className="sum__degree">{item.degree}</h3>
                <p className="sum__inst serif">{item.institution}</p>
              </div>
            </motion.article>
          ))}

          {/* linha da soma */}
          <motion.div
            className="sum__rule"
            aria-hidden="true"
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } } }}
          />

          <motion.div
            className="sum__row sum__row--result"
            variants={{ hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
          >
            <span className="sum__op" aria-hidden="true">
              <span className="sum__op-glyph">=</span>
            </span>
            <p className="sum__result" aria-hidden="true">
              {education.result}
            </p>
            <p className="sum__text">{education.text}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
