import { motion, type HTMLMotionProps } from 'motion/react'
import { Fragment, useMemo, type ElementType, type ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

/** Entrada simples ao rolar (deslocamento curto + opacidade). */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type WordsProps = {
  id?: string
  text: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  /** classe aplicada a palavras específicas (por índice) */
  accentFrom?: number
  accentClass?: string
}

/**
 * Título revelado palavra a palavra por máscara (a palavra "sobe" de dentro
 * de uma janela com overflow). O texto completo fica disponível a leitores
 * de tela via aria-label; as palavras animadas ficam ocultas a eles.
 */
export function RevealWords({
  id,
  text,
  as: Tag = 'h2',
  className,
  delay = 0,
  stagger = 0.045,
  accentFrom,
  accentClass = 'serif-accent',
}: WordsProps) {
  const words = text.split(' ')
  return (
    <Tag id={id} className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        style={{ display: 'inline' }}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
          <span className="mask-word">
            <motion.span
              className={accentFrom !== undefined && i >= accentFrom ? accentClass : undefined}
              style={{ display: 'inline-block' }}
              variants={{
                hidden: { y: '108%', rotate: 2 },
                show: { y: '0%', rotate: 0, transition: { duration: 0.9, ease } },
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  )
}

/**
 * Linhas reveladas por máscara. O gatilho (whileInView) fica no elemento pai:
 * observar o próprio elemento mascarado não funciona, porque ele começa
 * totalmente recortado pela máscara e nunca "intersecta" a viewport.
 */
export function MaskLines({
  id,
  lines,
  as: Tag = 'h2',
  className,
  lineClass,
  maskClass,
  stagger = 0.1,
}: {
  id?: string
  lines: string[]
  as?: ElementType
  className?: string
  lineClass?: (i: number) => string
  maskClass: string
  stagger?: number
}) {
  const MotionTag = useMemo(() => motion.create(Tag), [Tag])
  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ staggerChildren: stagger }}
    >
      {lines.map((l, i) => (
        <span className={maskClass} key={l}>
          <motion.span
            className={lineClass?.(i)}
            style={{ display: 'block' }}
            variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1, ease } } }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
