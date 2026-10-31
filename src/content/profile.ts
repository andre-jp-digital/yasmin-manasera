import imgHero1100 from '../assets/images/yasmin/yasmin-hero-recorte-pb-1100.webp'
import imgHero640 from '../assets/images/yasmin/yasmin-hero-recorte-pb-640.webp'
import imgTibre from '../assets/images/yasmin/viagem-roma-tibre.webp'
import imgCastel from '../assets/images/yasmin/viagem-roma-castel-santangelo.webp'

/**
 * Conteúdo do site — fonte única.
 *
 * Todas as informações profissionais vêm do currículo de Yasmin Manasera.
 * Regra do projeto: não adicionar clientes, números, resultados, cargos,
 * certificações ou depoimentos que não estejam documentados.
 */

export const person = {
  firstName: 'Yasmin',
  lastName: 'Manasera',
  fullName: 'Yasmin Manasera',
}

export const contact = {
  email: 'yasmin.manasera@gmail.com',
  linkedin: 'https://www.linkedin.com/in/yasmin-manasera-57046216a/',
  linkedinLabel: 'in/yasmin-manasera',
  phoneDisplay: '+55 (92) 98117-1723',
  phoneHref: 'tel:+5592981171723',
  /** WhatsApp confirmado, com mensagem inicial pronta */
  whatsapp:
    'https://wa.me/5592981171723?text=Ol%C3%A1%20Yasmin%2C%20vi%20seu%20site%20e%20gostaria%20de%20entrar%20em%20contato.',
}

export const nav = [
  { id: 'pensamento', label: 'Pensamento', index: '01' },
  { id: 'trajetoria', label: 'Trajetória', index: '02' },
  { id: 'formacao', label: 'Formação', index: '03' },
  { id: 'contato', label: 'Contato', index: '05' },
] as const

/** Todas as seções (usado pelo índice lateral). */
export const sections = [
  { id: 'inicio', label: 'Prazer', index: '00' },
  { id: 'pensamento', label: 'Pensamento', index: '01' },
  { id: 'trajetoria', label: 'Trajetória', index: '02' },
  { id: 'formacao', label: 'Formação', index: '03' },
  { id: 'fora-do-roteiro', label: 'Fora do roteiro', index: '04' },
  { id: 'contato', label: 'Contato', index: '05' },
] as const

export const hero = {
  overline: 'Prazer, eu sou',
  statementLead: 'Conecto estratégia, marketing e vendas para transformar desafios de negócio em',
  statementAccent: 'planos de ação.',
  description:
    'Diagnóstico de negócios, estratégia comercial e marketing orientado a resultado — do entendimento do problema ao acompanhamento da execução.',
  ctaPrimary: 'Conhecer a trajetória',
  ctaSecondary: 'Vamos conversar',
}

/**
 * Letreiro estático (efeito de neon/LED com falha).
 * Só alguns termos falham — o resto fica aceso e estável.
 * `flicker`: o termo inteiro pisca de vez em quando.
 * `flaw`: índice de uma única letra com "mau contato".
 */
export const ticker: { text: string; flicker?: boolean; flaw?: number }[] = [
  { text: 'Diagnóstico de negócios' },
  { text: 'Estratégias de marketing' },
  { text: 'Branding', flicker: true },
  { text: 'Copywriting', flaw: 4 },
  { text: 'Gestão de Projetos' },
]

