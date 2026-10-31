import { motion } from 'motion/react'

export function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <motion.p
      className="eyebrow"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="eyebrow__index">{index}</span>
      <span className="eyebrow__rule" aria-hidden="true" />
      <span>{label}</span>
    </motion.p>
  )
}
