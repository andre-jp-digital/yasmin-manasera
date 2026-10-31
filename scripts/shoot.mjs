// Capturas para revisão visual.
//   node scripts/shoot.mjs intro          -> sequência da abertura (desktop)
//   node scripts/shoot.mjs hero [w,h ...] -> hero em várias telas (sem abertura)
//   node scripts/shoot.mjs full [w,h ...] -> página inteira
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const URL = process.env.URL ?? 'http://localhost:4173/'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })
const [mode = 'hero', ...sizes] = process.argv.slice(2)
const viewports = (sizes.length ? sizes : ['1440,900', '1024,768', '390,844']).map((s) => {
  const [width, height] = s.split(',').map(Number)
  return { width, height }
})

const browser = await chromium.launch()
const errors = []
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function open(viewport, { skipIntro }) {
  const mobile = viewport.width < 900
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: mobile, isMobile: mobile })
  if (skipIntro) await ctx.addInitScript(() => sessionStorage.setItem('ym:intro-seen', '1'))
  const page = await ctx.newPage()
  const tag = `${viewport.width}x${viewport.height}`
  page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errors.push(`[${tag}] ${m.type()}: ${m.text()}`))
  page.on('pageerror', (e) => errors.push(`[${tag}] pageerror: ${e.message}`))
  await page.goto(URL, { waitUntil: 'networkidle' })
  return { ctx, page, tag }
}

if (mode === 'intro') {
  for (const vp of viewports) {
    const { ctx, page, tag } = await open(vp, { skipIntro: false })
    await wait(1900)
    await page.screenshot({ path: `${OUT}/intro-${tag}-1.png` })
    await page.click('.intro__word')
    for (const [i, ms] of [[2, 450], [3, 650], [4, 350], [5, 400], [6, 2000]]) {
      await wait(ms)
      await page.screenshot({ path: `${OUT}/intro-${tag}-${i}.png` })
    }
    await ctx.close()
  }
} else {
  for (const vp of viewports) {
    const { ctx, page, tag } = await open(vp, { skipIntro: true })
    await wait(2600)
    if (mode === 'full') {
      // rola até o fim para disparar as animações de entrada
      const h = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < h; y += Math.round(vp.height * 0.6)) {
        await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
        await wait(260)
      }
      await wait(900)
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await wait(500)
      await page.screenshot({ path: `${OUT}/full-${tag}.png`, fullPage: true })
    } else {
      await page.screenshot({ path: `${OUT}/hero-${tag}.png` })
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    if (overflow > 0) errors.push(`[${tag}] horizontal overflow: ${overflow}px`)
    await ctx.close()
  }
}

console.log(errors.length ? errors.join('\n') : 'no console errors / no overflow')
await browser.close()
