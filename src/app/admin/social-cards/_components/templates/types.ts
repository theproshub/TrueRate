export type TemplateFormat = 'breaking' | 'article' | 'quote' | 'stat' | 'markets' | 'rate' | 'event' | 'explainer' | 'story' | 'cover';
export type TemplateVariant = 'terminal' | 'broadsheet';

export interface CardTweaks {
  variant: TemplateVariant;
  templateType: TemplateFormat;
  category: string;
  headline: string;
  subtext: string;
  articleTitle: string;
  articleExcerpt: string;
  articleReadTime: string;
  stat: string;
  statLabel: string;
  statContext: string;
  date: string;
  marketDate: string;
  market1Label: string;
  market1Value: string;
  market1Change: string;
  market1Up: boolean;
  market2Label: string;
  market2Value: string;
  market2Change: string;
  market2Up: boolean;
  market3Label: string;
  market3Value: string;
  market3Change: string;
  market3Up: boolean;
  market4Label: string;
  market4Value: string;
  market4Change: string;
  market4Up: boolean;
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  quoteContext: string;
  quoteAccent: string;
  /** Footer-left line on photo-led cards — photo credit or source, rendered
      verbatim in uppercase (e.g. "PHOTO: GETTY IMAGES", "SOURCE: CBL").
      Blank renders no line. */
  creditLine: string;
  breakingImage: string;
  breakingImagePosY: number;
  articleImage: string;
  articleImagePosY: number;
  quoteImage: string;
  quoteImagePosY: number;
  statImage: string;
  statImagePosY: number;
  marketsImage: string;
  marketsImagePosY: number;
  rateDate: string;
  rateValue: string;
  rateChange: string;
  rateUp: boolean;
  rateBuy: string;
  rateSell: string;
  rateImage: string;
  rateImagePosY: number;
  eventKind: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventCTA: string;
  eventImage: string;
  eventImagePosY: number;
  explainerSlide: number;
  /** Cover scroll-stopper. When set, it becomes the hero line on slide 0 and
      the cover title drops to a supporting subhead. Blank = title stays hero. */
  explainerHook: string;
  explainerTitle: string;
  explainerImage: string;
  explainerImagePosY: number;
  /** Solid background color for explainer slides when no image is set.
      Blank = the variant default (navy on terminal, paper on broadsheet). */
  explainerBg: string;
  /** Each of the three point slides carries its own background photo, separate
      from the cover (explainerImage). Blank on a terminal card falls back to the
      placeholder; blank on broadsheet stays on the paper/color bg. */
  ex1Title: string;
  ex1Body: string;
  ex1Image: string;
  ex1ImagePosY: number;
  ex2Title: string;
  ex2Body: string;
  ex2Image: string;
  ex2ImagePosY: number;
  ex3Title: string;
  ex3Body: string;
  ex3Image: string;
  ex3ImagePosY: number;
  explainerCTA: string;
  /** Background photo for the outro / CTA slide (slide E). Blank = text-only on
      the solid/variant background. */
  explainerOutroImage: string;
  explainerOutroImagePosY: number;
  storyImage: string;
  storyImagePosY: number;
  /** Story scroll-stopper — mirrors explainerHook. When set it becomes the hero
      line and the headline drops to a subhead. Blank = headline stays hero. */
  storyHook: string;
  coverTitle: string;
  coverImage: string;
  coverImagePosY: number;
  bwPhoto: boolean;
}

export const IMAGE_KEYS = [
  'breakingImage', 'articleImage', 'quoteImage', 'statImage', 'marketsImage',
  'rateImage', 'eventImage', 'explainerImage', 'ex1Image', 'ex2Image', 'ex3Image',
  'explainerOutroImage', 'storyImage', 'coverImage',
] as const satisfies readonly (keyof CardTweaks)[];

