/**
 * Editorial desk landing pages for /sports/[topic].
 *
 * These are the spec's editorial categories that don't have a dedicated data
 * vertical (club-finance / sponsorship / transfers-deals / broadcast-rights
 * remain bespoke). Each desk is an editorial front: a lead story plus a short
 * stream, in the section's light, photo-and-headline style. All content is
 * illustrative sample data (the section-wide "Sample data" banner applies).
 */
import type { StoryFlag } from '@/lib/sports-finance-data';
import type { HeroVariant } from '@/components/sports/SportsDeskHero';

export type DeskStory = {
  category: string;
  title: string;
  dek?: string;
  author: string;
  time: string;
  flag?: StoryFlag;
};

export type SportsDesk = {
  slug: string;
  label: string;
  blurb: string;
  imageCategory: string;
  /** This desk's signature front layout — explicit so every desk reads differently. */
  variant: HeroVariant;
  /** Short "what this desk covers" bullets for the desk sidebar. */
  coverage?: string[];
  /** Special render: pull executive interviews / data tables into the body. */
  module?: 'interviews' | 'data';
  lead: DeskStory & { dek: string };
  stories: DeskStory[];
};

export const SPORTS_DESKS: SportsDesk[] = [
  {
    slug: 'football',
    variant: 'bigLeft',
    coverage: [
      'LPL results, club business and the league\'s commercial growth',
      'The Lone Star: squads, qualifiers and what tournaments pay',
      'Wages, contracts, licensing and the rules reshaping the domestic game',
    ],
    label: 'Football',
    blurb: 'The Liberian Premier League, the Lone Star, and the business of the domestic game.',
    imageCategory: 'football',
    lead: {
      category: 'Football', flag: 'Analysis', author: 'James Dweh', time: 'Jun 19, 2026',
      title: 'Inside the LPL’s Quiet Professionalisation — Wages, Contracts and a New Rulebook',
      dek: 'A centralised wage floor, standardised player contracts and club-licensing rules are reshaping how Liberian clubs operate on and off the pitch — and what investors can expect.',
    },
    stories: [
      { category: 'Football', author: 'Patrice Williams', time: 'Jun 18, 2026', title: 'Lone Star’s WAFU Qualifier Squad: Who Makes the Cut' },
      { category: 'Football', author: 'Sarah Kollie', time: 'Jun 17, 2026', title: 'Promotion Race Tightens as Three Clubs Are Separated by a Single Point' },
      { category: 'Football', author: 'Emmanuel Toe', time: 'Jun 16, 2026', flag: 'Exclusive', title: 'Refereeing Standards Under Review After Integrity Committee Report' },
      { category: 'Football', author: 'James Dweh', time: 'Jun 14, 2026', title: 'Why Matchday Revenue Still Trails Sponsorship at Every Top-Tier Club' },
    ],
  },
  {
    slug: 'basketball',
    variant: 'overlay',
    coverage: [
      'The LBA season, broadcast deals and franchise economics',
      'Liberians in the BAL and the NBA pipeline',
      'Grassroots courts, federations and the commercial rise of the game',
    ],
    label: 'Basketball',
    blurb: 'The LBA, national teams, and the commercial rise of Liberian basketball.',
    imageCategory: 'basketball',
    lead: {
      category: 'Basketball', flag: 'Analysis', author: 'Tina Mensah', time: 'Jun 18, 2026',
      title: 'The LBA’s ClarTV Deal Is Becoming a Template for Smaller Federations',
      dek: 'A five-year broadcast agreement gave the league guaranteed primetime and a digital tail. Federations across the region are now studying the structure.',
    },
    stories: [
      { category: 'Basketball', author: 'James Dweh', time: 'Jun 17, 2026', title: 'Rivers Hoopers Eye Liberian Talent in Their Continental Push' },
      { category: 'Basketball', author: 'Sarah Kollie', time: 'Jun 15, 2026', title: 'Women’s LBA Doubles Attendance After a Schedule Overhaul' },
      { category: 'Basketball', author: 'Comfort Davies', time: 'Jun 13, 2026', title: 'Grassroots Courts Programme Reaches Twelve Counties' },
    ],
  },
  {
    slug: 'athletics',
    variant: 'horizontal',
    coverage: [
      'Liberian sprinters and field athletes on the continental circuit',
      'Endorsements, grants and how track talent gets funded',
      'Meets, qualifying marks and the federation behind them',
    ],
    label: 'Athletics',
    blurb: 'Track, field and the athletes carrying Liberia onto the world stage.',
    imageCategory: 'athletics',
    lead: {
      category: 'Athletics', flag: 'Interview', author: 'Comfort Davies', time: 'Jun 17, 2026',
      title: 'Comfort Brown on Building a Real Market for the Liberian Athlete',
      dek: 'Liberia’s most marketable track star explains how endorsement income now funds a junior pipeline — and why the federation has to professionalise quickly to keep up.',
    },
    stories: [
      { category: 'Athletics', author: 'Patrice Williams', time: 'Jun 16, 2026', title: 'World Athletics Grant Funds a New National Development Programme' },
      { category: 'Athletics', author: 'Sarah Kollie', time: 'Jun 14, 2026', title: 'Three Liberian Sprinters Hit Qualifying Marks for the Regional Meet' },
      { category: 'Athletics', author: 'Emmanuel Toe', time: 'Jun 13, 2026', title: 'Inside the Funding Gap That Keeps Liberian Field Events Underdeveloped' },
    ],
  },
  {
    slug: 'youth-sports',
    variant: 'grid',
    coverage: [
      'Academies, school sport and the development pipeline',
      'Who funds youth development — and who profits from it',
      'Safeguarding, standards and the rules protecting young athletes',
    ],
    label: 'Youth Sports',
    blurb: 'Academies, school competitions and the pipeline developing Liberia’s next generation.',
    imageCategory: 'development',
    lead: {
      category: 'Youth Sports', flag: 'Analysis', author: 'Sarah Kollie', time: 'Jun 18, 2026',
      title: 'The Academy Economy: Who Actually Pays to Develop Liberia’s Talent',
      dek: 'Club academies, NGO programmes and private camps are competing for the same young players. We trace where the money comes from — and where it goes.',
    },
    stories: [
      { category: 'Youth Sports', author: 'James Dweh', time: 'Jun 17, 2026', title: 'School Championships Return With Corporate Backing for the First Time' },
      { category: 'Youth Sports', author: 'Comfort Davies', time: 'Jun 15, 2026', title: 'How One Monrovia Academy Turned Player Sales Into a Business Model' },
      { category: 'Youth Sports', author: 'Patrice Williams', time: 'Jun 13, 2026', title: 'The Safeguarding Standards Liberian Academies Still Lack' },
    ],
  },
  {
    slug: 'womens-sports',
    variant: 'stacked',
    coverage: [
      'The LWPL, the national team and the women\'s game\'s growth',
      'Sponsorship, pay and the investment gap',
      'Attendance, broadcast interest and the audience data',
    ],
    label: "Women's Sports",
    blurb: 'The growth, investment and coverage of women’s sport across Liberia.',
    imageCategory: 'women',
    lead: {
      category: "Women's Sports", flag: 'Analysis', author: 'Tina Mensah', time: 'Jun 18, 2026',
      title: 'Women’s Football Is Liberia’s Fastest-Growing Audience — and Its Most Underfunded',
      dek: 'Attendance and broadcast interest are rising faster than the men’s game in places. The commercial money has not yet followed. Inside the gap.',
    },
    stories: [
      { category: "Women's Sports", author: 'Sarah Kollie', time: 'Jun 16, 2026', title: 'LWPL Lands Its First Standalone Title Sponsor' },
      { category: "Women's Sports", author: 'Comfort Davies', time: 'Jun 14, 2026', title: 'The National Team’s Qualifying Run Is Reshaping the Domestic League' },
      { category: "Women's Sports", author: 'James Dweh', time: 'Jun 13, 2026', title: 'Equal-Pay Conversations Reach Liberian Sport — Slowly' },
    ],
  },
  {
    slug: 'governance',
    variant: 'ledger',
    coverage: [
      'Federation budgets, elections and accountability',
      'Club licensing, integrity and regulation',
      'The institutions that decide where the money flows',
    ],
    label: 'Sports Governance',
    blurb: 'Federations, regulation, integrity and the institutions that run Liberian sport.',
    imageCategory: 'federation',
    lead: {
      category: 'Governance', flag: 'Exclusive', author: 'Emmanuel Toe', time: 'Jun 19, 2026',
      title: 'LFA’s 2026 Budget Vote: What’s Actually on the Table',
      dek: 'Ahead of the AGM, we obtained the draft operating budget. It proposes a centralised referee-payment scheme, a club-licensing deadline, and a contested reserve fund.',
    },
    stories: [
      { category: 'Governance', author: 'Sarah Kollie', time: 'Jun 17, 2026', title: 'CAF Club Licensing: Which Liberian Clubs Risk Missing the Deadline' },
      { category: 'Governance', author: 'James Dweh', time: 'Jun 15, 2026', title: 'The Integrity Unit Liberian Sport Keeps Promising to Build' },
      { category: 'Governance', author: 'Patrice Williams', time: 'Jun 13, 2026', title: 'How Federation Elections Shape Where Sponsorship Money Flows' },
    ],
  },
  {
    slug: 'technology',
    variant: 'wire',
    coverage: [
      'Streaming, broadcast tech and how Liberian sport reaches fans',
      'Performance data, scouting and analytics adoption',
      'Ticketing, mobile money and the digital business of sport',
    ],
    label: 'Sports Technology',
    blurb: 'Data, broadcast and the technology modernising how Liberian sport is played and sold.',
    imageCategory: 'technology',
    lead: {
      category: 'Technology', flag: 'Analysis', author: 'Tina Mensah', time: 'Jun 18, 2026',
      title: 'A Streaming Carve-Out Could Double the LPL’s Reach Overnight',
      dek: 'Awarding linear and digital rights separately would push the league’s potential audience past a million viewers — including the diaspora. The tech is finally ready.',
    },
    stories: [
      { category: 'Technology', author: 'James Dweh', time: 'Jun 16, 2026', title: 'Clubs Begin Adopting Basic Performance-Tracking for the First Time' },
      { category: 'Technology', author: 'Comfort Davies', time: 'Jun 14, 2026', title: 'Mobile Money Is Quietly Becoming Liberian Sport’s Ticketing Layer' },
      { category: 'Technology', author: 'Sarah Kollie', time: 'Jun 13, 2026', title: 'The Data Gap That Makes Liberian Athletes Hard to Scout' },
    ],
  },
  {
    slug: 'interviews',
    variant: 'feature',
    coverage: [
      'Owners, chairs and executives on the record',
      'Coaches and athletes on the business behind their sport',
      'The decision-makers shaping Liberian sport, in their own words',
    ],
    label: 'Interviews',
    blurb: 'Executive conversations with the owners, coaches, officials and athletes running Liberian sport.',
    imageCategory: 'interviews',
    module: 'interviews',
    lead: {
      category: 'Interviews', flag: 'Interview', author: 'Sarah Kollie', time: 'Jun 18, 2026',
      title: 'The Chairman Who Made Mighty Barrolle Profitable — In His Own Words',
      dek: 'Cassell Kuoh on the wage cap, the shirt-deal renegotiation, and why he thinks the rest of the league is still mispricing its own players.',
    },
    stories: [],
  },
  {
    slug: 'data-research',
    variant: 'index',
    coverage: [
      'Datasets on valuations, deals, wages and attendance',
      'Evidence-led reporting and methodology notes',
      'The numbers behind every claim on the sports desks',
    ],
    label: 'Data & Research',
    blurb: 'The numbers behind Liberian sport — datasets, valuations and evidence-led reporting.',
    imageCategory: 'investigation',
    module: 'data',
    lead: {
      category: 'Data & Research', flag: 'Data', author: 'James Dweh', time: 'Jun 18, 2026',
      title: 'The Liberian Sport Money Map: Where $24M a Year Actually Flows',
      dek: 'We pulled together sponsorship, broadcast, transfer and gate figures across the major competitions to map the real size — and shape — of the market.',
    },
    stories: [],
  },
  {
    slug: 'opinion',
    variant: 'essay',
    coverage: [
      'Argument and interpretation from the TrueRate Sports desk',
      'Columns on where the money in Liberian sport should go',
      'Replies and counterpoints from readers and the industry',
    ],
    label: 'Opinion & Analysis',
    blurb: 'Argument and interpretation on the business and future of Liberian sport.',
    imageCategory: 'analysis',
    lead: {
      category: 'Opinion', flag: 'Opinion', author: 'Editorial Board', time: 'Jun 19, 2026',
      title: 'Liberian Sport Doesn’t Have a Talent Problem. It Has a Balance-Sheet Problem.',
      dek: 'The players keep coming. The institutions to monetise and retain them do not. Until that changes, the diaspora will keep being our most successful export.',
    },
    stories: [
      { category: 'Opinion', author: 'Sarah Kollie', time: 'Jun 17, 2026', title: 'Stop Celebrating Transfer Fees. Start Asking Where the Money Goes.' },
      { category: 'Analysis', author: 'James Dweh', time: 'Jun 15, 2026', title: 'The Case for One Centralised Liberian Sports Broadcast Rights Body' },
      { category: 'Opinion', author: 'Comfort Davies', time: 'Jun 13, 2026', title: 'Women’s Sport Is the Best Investment Nobody in Liberia Is Making' },
    ],
  },
];

export function getSportsDesk(slug: string): SportsDesk | undefined {
  return SPORTS_DESKS.find((d) => d.slug === slug);
}
