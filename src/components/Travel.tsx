import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { travel } from '../content/profile'
import { Eyebrow } from './SectionHead'
import { Reveal, RevealWords } from './ui/Reveal'
import './Travel.css'

export function Travel() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30])
  const yB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [90, -70])
  const [a, b] = travel.photos

  return (
    <section
      id="fora-do-roteiro"
      ref={ref}
      className="section travel"
      data-theme="light"
      aria-labelledby="viagens-title"
    >
      <div className="container travel__grid">
        <div className="travel__text">
          <Eyebrow index="04" label={travel.eyebrow} />
          <RevealWords id="viagens-title" text={travel.title} className="h2 travel__title" accentFrom={3} />
          <Reveal delay={0.1}>
            <p className="lead travel__lead">{travel.text}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="travel__note">
              <i aria-hidden="true" /> Registros pessoais.
            </p>
          </Reveal>
        </div>

        <div className="travel__collage">
          <motion.figure className="polaroid polaroid--a" style={{ y: yA }}>
            <span className="polaroid__tape" aria-hidden="true" />
            <div className="polaroid__img">
              <img src={a.src} alt={a.alt} width={900} height={1125} loading="lazy" decoding="async" />
            </div>
            <figcaption>
              <span>{a.place}</span>
              <em>{a.caption}</em>
            </figcaption>
          </motion.figure>

          <motion.figure className="polaroid polaroid--b" style={{ y: yB }}>
            <div className="polaroid__img">
              <img src={b.src} alt={b.alt} width={900} height={1124} loading="lazy" decoding="async" />
            </div>
            <figcaption>
              <span>{b.place}</span>
              <em>{b.caption}</em>
            </figcaption>
          </motion.figure>

          <span className="travel__stamp" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <path id="stamp-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text>
                <textPath href="#stamp-circle">registro pessoal · fora do roteiro · </textPath>
              </text>
            </svg>
            <b className="serif">YM</b>
          </span>
        </div>
      </div>
    </section>
  )
}
