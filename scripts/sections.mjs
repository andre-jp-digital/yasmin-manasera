// Captura cada seção na viewport (sem abertura): node scripts/sections.mjs 1440,900 390,844
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const URL = process.env.URL ?? 'http://localhost:4173/'
mkdirSync('screenshots', { recursive: true })
const sizes = (process.argv.slice(2).length ? process.argv.slice(2) : ['1440,900']).map((s) => s.split(',').map(Number))
const ids = ['pensamento', 'trajetoria', 'formacao', 'fora-do-roteiro', 'contato']
const b = await chromium.launch()
const errors = []
for (const [width, height] of sizes) {
  const mobile = width < 900
  const ctx = await b.newContext({ viewport: { width, height }, hasTouch: mobile, isMobile: mobile })
  await ctx.addInitScript(() => sessionStorage.setItem('ym:intro-seen', '1'))
  const p = await ctx.newPage()
  p.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errors.push(`${m.type()}: ${m.text()}`))
  p.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  await p.goto(URL, { waitUntil: 'networkidle' })
  for (const id of ids) {
    const top = await p.evaluate((i) => document.getElementById(i).getBoundingClientRect().top + scrollY, id)
    const h = await p.evaluate((i) => document.getElementById(i).offsetHeight, id)
    let n = 0
    for (let y = top; y < top + h - 80 && n < 6; y += height - 60, n++) {
      await p.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
      await new Promise((r) => setTimeout(r, 1300))
      await p.screenshot({ path: `screenshots/sec-${width}-${id}-${n}.png` })
    }
  }
  await ctx.close()
}
console.log(errors.length ? errors.join('\n') : 'no console errors')
await b.close()
