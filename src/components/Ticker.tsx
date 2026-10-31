import { useEffect, useRef, useState } from 'react'
import { ticker } from '../content/profile'
import './Ticker.css'

/**
 * Letreiro estático com efeito de neon/LED falhando.
 * Os termos acendem um a um quando a faixa entra na tela. Depois, só
 * alguns falham: um termo pisca de vez em quando e uma letra tem "mau
 * contato". Sem animação com prefers-reduced-motion.
 */
export function Ticker() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`sign${on ? ' is-on' : ''}`} data-theme-zone="dark">
      <ul className="sign__list" aria-label="Áreas de atuação">
        {ticker.map((item, i) => (
          <li
            key={item.text}
            className={`sign__item${i % 2 ? ' sign__item--serif' : ''}${item.flicker ? ' sign__item--flicker' : ''}`}
            style={
              {
                '--i': i,
                '--delay': `${2.2 + i * 0.6}s`,
              } as React.CSSProperties
            }
          >
            {i > 0 && <i className="sign__sep" aria-hidden="true" />}
            <span className="sign__text">
              {item.flaw === undefined ? (
                item.text
              ) : (
                <>
                  {item.text.slice(0, item.flaw)}
                  <span className="sign__flaw">{item.text[item.flaw]}</span>
                  {item.text.slice(item.flaw + 1)}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