export const thinking = {
  eyebrow: 'Maneira de pensar',
  titleLead: 'Antes de encontrar a resposta, é preciso entender',
  titleAccent: 'a pergunta.',
  lead:
    'Minha experiência foi construída em ambientes que exigiam ler cenários, analisar informações, identificar problemas e organizar ações — do varejo à liderança de equipes, das vendas B2B e B2C à gestão de contas, projetos e consultoria.',
  questionsIntro: 'Por isso, antes de propor uma solução, procuro entender o negócio por inteiro:',
  questions: [
    'O que a empresa vende — e para quem?',
    'Como ela atrai clientes?',
    'Como as equipes executam?',
    'Onde as oportunidades se perdem?',
    'O que, de fato, está impedindo o resultado?',
  ],
  closing: 'Marketing, vendas e operação não funcionam isoladamente. A estratégia também não deveria.',
  verbs: [
    {
      word: 'Diagnosticar',
      text: 'Olhar marketing, vendas, operação e retenção em conjunto para localizar onde está o gargalo — e não apenas o sintoma.',
    },
    {
      word: 'Questionar',
      text: 'Antes de propor uma solução, entender o que está impedindo o resultado. A pergunta certa evita esforço na direção errada.',
    },
    {
      word: 'Estruturar',
      text: 'Transformar o diagnóstico em prioridades, estratégia e um plano de ação que as equipes conseguem executar.',
    },
    {
      word: 'Executar',
      text: 'Coordenar especialidades, acompanhar indicadores e ajustar a rota. Estratégia que não chega à execução é só apresentação.',
    },
  ],
}

export type CareerGroup = { title: string; items: string[] }
export type CareerChapter = {
  chapter: string
  theme: string
  yearsStart: string
  yearsEnd: string
  company: string
  role: string
  period: string
  /** Evolução de atuação dentro da empresa (somente quando documentada). */
  progression?: string[]
  summary: string
  groups: CareerGroup[]
}

export const career = {
  eyebrow: 'Trajetória',
  title: 'Experiência construída entre estratégia e execução.',
  intro:
    'Duas etapas, uma mesma lógica: entender o que move o resultado e organizar pessoas, prioridades e indicadores em torno disso.',
  chapters: [
    {
      chapter: 'Capítulo 01',
      theme: 'Varejo e liderança comercial',
      yearsStart: '2015',
      yearsEnd: '2020',
      company: 'Grupo Maxma Modas',
      role: 'Gerente de Vendas',
      period: 'ago. 2015 — jul. 2020',
      summary:
        'Cinco anos à frente de equipes comerciais, com responsabilidade sobre metas, operação e experiência do cliente — o lugar onde a estratégia precisa funcionar no dia a dia, diante do cliente.',
      groups: [
        {
          title: 'Pessoas',
          items: ['Gestão e desenvolvimento de equipes comerciais', 'Tomada de decisão e resolução de problemas'],
        },
        {
          title: 'Resultado',
          items: ['Acompanhamento de metas e indicadores', 'Estratégias de vendas'],
        },
        {
          title: 'Operação',
          items: ['Gestão operacional', 'Experiência do cliente'],
        },
      ],
    },
    {
      chapter: 'Capítulo 02',
      theme: 'Estratégia, contas e consultoria',
      yearsStart: '2022',
      yearsEnd: '2026',
      company: 'V4 Company',
      role: 'Gestora de Projetos',
      period: 'ago. 2022 — out. 2026',
      progression: ['Gestão estratégica de contas e projetos', 'Consultoria e diagnóstico de negócios'],
      summary:
        'A atuação começou na gestão estratégica de contas e projetos e evoluiu para consultoria e diagnóstico de negócios: analisar o negócio por inteiro, encontrar gargalos e transformar o diagnóstico em estratégia.',
      groups: [
        {
          title: 'Diagnóstico',
          items: [
            'Diagnóstico de negócios',
            'Análise de marketing, vendas, operação e retenção',
            'Auditorias para identificação de gargalos e oportunidades',
          ],
        },
        {
          title: 'Estratégia',
          items: [
            'Estruturação de estratégias e planos de ação',
            'Desenvolvimento de estratégias de comunicação e campanhas',
            'Apresentação de estratégias aos clientes',
          ],
        },
        {
          title: 'Gestão',
          items: [
            'Gestão de contas e projetos',
            'Coordenação de equipes de tráfego, copy, design e tecnologia',
            'Acompanhamento de indicadores e resultados',
            'Relacionamento com clientes',
          ],
        },
      ],
    },
  ] satisfies CareerChapter[],
  bridge: {
    lead: 'O que a liderança comercial ensinou,',
    accent: 'a consultoria aproveita.',
    text: 'Metas, indicadores, equipes e cliente deixaram de ser teoria muito antes de virarem estratégia.',
  },
}

