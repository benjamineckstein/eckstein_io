import { CODEWITHAGENTS_URL, CODEWITHAGENTS_EN_URL } from './site'

export type Lang = 'de' | 'en'
export const NAME = 'Benjamin Eckstein'

interface Copy {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  role: string
  line: [string, string]
  hints: [string, string, string]
  replay: string
  skip: string
  langNav: string
  cwa: string
}

export const COPY: Record<Lang, Copy> = {
  de: {
    title: 'Benjamin Eckstein · Agentic Engineer, freiberuflich',
    description: 'Benjamin Eckstein, Agentic Engineer, freiberuflich, in Kleinmachnow bei Berlin. Alle können jetzt KI. Wo ist dein Limit?',
    ogTitle: 'Benjamin Eckstein',
    ogDescription: 'Alle können jetzt KI. Wo ist dein Limit?',
    role: 'Agentic Engineer, freiberuflich',
    line: ['Alle können jetzt KI.', 'Wo ist dein Limit?'],
    hints: ['Arbeit, Blog, Open Source', 'Community, Mitgründer', 'Kontakt'],
    replay: 'Nochmal ansehen',
    skip: 'Überspringen',
    langNav: 'Sprache',
    cwa: CODEWITHAGENTS_URL,
  },
  en: {
    title: 'Benjamin Eckstein · Freelance agentic engineer',
    description: 'Benjamin Eckstein, freelance agentic engineer in Kleinmachnow near Berlin. Everyone can use AI now. Where’s your limit?',
    ogTitle: 'Benjamin Eckstein',
    ogDescription: 'Everyone can use AI now. Where’s your limit?',
    role: 'Freelance agentic engineer',
    line: ['Everyone can use AI now.', 'Where’s your limit?'],
    hints: ['Work, blog, open source', 'Community, co-founder', 'Contact'],
    replay: 'Watch again',
    skip: 'Skip',
    langNav: 'Language',
    cwa: CODEWITHAGENTS_EN_URL,
  },
}