export const TWEAK_DEFAULTS: CardTweaks = {
  variant: 'terminal',
  templateType: 'breaking',
  category: 'Economy',
  headline: 'VAT Set to Replace GST in Biggest Tax Overhaul in Years',
  subtext: 'The Liberia Revenue Authority is steering the country\'s biggest indirect-tax overhaul in decades: replacing the single-rate Goods and Services Tax with a multi-stage Value Added Tax. With tax revenue at US$59.46 million in March 2026 — a month when one-off non-tax receipts swelled total revenue to US$304.37 million — the shift is as much about broadening the tax base as changing the rate.',
  articleTitle: 'VAT Set to Replace GST in Biggest Tax Overhaul in Years',
  articleExcerpt: 'The Liberia Revenue Authority is steering the country\'s biggest indirect-tax overhaul in decades: replacing the single-rate Goods and Services Tax with a multi-stage Value Added Tax. With tax revenue at US$59.46 million in March 2026 — a month when one-off non-tax receipts swelled total revenue to US$304.37 million — the shift is as much about broadening the tax base as changing the rate.',
  articleReadTime: '6 min',
  stat: '$2.4B',
  statLabel: 'Foreign Direct Investment, Q1 2026',
  statContext: 'A record quarter driven by iron ore expansion at Nimba and renewed rubber export demand from Asian markets. The previous peak was $1.7B in Q2 2024.',
  date: 'July 13, 2026',
  marketDate: 'Apr 20, 2026 · 16:00 GMT · Close',
  market1Label: 'LRD / USD',
  market1Value: '183.93',
  market1Change: '0.65%',
  market1Up: true,
  market2Label: 'Iron Ore (USD/t)',
  market2Value: '108.50',
  market2Change: '2.08%',
  market2Up: false,
  market3Label: 'Rubber (USD/kg)',
  market3Value: '1.72',
  market3Change: '2.38%',
  market3Up: true,
  market4Label: 'Gold (USD/oz)',
  market4Value: '2,285',
  market4Change: '0.82%',
  market4Up: true,
  quote: 'Liberia\'s next decade will be written by entrepreneurs who refuse to wait for perfect conditions — who build despite friction, not because of its absence.',
  quoteAuthor: 'Joseph K. Tuah',
  quoteRole: 'CEO, PayLink Liberia',
  quoteContext: 'At the West Africa FinTech Summit, Monrovia',
  quoteAccent: '#BFEA36',
  creditLine: '',
  breakingImage: '',
  breakingImagePosY: 50,
  articleImage: '',
  articleImagePosY: 30,
  quoteImage: '',
  quoteImagePosY: 20,
  statImage: '',
  statImagePosY: 50,
  marketsImage: '',
  marketsImagePosY: 50,
  rateDate: 'Jul 13, 2026',
  rateValue: '183.93',
  rateChange: '0.65%',
  rateUp: true,
  rateBuy: '182.50',
  rateSell: '185.40',
  rateImage: '',
  rateImagePosY: 50,
  eventKind: 'Event',
  eventTitle: 'West Africa FinTech Summit 2026',
  eventDate: 'Aug 14, 2026',
  eventTime: '9:00 AM GMT',
  eventVenue: 'EJS Ministerial Complex, Monrovia',
  eventCTA: 'Register · truerateliberia.com',
  eventImage: '',
  eventImagePosY: 50,
  explainerSlide: 0,
  explainerHook: 'Market woman, susu member, family living on money from abroad — the Central Bank’s decision touches your money.',
  explainerTitle: '',
  explainerImage: '',
  explainerImagePosY: 50,
  explainerBg: '',
  ex1Title: 'Borrowing costs the same',
  ex1Body: 'For a market woman who borrows to stock her table, nothing changed — she pays the same to borrow as before. So don’t wait for a cheaper loan; it’s not coming yet.',
  ex1Image: '',
  ex1ImagePosY: 50,
  ex2Title: 'The bank is the safer place',
  ex2Body: 'For anyone saving small money, like a susu member, the bank is safer. Cash at home slowly loses value as prices rise. In the bank it stays safe and grows a little each month.',
  ex2Image: '',
  ex2ImagePosY: 50,
  ex3Title: 'The dollar should stay steady',
  ex3Body: 'For a family living on money from abroad, that’s good news. The US dollar price should not jump, so what they receive — and the imported goods they buy — should cost about the same.',
  ex3Image: '',
  ex3ImagePosY: 50,
  explainerCTA: 'Follow TrueRate — money news anybody can understand.',
  explainerOutroImage: '',
  explainerOutroImagePosY: 50,
  storyImage: '',
  storyImagePosY: 40,
  storyHook: '',
  coverTitle: 'VAT Set to Replace GST in Biggest Tax Overhaul in Years',
  coverImage: '',
  coverImagePosY: 30,
  bwPhoto: false,
};
