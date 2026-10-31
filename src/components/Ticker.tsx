import { ticker } from '../content/profile'
import './Ticker.css'

/** Faixa publicitária entre a hero e a seção escura. Decorativa para leitores de tela. */
export function Ticker() {
  const items = [...ticker, ...ticker]
  return (
    <div className="ticker" data-theme-zone="dark" aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((k) => (
          <ul className="ticker__group" key={k}>
            {items.map((t, i) => (
              <li key={i}>
                <span>{t}</span>
                <i className="ticker__sep" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
