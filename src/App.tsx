import { MotionConfig } from 'motion/react'
import { Career } from './components/Career'
import { Contact } from './components/Contact'
import { Contribution } from './components/Contribution'
import { Education } from './components/Education'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { SideRail } from './components/SideRail'
import { Thinking } from './components/Thinking'
import { Ticker } from './components/Ticker'
import { Travel } from './components/Travel'
import { sections } from './content/profile'
import { IntroProvider, useIntro } from './hooks/IntroContext'
import { useActiveSection } from './hooks/useActiveSection'

const SECTION_IDS = sections.map((s) => s.id)

function Site() {
  const { phase } = useIntro()
  const { active, themeAtTop, activeTheme } = useActiveSection(SECTION_IDS)
  const introOpen = phase === 'intro' || phase === 'reveal'

  return (
    <>
      {!introOpen && (
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
      )}
      <Intro />
      <Header active={active} theme={themeAtTop} />
      <SideRail active={active} theme={activeTheme} />
      <main id="conteudo" className="page" inert={introOpen}>
        <Hero />
        <Ticker />
        <Thinking />
        <Career />
        <Contribution />
        <Education />
        <Travel />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <IntroProvider>
        <Site />
      </IntroProvider>
    </MotionConfig>
  )
}
