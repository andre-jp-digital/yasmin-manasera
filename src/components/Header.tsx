import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { contact, nav, person } from '../content/profile'
import { useIntro } from '../hooks/IntroContext'
import './Header.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Header({ active, theme }: { active: string; theme: string }) {
  const { homeVisible, cameFromIntro, phase } = useIntro()
  const introOpen = phase === 'intro' || phase === 'reveal'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menu mobile: trava rolagem, Esc fecha, foco entra e volta.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.classList.add('is-locked')
    firstLinkRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      root.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
      btnRef.current?.focus()
    }
  }, [open])

  const menuTheme = open ? 'dark' : theme

  return (
    <>
      <motion.header
        className={`header${scrolled ? ' is-scrolled' : ''}`}
        data-theme={menuTheme}
        inert={introOpen}
        initial={{ y: '-110%' }}
        animate={{ y: homeVisible ? '0%' : '-110%' }}
        transition={{ duration: 0.9, ease, delay: homeVisible && cameFromIntro ? 1.1 : 0.2 }}
      >
        <a href="#inicio" className="header__brand" aria-label={`${person.fullName} — início`}>
          <span className="header__mono serif" aria-hidden="true">
            Y<span>M</span>
            <i>.</i>
          </span>
          <span className="header__brand-text">
            <strong>{person.fullName}</strong>
            <span>Estratégia · Marketing · Vendas</span>
          </span>
        </a>

        <nav className="header__nav" aria-label="Seções">
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`header__link${item.id === 'contato' ? ' header__link--cta' : ''}`}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  <span className="header__link-index">{item.index}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={btnRef}
          type="button"
          className="header__menu-btn"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? 'Fechar' : 'Menu'}</span>
          <span className={`header__burger${open ? ' is-open' : ''}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <ol className="menu__list">
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.05 }}
                >
                  <a ref={i === 0 ? firstLinkRef : undefined} href={`#${item.id}`} onClick={() => setOpen(false)}>
                    <span className="menu__index">{item.index}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ol>
            <div className="menu__contact">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
