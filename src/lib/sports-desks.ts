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
  /** Special render: pull executive interviews / data tables into the body. */
  module?: 'interviews' | 'data';
  lead: DeskStory & { dek: string };
  stories: DeskStory[];
};

export const SPORTS_DESKS: SportsDesk[] = [
  {
    slug: 'football',
    label: 'Football',
    blurb: 'The Liberian Premier League, the Lone Star, and the business of the domestic game.',
    imageCategory: 'football',
    lead: {
      category: 'Football', flag: 'Analysis', author: 'James Dweh', time: '1 day ago',
      title: 'Inside the LPL’s Quiet Professionalisation — Wages, Contracts and a New Rulebook',
      dek: 'A centralised wage floor, standardised player contracts and club-licensing rules are reshaping how Liberian clubs operate on and off the pitch — and what investors can expect.',
    },
    stories: [
      { category: 'Football', author: 'Patrice Williams', time: '2 days ago', title: 'Lone Star’s WAFU Qualifier Squad: Who Makes the Cut' },
      { category: 'Football', author: 'Sarah Kollie', time: '3 days ago', title: 'Promotion Race Tightens as Three Clubs Are Separated by a Single Point' },
      { category: 'Football', author: 'Emmanuel Toe', time: '4 days ago', flag: 'Exclusive', title: 'Refereeing Standards Under Review After Integrity Committee Report' },
      { category: 'Football', author: 'James Dweh', time: '6 days ago', title: 'Why Matchday Revenue Still Trails Sponsorship at Every Top-Tier Club' },
    ],
  },
  {
    slug: 'basketball',
    label: 'Basketball',
    blurb: 'The LBA, national teams, and the commercial rise of Liberian basketball.',
    imageCategory: 'basketball',
    lead: {
      category: 'Basketball', flag: 'Analysis', author: 'Tina Mensah', time: '2 days ago',
      title: 'The LBA’s ClarTV Deal Is Becoming a Template for Smaller Federations',
      dek: 'A five-year broadcast agreement gave the league guaranteed primetime and a digital tail. Federations across the region are now studying the structure.',
    },
    stories: [
      { category: 'Basketball', author: 'James Dweh', time: '3 days ago', title: 'Rivers Hoopers Eye Liberian Talent in Their Continental Push' },
      { category: 'Basketball', author: 'Sarah Kollie', time: '5 days ago', title: 'Women’s LBA Doubles Attendance After a Schedule Overhaul' },
      { category: 'Basketball', author: 'Comfort Davies', time: '1 week ago', title: 'Grassroots Courts Programme Reaches Twelve Counties' },
    ],
  },
  {
    slug: 'athletics',
    label: 'Athletics',
    blurb: 'Track, field and the athletes carrying Liberia onto the world stage.',
    imageCategory: 'athletics',
    lead: {
      category: 'Athletics', flag: 'Interview', author: 'Comfort Davies', time: '3 days ago',
      title: 'Comfort Brown on Building a Real Market for the Liberian Athlete',
      dek: 'Liberia’s most marketable track star explains how endorsement income now funds a junior pipeline — and why the federation has to professionalise quickly to keep up.',
    },
    stories: [
      { category: 'Athletics', author: 'Patrice Williams', time: '4 days ago', title: 'World Athletics Grant Funds a New National Development Programme' },
      { category: 'Athletics', author: 'Sarah Kollie', time: '6 days ago', title: 'Three Liberian Sprinters Hit Qualifying Marks for the Regional Meet' },
      { category: 'Athletics', author: 'Emmanuel Toe', time: '1 week ago', title: 'Inside the Funding Gap That Keeps Liberian Field Events Underdeveloped' },
    ],
  },
  {
    slug: 'youth-sports',
    label: 'Youth Sports',
    blurb: 'Academies, school competitions and the pipeline developing Liberia’s next generation.',
    imageCategory: 'development',
    lead: {
      category: 'Youth Sports', flag: 'Analysis', author: 'Sarah Kollie', time: '2 days ago',
      title: 'The Academy Economy: Who Actually Pays to Develop Liberia’s Talent',
      dek: 'Club academies, NGO programmes and private camps are competing for the same young players. We trace where the money comes from — and where it goes.',
    },
    stories: [
      { category: 'Youth Sports', author: 'James Dweh', time: '3 days ago', title: 'School Championships Return With Corporate Backing for the First Time' },
      { category: 'Youth Sports', author: 'Comfort Davies', time: '5 days ago', title: 'How One Monrovia Academy Turned Player Sales Into a Business Model' },
      { category: 'Youth Sports', author: 'Patrice Williams', time: '1 week ago', title: 'The Safeguarding Standards Liberian Academies Still Lack' },
    ],
  },
  {
    slug: 'womens-sports',
    label: "Women's Sports",
    blurb: 'The growth, investment and coverage of women’s sport across Liberia.',
    imageCategory: 'women',
    lead: {
      category: "Women's Sports", flag: 'Analysis', author: 'Tina Mensah', time: '2 days ago',
      title: 'Women’s Football Is Liberia’s Fastest-Growing Audience — and Its Most Underfunded',
      dek: 'Attendance and broadcast interest are rising faster than the men’s game in places. The commercial money has not yet followed. Inside the gap.',
    },
    stories: [
      { category: "Women's Sports", author: 'Sarah Kollie', time: '4 days ago', title: 'LWPL Lands Its First Standalone Title Sponsor' },
      { category: "Women's Sports", author: 'Comfort Davies', time: '6 days ago', title: 'The National Team’s Qualifying Run Is Reshaping the Domestic League' },
      { category: "Women's Sports", author: 'James Dweh', time: '1 week ago', title: 'Equal-Pay Conversations Reach Liberian Sport — Slowly' },
    ],
  },
  {
    slug: 'governance',
    label: 'Sports Governance',
    blurb: 'Federations, regulation, integrity and the institutions that run Liberian sport.',
    imageCategory: 'federation',
    lead: {
      category: 'Governance', flag: 'Exclusive', author: 'Emmanuel Toe', time: '1 day ago',
      title: 'LFA’s 2026 Budget Vote: What’s Actually on the Table',
      dek: 'Ahead of the AGM, we obtained the draft operating budget. It proposes a centralised referee-payment scheme, a club-licensing deadline, and a contested reserve fund.',
    },
    stories: [
      { category: 'Governance', author: 'Sarah Kollie', time: '3 days ago', title: 'CAF Club Licensing: Which Liberian Clubs Risk Missing the Deadline' },
      { category: 'Governance', author: 'James Dweh', time: '5 days ago', title: 'The Integrity Unit Liberian Sport Keeps Promising to Build' },
      { category: 'Governance', author: 'Patrice Williams', time: '1 week ago', title: 'How Federation Elections Shape Where Sponsorship Money Flows' },
    ],
  },
  {
    slug: 'technology',
    label: 'Sports Technology',
    blurb: 'Data, broadcast and the technology modernising how Liberian sport is played and sold.',
    imageCategory: 'technology',
    lead: {
      category: 'Technology', flag: 'Analysis', author: 'Tina Mensah', time: '2 days ago',
      title: 'A Streaming Carve-Out Could Double the LPL’s Reach Overnight',
      dek: 'Awarding linear and digital rights separately would push the league’s potential audience past a million viewers — including the diaspora. The tech is finally ready.',
    },
    stories: [
      { category: 'Technology', author: 'James Dweh', time: '4 days ago', title: 'Clubs Begin Adopting Basic Performance-Tracking for the First Time' },
      { category: 'Technology', author: 'Comfort Davies', time: '6 days ago', title: 'Mobile Money Is Quietly Becoming Liberian Sport’s Ticketing Layer' },
      { category: 'Technology', author: 'Sarah Kollie', time: '1 week ago', title: 'The Data Gap That Makes Liberian Athletes Hard to Scout' },
    ],
  },
  {
    slug: 'interviews',
    label: 'Interviews',
    blurb: 'Executive conversations with the owners, coaches, officials and athletes running Liberian sport.',
    imageCategory: 'interviews',
    module: 'interviews',
    lead: {
      category: 'Interviews', flag: 'Interview', author: 'Sarah Kollie', time: '2 days ago',
      title: 'The Chairman Who Made Mighty Barrolle Profitable — In His Own Words',
      dek: 'Cassell Kuoh on the wage cap, the shirt-deal renegotiation, and why he thinks the rest of the league is still mispricing its own players.',
    },
    stories: [],
  },
  {
    slug: 'data-research',
    label: 'Data & Research',
    blurb: 'The numbers behind Liberian sport — datasets, valuations and evidence-led reporting.',
    imageCategory: 'investigation',
    module: 'data',
    lead: {
      category: 'Data & Research', flag: 'Data', author: 'James Dweh', time: '2 days ago',
      title: 'The Liberian Sport Money Map: Where $24M a Year Actually Flows',
      dek: 'We pulled together sponsorship, broadcast, transfer and gate figures across the major competitions to map the real size — and shape — of the market.',
    },
    stories: [],
  },
  {
    slug: 'opinion',
    label: 'Opinion & Analysis',
    blurb: 'Argument and interpretation on the business and future of Liberian sport.',
    imageCategory: 'analysis',
    lead: {
      category: 'Opinion', flag: 'Opinion', author: 'Editorial Board', time: '1 day ago',
      title: 'Liberian Sport Doesn’t Have a Talent Problem. It Has a Balance-Sheet Problem.',
      dek: 'The players keep coming. The institutions to monetise and retain them do not. Until that changes, the diaspora will keep being our most successful export.',
    },
    stories: [
      { category: 'Opinion', author: 'Sarah Kollie', time: '3 days ago', title: 'Stop Celebrating Transfer Fees. Start Asking Where the Money Goes.' },
      { category: 'Analysis', author: 'James Dweh', time: '5 days ago', title: 'The Case for One Centralised Liberian Sports Broadcast Rights Body' },
      { category: 'Opinion', author: 'Comfort Davies', time: '1 week ago', title: 'Women’s Sport Is the Best Investment Nobody in Liberia Is Making' },
    ],
  },
];

export function getSportsDesk(slug: string): SportsDesk | undefined {
  return SPORTS_DESKS.find((d) => d.slug === slug);
}
