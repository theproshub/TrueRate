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
  explainerTitle: string;
  explainerImage: string;
  explainerImagePosY: number;
  ex1Title: string;
  ex1Body: string;
  ex2Title: string;
  ex2Body: string;
  ex3Title: string;
  ex3Body: string;
  explainerCTA: string;
  storyImage: string;
  storyImagePosY: number;
  coverTitle: string;
  coverImage: string;
  coverImagePosY: number;
  bwPhoto: boolean;
}

export const IMAGE_KEYS = [
  'breakingImage', 'articleImage', 'quoteImage', 'statImage', 'marketsImage',
  'rateImage', 'eventImage', 'explainerImage', 'storyImage', 'coverImage',
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
  explainerTitle: 'The CBL Just Held Interest Rates. Here\'s What That Means for Your Money.',
  explainerImage: '',
  explainerImagePosY: 50,
  ex1Title: 'Loan payments stay put',
  ex1Body: 'If you hold a variable-rate loan, your monthly payment won\'t rise this quarter — but it won\'t fall either. Budget on current numbers.',
  ex2Title: 'Savings still beat cash',
  ex2Body: 'Deposit rates hold near 4.5%. With inflation easing to 10.2%, the gap is narrowing — money in an account loses less value than money under the mattress.',
  ex3Title: 'The LRD gets breathing room',
  ex3Body: 'Steady rates support the exchange rate. If you\'re paid in USD or send remittances, expect less volatility through Q3.',
  explainerCTA: 'Follow for plain-language money news, every day.',
  storyImage: '',
  storyImagePosY: 40,
  coverTitle: 'VAT Set to Replace GST in Biggest Tax Overhaul in Years',
  coverImage: '',
  coverImagePosY: 30,
  bwPhoto: false,
};
