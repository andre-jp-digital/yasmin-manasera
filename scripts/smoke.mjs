// Teste de fumaça end-to-end (Playwright).
//   npm run build && npm run preview   (em outro terminal)
//   npm run test:e2e
// Variável opcional: URL=http://localhost:4173/
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const URL = process.env.URL ?? 'http://localhost:4173/'
const results = []
let failed = 0
const check = (name, ok, detail = '') => {
  results.push(`${ok ? '✔' : '✘'} ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failed++
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch()

async function newPage(opts = {}) {
  const { width = 1440, height = 900, reducedMotion = 'no-preference', skipIntro = false } = opts
  const mobile = width < 900
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion, hasTouch: mobile, isMobile: mobile })
  if (skipIntro) await ctx.addInitScript(() => sessionStorage.setItem('ym:intro-seen', '1'))
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(URL, { waitUntil: 'networkidle' })
  return { ctx, page, errors }
}

// 1. Abertura → clique em "Prazer" → home
{
  const { ctx, page, errors } = await newPage()
  check('abertura visível no primeiro acesso', await page.locator('.intro').isVisible())
  check('rolagem travada durante a abertura', await page.evaluate(() => document.documentElement.classList.contains('is-locked')))
  check('conteúdo inerte durante a abertura', await page.evaluate(() => document.getElementById('conteudo').inert === true))
  await wait(1200)
  await page.click('.intro__word')
  await page.waitForSelector('.intro', { state: 'detached', timeout: 4000 }).catch(() => {})
  check('abertura sai após "Prazer"', (await page.locator('.intro').count()) === 0)
  await wait(1500)
  check('home revelada com nome', await page.locator('#hero-title').isVisible())
  check('rolagem liberada', await page.evaluate(() => !document.documentElement.classList.contains('is-locked')))
  check('sessão marcada', await page.evaluate(() => sessionStorage.getItem('ym:intro-seen') === '1'))
  await page.reload({ waitUntil: 'networkidle' })
  await wait(400)
  check('abertura não repete na mesma sessão', (await page.locator('.intro').count()) === 0)
  check('sem erros de console (fluxo da abertura)', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// 2. Pular introdução + teclado
{
  const { ctx, page } = await newPage()
  await wait(600)
  await page.click('.intro__skip')
  await page.waitForSelector('.intro', { state: 'detached', timeout: 4000 }).catch(() => {})
  check('botão "Pular" funciona', (await page.locator('.intro').count()) === 0)
  await ctx.close()

  const k = await newPage()
  await wait(1200)
  await k.page.keyboard.press('Tab') // Pular
  await k.page.keyboard.press('Tab') // PRAZER
  const focused = await k.page.evaluate(() => document.activeElement?.className ?? '')
  check('PRAZER alcançável por teclado', focused.includes('intro__word'), focused)
  await k.page.keyboard.press('Enter')
  await k.page.waitForSelector('.intro', { state: 'detached', timeout: 4000 }).catch(() => {})
  check('Enter apresenta e entra', (await k.page.locator('.intro').count()) === 0)
  await k.ctx.close()

  const e = await newPage()
  await wait(500)
  await e.page.keyboard.press('Escape')
  await e.page.waitForSelector('.intro', { state: 'detached', timeout: 4000 }).catch(() => {})
  check('Esc pula a abertura', (await e.page.locator('.intro').count()) === 0)
  await e.ctx.close()
}

// 3. Movimento reduzido
{
  const { ctx, page } = await newPage({ reducedMotion: 'reduce' })
  await wait(300)
  check('prefers-reduced-motion pula a abertura', (await page.locator('.intro').count()) === 0)
  check('home visível com movimento reduzido', await page.locator('#hero-title').isVisible())
  await ctx.close()
}

// 4. Conteúdo, links e integridade
{
  const { ctx, page, errors } = await newPage({ skipIntro: true })
  await wait(800)
  const data = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    mailto: [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.getAttribute('href')),
    linkedin: [...document.querySelectorAll('a[href*="linkedin.com"]')].map((a) => [a.getAttribute('href'), a.target, a.rel]),
    tel: [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href')),
    whatsapp: document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').length,
    forms: document.querySelectorAll('form').length,
    imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.getAttribute('alt')).length,
    lazyHero: document.querySelector('.stage__photo')?.getAttribute('loading'),
    text: document.body.innerText,
    sectionIds: [...document.querySelectorAll('main section[id]')].map((s) => s.id),
    navTargetsOk: [...document.querySelectorAll('a[href^="#"]')].every((a) => !!document.getElementById(a.getAttribute('href').slice(1))),
  }))
  check('um único h1', data.h1 === 1, String(data.h1))
  check('mailto correto', data.mailto.length > 0 && data.mailto.every((h) => h === 'mailto:yasmin.manasera@gmail.com'))
  check(
    'LinkedIn correto (nova aba, noopener)',
    data.linkedin.length > 0 &&
      data.linkedin.every(([h, t, r]) => h === 'https://www.linkedin.com/in/yasmin-manasera-57046216a/' && t === '_blank' && r.includes('noopener')),
  )
  check('telefone como tel: (sem WhatsApp)', data.tel.includes('tel:+5592981171723') && data.whatsapp === 0)
  check('sem formulários falsos', data.forms === 0)
  check('todas as imagens com alt', data.imgsNoAlt === 0)
  check('foto principal sem lazy loading', data.lazyHero !== 'lazy')
  check('âncoras internas apontam para seções existentes', data.navTargetsOk)
  for (const t of ['V4 Company', 'Gestora de Projetos', 'B2B e B2C', 'out. 2026', 'تشرفت بمعرفتك', 'Grupo Maxma Modas', 'Gerente de Vendas', 'MBA em Gestão Empresarial', 'FGV', 'Wyden', 'Publicidade e Propaganda'])
    check(`conteúdo: "${t}"`, data.text.toLowerCase().includes(t.toLowerCase()))
  check('ordem das seções', data.sectionIds.join(',') === 'inicio,pensamento,trajetoria,formacao,fora-do-roteiro,contato', data.sectionIds.join(','))

  // Verbos: clique troca o painel
  await page.locator('#pensamento').scrollIntoViewIfNeeded()
  await page.locator('.verbs__btn').nth(2).click()
  await wait(500)
  const readout = await page.locator('.verbs__readout-word').innerText()
  check('verbo interativo por clique', /estruturar/i.test(readout), readout)

  // Formação: somar os dois círculos revela o resultado
  await page.locator('#formacao').scrollIntoViewIfNeeded()
  const before = await page.locator('.venn__result-text').count()
  await page.locator('.venn__circle').nth(0).click()
  await page.locator('.venn__circle').nth(1).click()
  await wait(1200)
  const pressed = await page.locator('.venn__circle[aria-pressed="true"]').count()
  const result = (await page.locator('.venn__result-text').count()) ? await page.locator('.venn__result-text').innerText() : ''
  check('formação: clicar nos dois círculos revela o resultado', before === 0 && pressed === 2 && /marca e negócio/.test(result), result)
  await page.locator('.venn__circle').nth(1).click()
  await wait(800)
  check('formação: desfazer esconde o resultado', (await page.locator('.venn__result-text').count()) === 0)

  // Rever a apresentação
  await page.locator('.footer__actions button').click()
  await wait(300)
  check('"Rever a apresentação" reabre a abertura', (await page.locator('.intro').count()) === 1)
  check('sem erros de console (conteúdo)', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// 5. Responsividade: sem rolagem horizontal + menu mobile
for (const [width, height] of [[1920, 1080], [1440, 900], [1024, 768], [768, 1024], [390, 844], [360, 740]]) {
  const { ctx, page } = await newPage({ width, height, skipIntro: true })
  await wait(600)
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  let maxOverflow = 0
  for (let y = 0; y < h; y += height) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
    await wait(120)
    maxOverflow = Math.max(maxOverflow, await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
  }
  check(`${width}×${height}: sem rolagem horizontal`, maxOverflow <= 0, `${maxOverflow}px`)
  if (width < 1024) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.click('.header__menu-btn')
    await wait(500)
    const open = await page.locator('#menu-mobile').isVisible()
    await page.keyboard.press('Escape')
    await wait(700)
    const closed = (await page.locator('#menu-mobile').count()) === 0
    check(`${width}×${height}: menu mobile abre e fecha (Esc)`, open && closed)
  }
  await ctx.close()
}

await browser.close()
console.log(results.join('\n'))
console.log(`\n${results.length - failed}/${results.length} verificações passaram`)
process.exit(failed ? 1 : 0)
