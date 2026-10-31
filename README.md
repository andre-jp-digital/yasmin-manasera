# Yasmin Manasera — Personal Brand Experience

Site pessoal de página única: abertura animada "Prazer", hero com fotografia
editorial P&B integrada às iniciais **Y** e **M**, trajetória, competências,
formação, registros pessoais e contato.

React 19 + TypeScript + Vite, com Motion para a coreografia. Sem framework de
CSS: tokens em variáveis CSS e um arquivo de estilos por componente.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
```

Build de produção e pré-visualização:

```bash
npm run build      # typecheck + build em dist/
npm run preview    # http://localhost:4173
```

Teste de fumaça (Playwright; requer `npm run preview` rodando em outro terminal):

```bash
npm run test:e2e
```

Ferramentas de revisão visual (geram PNGs em `screenshots/`):

```bash
node scripts/shoot.mjs intro 1440,900 390,844   # quadros da abertura
node scripts/shoot.mjs hero 1440,900 1024,768 390,844
node scripts/sections.mjs 1440,900 390,844      # cada seção na viewport
```

> Os scripts usam o pacote `playwright` disponível no ambiente. Em outra
> máquina: `npm i -D playwright && npx playwright install chromium`.

## Estrutura

```
src/
  content/profile.ts     ← TODO o texto, dados da trajetória, contatos, imagens
  styles/tokens.css      ← paleta, tipografia, espaçamento, movimento
  styles/base.css        ← reset, utilitários, botões, reduced-motion
  hooks/IntroContext.tsx ← fases da abertura + persistência na sessão
  components/
    Intro.tsx            ← abertura "Prazer"
    Hero.tsx             ← composição Y + foto + M
    Ticker / Thinking / Career / Contribution / Education / Travel / Contact
    Header / SideRail    ← navegação (header temático + trilho lateral)
    ui/Reveal.tsx        ← revelações por máscara (palavras, linhas)
src/assets/images/yasmin/← imagens web geradas (importadas em profile.ts)
assets-src/photos/       ← fotos originais + recorte (fonte do pipeline)
scripts/process_images.py← gera as imagens web a partir dos originais
```

Para editar textos, mexa só em `src/content/profile.ts`.

## Direção de arte (resumo)

- **Conceito:** "Prazer" como gesto de apresentação. O visitante diz
  "prazer" e o nome se completa como resposta. Depois, nome e iniciais
  viajam até a home.
- **Paleta:** papel `#F2EFE9`, tinta `#121212`, cinza quente, um
  **vermelho-sinal `#FF4B23`** (interação, destaque, pontos de atenção) e
  **blush `#F3C6B3`** como apoio de colagem.
- **Tipografia:** Archivo variável (peso 100–900 e largura 62–125%) para
  títulos e texto. Instrument Serif para as iniciais e os acentos editoriais.
  As duas são servidas localmente via Fontsource.
- **Hero:** retrato P&B saindo pelo topo de um bloco vermelho (quebra de
  moldura), com o **Y** sólido em preto à esquerda, sobre o vermelho, e o
  **M** como carimbo em primeiro plano à direita. Yasmin fica literalmente
  entre as iniciais. Regra de composição: nenhum elemento gráfico envolve ou
  toca a cabeça. Tudo é posicionado em coordenadas da própria foto (`.fig`).
- **Ritmo das seções:** papel → faixa-letreiro → tinta (pensamento) → papel
  com capítulos editoriais e uma faixa blush → branco com painéis-cartaz →
  papel com a "equação" da formação → colagem de viagem → vermelho (contato)
  → tinta (rodapé).

## Interações e movimento

- **Abertura:** letras sobem por máscara. O clique, toque, Enter ou Espaço em
  PRAZER completa o nome. Uma cortina de duas camadas (tinta e depois
  vermelho) sobe enquanto nome e iniciais fazem a transição de layout
  compartilhado até a hero. Duração após o clique: cerca de 2 s.
  - "Pular" (ou Esc) a qualquer momento.
  - A abertura não se repete na sessão (`sessionStorage`). "Rever a
    apresentação", no rodapé, a reabre.
  - Com `prefers-reduced-motion: reduce`, a abertura é pulada e as animações
    de deslocamento são desativadas.
- **Hero:** camadas gráficas reagem levemente ao cursor (só com mouse e sem
  redução de movimento). A foto fica parada.
- **Pensamento:** quatro verbos interativos (hover, clique, foco ou toque). No
  desktop há um painel lateral de leitura. No mobile, o texto aparece abaixo
  do verbo.
- **Atuação:** no desktop, os painéis se expandem por hover, clique ou foco.
  No mobile, todos ficam abertos.
- **Outros:** títulos revelados por máscara, header que muda de tema conforme
  a seção, trilho lateral com a seção atual e o progresso, polaroids com
  parallax discreto que ganham cor no hover, e "copiar e-mail".

## Integridade do conteúdo

Todas as informações profissionais vêm do currículo. **Não** há clientes,
números, resultados, depoimentos, logotipos ou certificações inventados. O
telefone usa `tel:` e **não** é convertido em WhatsApp. Não há formulário de
contato falso.

## O que ainda precisa ser fornecido ou confirmado

1. **Locais das fotos de viagem.** "Roma, Itália" foi deduzido pelos marcos
   visíveis: rio Tibre, cúpula de São Pedro, Castel e Ponte Sant'Angelo.
   Confirmar, e enviar outros países e fotos se quiser ampliar a seção
   (`travel.photos` em `profile.ts`).
2. **Assinatura em árabe no rodapé.** "Prazer em conhecer" está como
   «تشرفت بمعرفتك» (fonte Amiri). Vale uma revisão por um falante nativo,
   se possível.
3. **Fotografia editorial dedicada (opcional, recomendado).** O hero usa o
   retrato de estúdio fornecido, recortado com IA (BiRefNet, rodando
   localmente) e tratado em P&B. Um ensaio feito para o site ampliaria as
   possibilidades: fundo neutro, luz lateral, enquadramento até a cintura,
   uma versão com espaço livre acima da cabeça e outra de perfil ou três
   quartos. Recorte profissional (máscara de cabelo feita à mão) eliminaria
   pequenos fios com halo visíveis em fundos claros.
4. **Datas de formação (opcional).** O site não exibe anos nem status
   (concluído ou em andamento) de FGV e Wyden, porque não estavam
   documentados.
5. **Imagem de compartilhamento (og:image).** Precisa da URL final do domínio.
   Recomendado: 1200×630 com a composição da hero.
6. **WhatsApp (opcional).** Só adicionar se ela confirmar que o número usa o
   serviço.

## Trocar ou adicionar fotos

1. Coloque o original em `assets-src/photos/`.
2. Para o hero: gere o recorte bruto (instruções no topo de
   `scripts/process_images.py`), refine o matte do cabelo com
   `python3 scripts/refine_matte.py` e rode `python3 scripts/process_images.py`.
3. Se a nova foto tiver outro enquadramento, ajuste em `Hero.css`:
   - `--fig-h`, `--fig-left` e `--y-size`: tamanho da foto, posição e corpo do Y.
   - `--block-top`: topo do bloco e do Y (fração da altura da foto, abaixo
     do queixo).
