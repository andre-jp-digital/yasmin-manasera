import { useState } from 'react'
import { closing, contact, person } from '../content/profile'
import { useIntro } from '../hooks/IntroContext'
import { Eyebrow } from './SectionHead'
import { MaskLines, Reveal } from './ui/Reveal'
import { Arrow } from './ui/Arrow'
import './Contact.css'

export function Contact() {
  const { replay } = useIntro()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  const lines = [closing.titleA, closing.titleB, closing.titleC]

  return (
    <>
      <section id="contato" className="section contact" data-theme="signal" aria-labelledby="contato-title">
        <div className="container">
          <Eyebrow index="05" label={closing.eyebrow} />
          <MaskLines
            id="contato-title"
            className="contact__title"
            lines={lines}
            maskClass="contact__mask"
            lineClass={(i) => `contact__line contact__line--${i}`}
          />

          <div className="contact__grid">
            <Reveal className="contact__text">
              <p>{closing.text}</p>
            </Reveal>

            <Reveal delay={0.1} className="contact__primary">
              <a className="contact__email" href={`mailto:${contact.email}`}>
                <span className="contact__email-label">Escreva para</span>
                <span className="contact__email-addr">
                  {contact.email.split('@')[0]}@<wbr />
                  {contact.email.split('@')[1]}
                </span>
                <span className="contact__email-arrow" aria-hidden="true">
                  <Arrow size={28} />
                </span>
              </a>
              <button type="button" className="contact__copy" onClick={copy} aria-live="polite">
                {copied ? 'E-mail copiado ✓' : 'Copiar e-mail'}
              </button>
            </Reveal>
          </div>

          <ul className="contact__list">
            <li>
              <span className="contact__k">E-mail</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <span className="contact__k">LinkedIn</span>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                {contact.linkedinLabel} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <span className="contact__k">Telefone</span>
              <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            </li>
          </ul>
        </div>
      </section>

      <footer className="footer" data-theme-zone="dark">
        <div className="footer__mono">
          <span className="footer__letter serif" aria-hidden="true">
            Y
          </span>
          <p className="footer__arabic" lang="ar" dir="rtl" title={closing.signoffTranslation}>
            {closing.signoffArabic}
            <span className="sr-only" lang="pt-BR" dir="ltr">
              {' '}
              ({closing.signoffTranslation})
            </span>
          </p>
          <span className="footer__letter serif" aria-hidden="true">
            M
          </span>
        </div>
        <div className="footer__row">
          <div className="footer__actions">
            <button type="button" onClick={replay}>
              Rever a apresentação <span aria-hidden="true">↺</span>
            </button>
            <a href="#inicio">
              Voltar ao topo <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} {person.fullName}</span>
          <span>Estratégia · Marketing · Vendas</span>
        </div>
      </footer>
    </>
  )
}
