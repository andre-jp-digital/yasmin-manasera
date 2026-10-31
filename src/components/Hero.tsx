import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { contact, hero, images, person } from '../content/profile'
import { useIntro } from '../hooks/IntroContext'
import { useFinePointer } from '../hooks/useMediaQuery'
import { Arrow } from './ui/Arrow'
import './Hero.css'

const ease = [0.22, 1, 0.36, 1] as const
const easeInOut = [0.76, 0, 0.24, 1] as const
const PAPER = '#f2efe9'
const INK = '#121212'

/** Camada gráfica que reage (pouco) ao cursor. */
function Depth({
  x,
  y,
  depth,
  className,
  children,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  depth: number
  className?: string
  children?: ReactNode
}) {
  const tx = useTransform(x, (v) => v * depth)
  const ty = useTransform(y, (v) => v * depth)
  return (
    <motion.div className={className} style={{ x: tx, y: ty }} aria-hidden="true">
      {children}
    </motion.div>
  )
}

export function Hero() {
  const { phase, homeVisible, cameFromIntro } = useIntro()
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const ref = useRef<HTMLElement>(null)

  // Elementos da composição entram depois que nome e iniciais pousam.
  const settleDelay = cameFromIntro ? 0.75 : 0.15
  const show = homeVisible

  // --- Interação com o cursor (somente mouse/trackpad, sem redução de movimento)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })
  const interactive = fine && !reduce && phase === 'done'

  useEffect(() => {
    const el = ref.current
    if (!el || !interactive) {
      mx.set(0)
      my.set(0)
      return
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2)
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2)
    }
    const onLeave = () => {
      mx.set(0)
      my.set(0)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [interactive, mx, my])

  const morphing = phase === 'morph'
  const nameTransition = { layout: { duration: 1, ease: easeInOut }, color: { duration: 0.9, ease } }

  /** Nome: com abertura, viaja da tela "Prazer"; sem ela, sobe por máscara. */
  const nameWord = (word: string, id: string, extra?: ReactNode) =>
    !show ? (
      <span className="hero__name-word" style={{ visibility: 'hidden' }}>
        {word}
        {extra}
      </span>
    ) : cameFromIntro ? (
      <motion.span
        layoutId={id}
        className="hero__name-word"
        initial={{ color: PAPER }}
        animate={{ color: INK }}
        transition={nameTransition}
      >
        {word}
        {extra}
      </motion.span>
    ) : (
      <span className="hero__name-mask">
        <motion.span
          className="hero__name-word"
          initial={{ y: '105%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 1, ease, delay: id === 'name-first' ? 0.1 : 0.2 }}
        >
          {word}
          {extra}
        </motion.span>
      </span>
    )

  const monogram = (letter: 'Y' | 'M', cls: string) =>
    !show ? (
      <span className={cls} style={{ visibility: 'hidden' }}>
        {letter}
      </span>
    ) : cameFromIntro ? (
      <motion.span
        layoutId={letter === 'Y' ? 'mono-y' : 'mono-m'}
        className={cls}
        initial={{ opacity: 0.35 }}
        animate={{ opacity: 1 }}
        transition={{ layout: { duration: 1.05, ease: easeInOut }, opacity: { duration: 0.9, delay: 0.2 } }}
      >
        {letter}
      </motion.span>
    ) : (
      <motion.span
        className={cls}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease, delay: letter === 'Y' ? 0.1 : 0.2 }}
      >
        {letter}
      </motion.span>
    )

  const enter = (delay: number, from: { x?: number; y?: number; scale?: number; rotate?: number } = {}) => ({
    initial: { opacity: 0, x: from.x ?? 0, y: from.y ?? 0, scale: from.scale ?? 1, rotate: from.rotate ?? 0 },
    animate: show
      ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
      : { opacity: 0, x: from.x ?? 0, y: from.y ?? 0, scale: from.scale ?? 1, rotate: from.rotate ?? 0 },
    transition: { duration: 1, ease, delay: settleDelay + delay },
  })

  return (
    <section
      id="inicio"
      ref={ref}
      className={`hero${morphing ? ' is-morphing' : ''}`}
      data-theme="light"
      aria-labelledby="hero-title"
    >
      {/* ---------- Cabeça: sobrelinha + nome ---------- */}
      <div className="hero__head">
        <motion.p className="hero__overline" {...enter(0.05, { x: -24 })}>
          <span>{hero.overline}</span>
          <span className="hero__overline-rule" aria-hidden="true" />
        </motion.p>
        <h1 id="hero-title" className="hero__name" aria-label={`${person.fullName}.`}>
          <span className="hero__name-line hero__name-line--first" aria-hidden="true">
            {nameWord(person.firstName, 'name-first')}
          </span>
          <span className="hero__name-line hero__name-line--last" aria-hidden="true">
            {nameWord(
              person.lastName,
              'name-last',
              <motion.span
                className="hero__name-dot"
                initial={{ scale: 0 }}
                animate={{ scale: show ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 14, delay: settleDelay + 0.25 }}
              >
                .
              </motion.span>,
            )}
          </span>
        </h1>
      </div>

      {/* ---------- Composição: Y · retrato · M ----------
          Princípio: nenhum elemento gráfico envolve ou toca a cabeça.
          O bloco vermelho fica atrás do corpo e a cabeça "sai" pelo topo
          (quebra de moldura); o Y fica à esquerda, abaixo da linha do queixo;
          o M é um carimbo em primeiro plano à direita. Tudo em .fig usa
          coordenadas da própria fotografia. */}
      <div className="hero__stage">
        <Depth x={sx} y={sy} depth={6} className="stage__layer stage__layer--block">
          <div className="fig">
            <motion.div
              className="stage__block"
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: show ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
              transition={{ duration: 1.1, ease: easeInOut, delay: settleDelay - 0.2 }}
            >
              <span className="stage__dots" />
              <span className="stage__crop stage__crop--tl" />
              <span className="stage__crop stage__crop--tr" />
            </motion.div>
          </div>
        </Depth>

        <Depth x={sx} y={sy} depth={-10} className="stage__layer stage__layer--mono">
          <div className="fig">{monogram('Y', 'stage__y serif')}</div>
        </Depth>

        <div className="stage__layer stage__layer--photo">
          <div className="fig">
            <motion.img
              className="stage__photo"
              src={images.heroCutout.src}
              srcSet={images.heroCutout.srcSet}
              sizes="(max-width: 900px) 100vw, 52vw"
              width={images.heroCutout.width}
              height={images.heroCutout.height}
              alt={images.heroCutout.alt}
              fetchPriority="high"
              decoding="async"
              initial={{ clipPath: 'inset(100% 0% 0% 0%)', y: 40 }}
              animate={show ? { clipPath: 'inset(0% 0% 0% 0%)', y: 0 } : { clipPath: 'inset(100% 0% 0% 0%)', y: 40 }}
              transition={{ duration: 1.2, ease: easeInOut, delay: settleDelay }}
            />
          </div>
        </div>

        <Depth x={sx} y={sy} depth={12} className="stage__layer stage__layer--mono stage__layer--m">
          <div className="stage__m-box">{monogram('M', 'stage__m serif')}</div>
        </Depth>
      </div>

      {/* ---------- Corpo: posicionamento + CTAs ---------- */}
      <div className="hero__body">
        <motion.p className="hero__statement" {...enter(0.15, { y: 24 })}>
          {hero.statementLead} <span className="hero__statement-accent">{hero.statementAccent}</span>
        </motion.p>
        <motion.p className="hero__desc" {...enter(0.25, { y: 24 })}>
          {hero.description}
        </motion.p>
        <motion.div className="hero__ctas" {...enter(0.35, { y: 24 })}>
          <a className="btn btn--primary" href="#trajetoria">
            {hero.ctaPrimary} <Arrow dir="down" />
          </a>
          <a className="btn btn--ghost" href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
            {hero.ctaSecondary} <Arrow />
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
        </motion.div>
      </div>

    </section>
  )
}