export const education = {
  eyebrow: 'Formação',
  title: 'A formação acadêmica pensada em um cálculo.',
  /** Leitura da equação para leitores de tela */
  equationSpoken:
    'R é igual à integral, de 2015 a 2026, de C vezes G, d t. Onde C é comunicação, G é gestão, t é o tempo de prática e d t é cada instante de prática, somado ao longo do tempo.',
  limits: { from: '2015', to: '2026' },
  variables: [
    {
      symbol: 'C',
      name: 'Comunicação',
      detail: 'Comunicação Social — Publicidade e Propaganda',
      source: 'Wyden',
      kind: 'Graduação',
    },
    {
      symbol: 'G',
      name: 'Gestão',
      detail: 'MBA em Gestão Empresarial',
      source: 'FGV',
      kind: 'MBA',
    },
    {
      symbol: 't',
      name: 'Prática',
      detail: 'Vendas, liderança de equipes, gestão de contas, projetos e consultoria',
      source: '2015 — 2026',
      kind: 'Tempo',
    },
  ],
  /** Nota sobre o diferencial da integral */
  dtNote: 'cada instante de prática, somado ao longo do tempo — de 2015 a 2026.',
  result: 'marca e negócio na mesma conversa.',
  text: 'A publicidade ensina a falar com pessoas. A gestão ensina a responder ao negócio. Multiplicadas — e não apenas somadas — ao longo de anos de prática, resultam em estratégia que comunica e que entrega.',
}

/**
 * Registros pessoais de viagem — NÃO são experiências profissionais.
 * Locais identificados pelos marcos visíveis nas fotos (confirmar com Yasmin).
 * Para adicionar novos registros: coloque a imagem em src/assets/images/yasmin/,
 * importe-a no topo deste arquivo e acrescente um item aqui.
 */
export const travel = {
  eyebrow: 'Fora do roteiro',
  title: 'Nem tudo cabe em um currículo.',
  text: 'Fora do trabalho, viajar é um jeito de manter a curiosidade em movimento: outros lugares, outros ritmos, outras formas de se comunicar e vender.',
  photos: [
    {
      src: imgTibre,
      alt: 'Yasmin Manasera de boina de couro e casaco preto às margens do rio Tibre, em Roma, com pontes e a cúpula da Basílica de São Pedro ao fundo.',
      place: 'Roma, Itália',
      caption: 'Às margens do Tibre',
    },
    {
      src: imgCastel,
      alt: "Yasmin Manasera na Ponte Sant'Angelo, em Roma, em frente a uma estátua de anjo e ao Castel Sant'Angelo.",
      place: 'Roma, Itália',
      caption: "Ponte e Castel Sant'Angelo",
    },
  ],
}

export const closing = {
  eyebrow: 'Contato',
  titleA: 'Boas ideias',
  titleB: 'merecem sair',
  titleC: 'do papel.',
  text: 'Diagnóstico, estratégia e execução funcionam melhor quando começam com uma boa conversa. Se existe um desafio de negócio na mesa, vamos conversar sobre o que pode ser construído.',
  /** "Prazer em conhecer" em árabe, exibido entre as letras Y e M do rodapé. */
  signoffArabic: 'تشرفت بمعرفتك',
  signoffTranslation: 'Prazer em conhecer.',
}

export const images = {
  heroCutout: {
    src: imgHero1100,
    srcSet: `${imgHero640} 640w, ${imgHero1100} 1100w`,
    width: 1100,
    height: 1143,
    alt: 'Retrato em preto e branco de Yasmin Manasera sorrindo, de óculos e blazer preto.',
  },
}
