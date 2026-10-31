import { useEffect, useState } from 'react'

/**
 * Observa as seções e devolve:
 *  - active: seção que ocupa o centro da tela (para o índice lateral)
 *  - themeAtTop: tema (light/dark/signal) da seção sob o header
 */
export function useActiveSection(ids: readonly string[], headerOffset = 40) {
  const [active, setActive] = useState(ids[0])
  const [themeAtTop, setThemeAtTop] = useState<string>('light')
  const [activeTheme, setActiveTheme] = useState<string>('light')

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return

    let raf = 0
    const update = () => {
      raf = 0
      const mid = window.innerHeight * 0.45
      let current = els[0]
      let topTheme = 'light'
      for (const el of els) {
        const r = el.getBoundingClientRect()
        if (r.top <= mid) current = el
        if (r.top <= headerOffset && r.bottom > headerOffset) topTheme = el.dataset.theme ?? 'light'
      }
      // Sub-blocos com tema próprio (ex.: faixa escura dentro de uma seção)
      document.querySelectorAll<HTMLElement>('[data-theme-zone]').forEach((z) => {
        const r = z.getBoundingClientRect()
        if (r.top <= headerOffset && r.bottom > headerOffset) topTheme = z.dataset.themeZone ?? topTheme
      })
      setActive(current.id)
      setActiveTheme(current.dataset.theme ?? 'light')
      setThemeAtTop(topTheme)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ids, headerOffset])

  return { active, themeAtTop, activeTheme }
}
