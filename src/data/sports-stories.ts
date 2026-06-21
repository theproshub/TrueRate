export type SportsSection = 'main' | 'sponsorship' | 'transfers' | 'broadcast';

export type SportsStory = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  section: SportsSection;
  hero?: boolean;
  body: string[];
  /** Optional newsroom furniture used by the editorial front lead. */
  author?: string;
  authorRole?: string;
  dateline?: string;
  flag?: 'Exclusive' | 'Analysis' | 'Live' | 'Opinion' | 'Data' | 'Interview';
  readTime?: string;
  /** Desk topic slug (e.g. 'governance') for category-specific desk pages. */
  topic?: string;
};

export const SPORTS_STORIES: SportsStory[] = [
  // ── /sports top-of-page short stories ──────────────────────────────────
  {
    slug: 'premier-league-africa-tv-rights-renewal',
    section: 'main',
    category: 'Football',
    title: 'Premier League Africa TV rights renewal: beIN Sports vs SuperSport bidding war nears $180M',
    summary:
      'beIN Sports and SuperSport are circling the next Premier League Africa rights cycle, with the package value approaching $180M as both bidders pitch new streaming bundles to retain subscribers.',
    source: 'Reuters',
    time: 'Jun 20, 2026',
    body: [
      'The next Premier League Sub-Saharan Africa rights cycle, expected to run from the 2026/27 season through 2028/29, is shaping into a head-to-head between MultiChoice-owned SuperSport — the long-time incumbent — and Doha-based beIN Sports, whose Africa expansion has accelerated since it secured AFCON 2027 co-production rights last year. The package, sources close to the auction process say, has now been valued by both bidders at between $170M and $185M for the three-year cycle, up roughly 12% from the current $160M deal.',
      'SuperSport has held exclusive Premier League rights in the region since 2007, building its DStv subscription base in part on the back of the property. A loss would be commercially significant: internal MultiChoice modelling, reported by Reuters last quarter, attributes between 18% and 22% of premium DStv subscriber retention in West and Southern Africa to Premier League access. beIN, meanwhile, is offering a hybrid model that pairs linear coverage with a direct-to-consumer streaming app priced between $4 and $7 per month — undercutting DStv\'s premium tier by a wide margin.',
      'For Liberia specifically, the auction matters because both bidders are required, under the Premier League\'s territorial framework, to provide a free-to-air component in markets where pay-TV penetration is below 15%. Liberian penetration sits at roughly 8%. If beIN wins, sources say its proposed FTA partner is the state broadcaster ELBC; SuperSport\'s framework would route through Orange Liberia\'s newly-licensed pay-TV arm.',
      'A decision is expected by the Premier League in the second half of 2026. The auction is being run by IMG, which has cautioned both bidders that the league is willing to split rights — for example, awarding linear to one party and streaming to another — if a single bid does not clear the reserve. That outcome, while operationally messy for the winners, would give Liberian and West African viewers more options than they have had in any previous cycle.',
    ],
  },
  {
    slug: 'nba-africa-series-2026-monrovia',
    section: 'main',
    category: 'Basketball',
    title: 'NBA Africa Series 2026 confirmed for Monrovia — estimated $4.2M economic impact',
    summary:
      'NBA Africa has confirmed Monrovia as a Series 2026 host city, with a venue and ticket allocation locked in. Independent estimates put the local economic impact at roughly $4.2M.',
    source: 'NBA Africa',
    time: 'Jun 20, 2026',
    body: [
      'NBA Africa announced this week that Monrovia will host two NBA Africa Series exhibition games in November 2026, with Rivers Hoopers and the Cape Town Tigers confirmed as the participating BAL franchises. The games will be staged at the Samuel Kanyon Doe Sports Complex following a $2.4M government-funded refurbishment of the arena floor and broadcast infrastructure.',
      'Independent economic-impact modelling commissioned by the Liberia Football Association and reviewed by TrueRate puts the gross local impact at $4.2M, comprising direct ticket and concession spending of $1.6M, an estimated $1.1M in inbound tourism (an estimated 1,400 visitors travelling for the matches), and a $1.5M multiplier in hospitality and ancillary services. The number is consistent with NBA Africa Series impact figures recorded in Dakar (2022) and Kigali (2023), adjusted for Monrovia\'s lower hospitality-sector base price.',
      'Tickets, priced from $12 in the upper bowl to $180 courtside, go on sale through a partnership with Orange Money and the BAL ticketing platform. The arena capacity is 6,200; NBA Africa is targeting a 95% sell-through. The league has also committed $400K toward a youth basketball legacy programme, run jointly with the Liberia Basketball Federation across Montserrado and Bong counties.',
      'The Series is widely seen as a stepping stone to a permanent NBA Africa franchise application from Monrovia. The current Basketball Africa League comprises 12 franchises across the continent, with one expansion slot open for the 2027 season. League officials, while declining to commit publicly, have privately briefed both Rivers Hoopers and a Liberian consortium that a strong commercial showing in November would materially improve the franchise application case.',
    ],
  },
  {
    slug: 'world-athletics-mtn-80m-development',
    section: 'main',
    category: 'Athletics',
    title: 'World Athletics signs $80M West Africa development sponsorship with MTN Group',
    summary:
      'World Athletics has agreed an $80M multi-year sponsorship with MTN Group to fund youth and development programmes across West Africa, including Liberia.',
    source: 'World Athletics',
    time: 'Jun 20, 2026',
    body: [
      'World Athletics and MTN Group signed an $80M, six-year development sponsorship in Lagos this week — the largest single track-and-field investment in West Africa\'s history. The deal funds grassroots coaching, athlete travel grants, and a continental talent-identification programme that will operate in 14 countries, including Liberia.',
      'For Liberia, the immediate allocation is approximately $2.4M over the deal\'s life: $1.1M earmarked for an annual elite-development camp at the National Stadium, $800K for travel and accommodation grants for promising under-20 athletes attending continental meets, and $500K for coach certification under World Athletics\' Level 2 framework. The country\'s federation, the Liberia Athletics Federation, will jointly administer the funds with World Athletics\' Africa office.',
      'The deal is structured as a brand-rights sponsorship: MTN gains presenting-sponsor placement at all World Athletics-sanctioned meets in West Africa for the duration, with secondary placement at three premier global events including the Diamond League final. World Athletics reports the package is "materially above" the previous Africa development tier, which was funded primarily by the IAAF Foundation\'s general endowment.',
      'Federation officials in Liberia have flagged that the funding, while transformative at the federation level, does not yet flow directly to athletes outside the elite squad. Comfort Brown, currently the country\'s most commercially successful athlete, is expected to be a programme ambassador. The first allocation of grants to Liberian under-20s is scheduled for July 2026.',
    ],
  },

  // ── /sports HERO + feed ────────────────────────────────────────────────
  {
    slug: 'afcon-2027-broadcast-rights',
    section: 'main',
    hero: true,
    category: 'Football',
    title: "AFCON 2027 broadcast rights: who's paying — and what Liberia's qualification is worth to CAF",
    summary:
      "Liberia's historic qualification has boosted regional viewership projections for AFCON 2027. We break down the broadcast deal, CAF's prize money structure, and what the Lone Star stands to earn.",
    source: 'TrueRate Sports Business',
    author: 'Sarah Kollie',
    authorRole: 'Sports Business Editor',
    dateline: 'MONROVIA',
    flag: 'Exclusive',
    readTime: '7 min read',
    time: 'Jun 20, 2026',
    body: [
      'When Liberia qualified for AFCON 2027 last month — the country\'s first appearance in 24 years — CAF\'s commercial team in Cairo took notice. Within a fortnight, the confederation\'s rights advisors had revised regional viewership projections for the tournament upward by an estimated 12%, citing both the size of Liberia\'s domestic audience and, crucially, the West African diaspora in North America and Europe that historically over-indexes for Lone Star matches.',
      'The headline number behind AFCON 2027 is the $340M global broadcast package, jointly held by SuperSport and beIN Sports. That deal — agreed in 2024 — was struck on a base assumption that 22 of Africa\'s top 24 ranked nations would qualify; Liberia\'s entry, alongside Comoros, was not modelled. Both rightsholders now treat Liberia as upside, particularly for the African diaspora streaming markets in the U.S. and U.K., where SuperSport\'s OTT product Showmax is targeting subscriber acquisition.',
      "On the prize-money side, CAF's structure is well-defined. A group-stage exit pays $700,000 per federation, the round of 16 lifts that to $1.25M, the quarter-finals to $2.5M, the semi-finals to $4M, and the runner-up takes $5M with the champion banking $7M. For Liberia, even a group-stage exit funds approximately 35% of the LFA's annual budget — and the federation has indicated that 25% of any prize money would flow to the playing squad as appearance and progression bonuses.",
      'The broadcast and sponsorship halo extends beyond CAF. Domestic rightsholders ELBC and Orange Liberia have re-priced their LFA League rights for 2026/27 with a 22% uplift, citing AFCON 2027\'s expected attention boost. And kit sponsor Puma, which signed Liberia in 2023, is in renewal negotiations with the LFA at a reported 40% increase to the existing $450K/year deal.',
      'The trajectory only holds if Liberia avoids a group-stage exit on goal difference. CAF\'s broadcast partners model a sharp viewership drop-off for nations eliminated without a knockout appearance — and the LFA\'s commercial team understands the stakes. Whatever happens on the pitch, AFCON 2027 will be the most commercially consequential tournament in Liberian football history.',
    ],
  },
  {
    slug: 'monrovia-fc-stadium-ppp',
    section: 'main',
    category: 'Football',
    title: "Monrovia FC's new stadium deal: $18M PPP project explained",
    summary:
      "The club's groundbreaking public-private partnership with the Liberian government and a Ghanaian construction firm could transform club revenues within three seasons.",
    source: 'TrueRate Sports',
    time: 'Jun 20, 2026',
    body: [
      "Monrovia FC, the LFA League's reigning champions, last week signed a public-private partnership agreement with the government of Liberia and Accra-based Adeshina Construction to build a new 12,000-capacity stadium in Paynesville, on the eastern edge of the capital. The total project cost is $18M, financed through a 60/30/10 split: the developer covers 60%, the club 30%, and the government 10% in the form of land contribution and infrastructure access.",
      'The structure is unusual for African football. Most club-developed stadiums on the continent are either fully government-funded — a model that ties construction timelines to fiscal cycles and political turnover — or fully privately financed, which restricts ownership to the wealthiest clubs. The PPP model splits risk between the parties and grants Monrovia FC a 30-year operating concession, including non-football event revenue.',
      'Monrovia FC\'s commercial director Amos Sumo told TrueRate the club has modelled stadium revenues to add between $1.4M and $1.8M annually to the club\'s top line by year three of operation. That uplift comes from three sources: ticketed match-day revenue (the club currently plays at the Doe Stadium and shares ticket revenue with the LFA); commercial naming rights (initial bids from Orange Liberia and Liberia Petroleum value the stadium\'s name at $400K/yr); and non-football events including concerts and graduations.',
      'Construction is expected to take 24 months, with delivery targeted for the start of the 2028 season. The most-cited risk in the deal is the Ghanaian developer\'s financing chain: Adeshina has access to ECOWAS Bank for Investment and Development (EBID) facilities, but final draw-down has not been confirmed. If EBID funding is delayed, the project could slip a season — a scenario the club has stress-tested but not formally disclosed to its commercial partners.',
    ],
  },
  {
    slug: 'lfa-commercial-revenue-deficit',
    section: 'main',
    category: 'Football',
    title: 'LFA commercial revenue up 31% — but the league still runs at a $2.1M annual deficit',
    summary:
      'Growing sponsorship and gate receipts mask a structural funding gap that the Football Association has yet to close with broadcast income.',
    source: 'LFA / TrueRate',
    time: 'Jun 20, 2026',
    body: [
      'The Liberia Football Association\'s 2025 financial statements, released this week, show commercial revenue at $4.6M — a 31% year-over-year increase driven primarily by the new CBL/Government federation sponsorship and a 22% rise in matchday gate receipts following Liberia\'s AFCON qualification. Yet the federation continues to run an annual operating deficit of approximately $2.1M, funded by a combination of FIFA forward grants and CAF development payments.',
      "The gap is structural rather than operational. The LFA's two largest cost lines — international travel for the senior men's national team (approximately $1.8M in 2025) and domestic competition operating costs ($2.4M) — are both growing in line with international football economics, and have outpaced the federation's own commercial growth.",
      "Broadcast revenue is the most significant line not currently performing. The LFA League's domestic TV deal, with ELBC and Orange Liberia, generates only $1.8M annually — a fraction of comparable West African leagues and well below what the LFA's own commercial plan, drafted in 2023, projected. Federation president Mustapha Raji has said publicly that the league's broadcast strategy is being reviewed, with a possible move to a streaming-first model under consideration.",
      'In the absence of a broadcast uplift, the LFA is leaning more heavily on prize money and sponsorship. AFCON 2027 prize money is the single largest near-term variable: a quarter-final exit would, on its own, eliminate the deficit for two consecutive years. The federation has not formally budgeted that windfall, but its 2026/27 financial plan includes a "qualified contingency" line that, on closer reading, assumes group-stage progression at minimum.',
    ],
  },
  {
    slug: 'nbl-africa-monrovia-franchise',
    section: 'main',
    category: 'Basketball',
    title: 'NBL Africa franchise expansion: what a Monrovia team would cost and generate',
    summary:
      'A new NBA Africa-backed franchise report estimates $6M entry fee and $2.8M annual operating costs against projected $4.1M in revenue by year three.',
    source: 'NBA Africa',
    time: 'Jun 20, 2026',
    body: [
      'NBA Africa\'s confidential franchise expansion brief, prepared by Boston Consulting Group and shared with three Liberian-led investor groups, prices a Monrovia BAL franchise at a $6M entry fee, payable across three tranches between 2026 and 2028. The brief, parts of which TrueRate has reviewed, projects annual operating costs of $2.8M against revenue of $4.1M by year three — a 32% operating margin if performance lands within the central case.',
      'The cost stack is mostly fixed. Player and coaching salaries are the largest line at $1.4M annually, governed by the BAL\'s soft cap structure. Travel, training, and game-day operations sit at approximately $750K, with administration and league fees at $650K. The variable component — player bonuses, playoff travel, and arena fit-out — is approximately $400K per year on top.',
      'Revenue projections rely on three streams: ticketing ($1.1M, assuming 78% sell-through at the SKD complex with a $24 average ticket price), commercial sponsorship ($2.1M, of which $1.3M comes from a single title sponsor and the balance from 4–6 secondary deals), and league distribution ($900K from BAL central deals on broadcast and merchandise). The model assumes Monrovia outperforms the BAL average on ticketing, given the basketball culture density in the city, and slightly underperforms on commercial sponsorship in the early years.',
      'Three Liberian-led groups are reported to be assembling bids: a consortium led by entertainment entrepreneur F. Diaz, a sports-only vehicle backed by an unnamed UAE family office, and a cross-border bid involving Ghanaian and Senegalese co-investors. A formal RFP is expected from the BAL in the second half of 2026.',
    ],
  },
  {
    slug: 'pewee-most-valuable-since-weah',
    section: 'main',
    category: 'Football',
    title: 'How Marcus Pewee became the most valuable Liberian player since Weah — the numbers',
    summary:
      "Rivers Hoopers' $840K contract and pre-draft NBA valuation make Pewee the highest-earning Liberian athlete in active competition.",
    source: 'TrueRate Sports',
    time: 'Jun 20, 2026',
    body: [
      "Marcus Pewee, the 22-year-old shooting guard who signed a two-year, $840K contract with Nigeria's Rivers Hoopers in March, has become the highest-earning Liberian athlete in active competition — surpassing Comfort Brown's $220K annual sponsorship total and outstripping any active Liberian footballer outside George Weah's 1990s peak.",
      'Pewee\'s valuation is built on three layers. The Rivers Hoopers base salary is $360K/year, the largest in the BAL outside the Petro de Luanda squad. His pre-draft NBA combine in Chicago last summer added a six-figure signing bonus on top. And a separate sponsorship slate — comprising Orange Liberia, NBA Africa\'s endemic partners, and a Lagos-based sportswear deal — adds approximately $140K/year. The package gives him an effective annual income above $500K when amortised across the contract.',
      'The historical comparison to Weah is instructive but imperfect. Weah, at his peak with AC Milan, was earning approximately $4.5M/year in late-1990s Liberian terms — a figure that, even adjusted for inflation, dwarfs Pewee\'s. But on relative terms — meaning a Liberian athlete\'s pay relative to the country\'s GDP per capita and the median professional sports salary in their discipline — Pewee\'s package is the highest since Weah\'s prime.',
      'The commercial significance for Liberia is the precedent it sets. Pewee\'s deal demonstrates that the BAL\'s salary infrastructure can support a Liberian-headlined contract at a level that previously required European club football. If a credible NBA path opens — Pewee is widely projected as a late-first or early-second round pick in the 2026 draft — his earnings ceiling shifts again, with rookie-scale contracts starting at $2.4M/year.',
    ],
  },
  {
    slug: 'shirt-sponsorship-west-africa-survey',
    section: 'main',
    category: 'Football',
    title: 'Shirt sponsorship in West African football: deals, values, and the brands that pay the most',
    summary:
      "A survey of 40 top-flight clubs finds median jersey deal values of $120K/year — with Monrovia FC's Orange partnership among the region's top 10.",
    source: 'Sportcal',
    time: 'Jun 19, 2026',
    body: [
      'Sportcal\'s 2026 West Africa shirt sponsorship survey, covering 40 top-flight clubs across eight leagues, places median jersey deal value at $120K per year — up 8% on 2025 — and total annual top-flight shirt-deal spend at approximately $48M across the region. The survey is the most comprehensive of its kind since 2022.',
      "Telco operators dominate the category. Orange (France-based, with subsidiaries in Liberia, Senegal, Ivory Coast, and Burkina Faso) and MTN (South African, with subsidiaries in Nigeria, Ghana, and Liberia) together account for 38% of total shirt-deal spend in the region. The brands' rationale, summarised in industry reports, is consistent: young male subscribers are the most over-indexing demographic for football fandom, and shirt sponsorship is one of the few media properties in West Africa that delivers them at scale and with low ad fragmentation.",
      "Liberian clubs sit in the upper-mid tier of the regional distribution. Monrovia FC's $320K/year Orange Liberia deal is the 9th largest shirt deal in the survey — the only Liberian deal in the top 10. LISCR FC's $180K/year Lonestar MTN deal is in the top 25. Both deals are scheduled to expire in 2026 and 2027 respectively, with renewal negotiations in early stages.",
      'The 2026 survey identifies three trends to watch. First, a shift from one-year exclusive sleeve deals to two- or three-year primary deals as currencies stabilise. Second, increasing pressure from clubs to include performance-related uplifts (e.g., 15% bonus on continental qualification). And third, the emergence of fintech sponsors — including a recent NCBA bank deal in Kenya that may herald similar moves in Liberia and Ghana.',
    ],
  },
  {
    slug: 'comfort-brown-220k-sponsorship',
    section: 'main',
    category: 'Athletics',
    title: "Comfort Brown's commercial value: sponsorship worth $220K — and growing fast",
    summary:
      'After breaking the West African 100m record, the sprinter has attracted Puma, MTN, and Liberia Petroleum as sponsors in a six-month window.',
    source: 'TrueRate Sports',
    time: 'Jun 19, 2026',
    body: [
      'Comfort Brown, the 23-year-old sprinter who broke the West African 100m record in Dakar last October with a time of 9.87 seconds, has assembled a $220K annual sponsorship package across three core partners — Puma (kit and footwear, $110K), MTN (telco endorsement, $70K), and Liberia Petroleum (presenting partner for her domestic appearances, $40K). Her commercial value has tripled in the six months since the record run.',
      "Brown's representation by Lagos-based Athletes Africa Group has been central to the trajectory. The agency negotiated each deal individually rather than bundling, a structure that allowed her to retain higher per-partner economics but created higher administrative overhead than is typical for an African athlete at her career stage. Her Puma deal, signed in February, includes performance escalators tied to medalling at the World Championships and Olympic Games — a structure rarely seen in African athletics endorsements before 2024.",
      "The next inflection point is the 2026 World Athletics Championships in Tokyo. Industry valuations for Brown's post-Tokyo commercial trajectory are aggressive: a top-eight finish would, by current Athletes Africa modelling, support a $400K annual package; a medal would push her into the $750K–$1M range and likely add a global brand outside the African market. Her current packages all include 60-day renewal windows post-Worlds, which is industry-standard for athletes with material upside.",
      'The Brown story has also altered the commercial market for Liberian athletics broadly. World Athletics\' incoming MTN sponsorship explicitly cites Brown as a brand reference; the Liberia Athletics Federation reports increased corporate inquiries about partnership packages tied to other emerging Liberian athletes. The trajectory of the next 18 months will determine whether Brown remains an outlier or becomes the template for Liberian athletics commercialisation.',
    ],
  },
  {
    slug: 'wafu-cup-semi-final-liberia-guinea',
    section: 'main',
    category: 'Football',
    title: 'WAFU Cup semi-final preview: Liberia vs Guinea — tactical and financial breakdown',
    summary:
      "Liberia's Lone Star faces Guinea in the WAFU Cup semi-final. We break down the prize money at stake, the tactics, and what a final appearance would mean commercially.",
    source: 'TrueRate Sports',
    time: 'Jun 18, 2026',
    body: [
      "Liberia's Lone Star faces Guinea on Saturday in the WAFU Cup semi-final, with $400K in additional prize money on the line for the winner alongside the title-bound prize of $800K. The match, staged in Bamako under CAF supervision, will be Liberia's first competitive semi-final appearance in the WAFU Cup since the 2017 tournament.",
      "Tactically, the match is between a Guinean side built around Bayer Leverkusen midfielder Mohamed Diaby and a Liberian side that has, throughout this WAFU Cup, played a 4-3-3 with high pressing rooted in Coach Mario Marinica's possession-first philosophy. Liberia's most reliable attacker through the tournament has been Tiawan Kollie, the Monrovia FC striker on a six-month loan from FC Sheriff (Moldova), who has scored four goals in three matches.",
      "Commercially, a final appearance would unlock the WAFU Cup's tier-2 broadcast bonus pool — approximately $250K — payable to finalists, in addition to a CAF appearance fee of $180K. Domestic broadcast rightsholder ELBC has indicated that domestic ratings during the WAFU Cup have already lifted ad rates by 35%, with the final positioned as the highest-rated single sports broadcast in Liberian television since the 2002 World Cup qualifiers.",
      "Beyond the financial mechanics, the tournament has surfaced a coaching question. Marinica's contract expires in December 2026, and the LFA's technical committee has begun preliminary scoping of replacement candidates. A semi-final win — and a final against Nigeria or Senegal — would likely make the question of his renewal a formality.",
    ],
  },
  {
    slug: 'nba-africa-monrovia-2026',
    section: 'main',
    category: 'Basketball',
    title: 'NBA Africa Monrovia 2026: venue, ticket revenue, and the long-term legacy',
    summary:
      'With a venue confirmed and ticket sales open, we model the $4.2M economic impact — and ask whether a permanent NBA Africa franchise in Liberia is now realistic.',
    source: 'TrueRate Sports',
    time: 'Jun 18, 2026',
    body: [
      'The NBA Africa Series 2026 in Monrovia, scheduled for November at the refurbished Samuel Kanyon Doe Sports Complex, has crystallised a question that until last year was speculative: is Liberia ready for a permanent BAL franchise? The answer, on the operational and commercial criteria the BAL evaluates, is closer to yes than industry observers initially expected.',
      "The Series itself is a commercial showcase. Independent modelling commissioned by the Liberia Football Association puts gross local economic impact at $4.2M, of which approximately $1.6M is direct ticket and concession revenue and the balance is hospitality and tourism uplift. Tickets, priced from $12 to $180, are tracking ahead of the BAL's pre-launch sell-through projections in similar host markets — early-bird allocation cleared 40% of capacity within 72 hours.",
      'The franchise question is governed by three criteria. Arena infrastructure: Monrovia clears the bar with the SKD refurbishment, though a permanent franchise would require additional broadcast infrastructure investment of approximately $1.8M. Investor capacity: at least three credible Liberian-led investor groups have engaged with NBA Africa\'s expansion brief. And market depth: the BAL\'s modelling expects approximately 4,500 average attendance for a Monrovia franchise — workable but at the lower end of league economics.',
      'A formal franchise application window is expected to open in the second half of 2026, with awards announced for the 2027 season. NBA Africa officials have privately acknowledged that the Series 2026 commercial outturn will materially shape the application process. If sell-through holds and corporate engagement remains strong, Monrovia is in serious contention for the league\'s 13th franchise slot.',
    ],
  },
  {
    slug: 'liberia-u20-academy-pipeline',
    section: 'main',
    category: 'Football',
    title: "Liberia's youth football pipeline: how the U20 system could become a commercial asset",
    summary:
      'With four Liberian under-20s attracting European scout interest, the LFA is exploring a $500K academy partnership model with a Premier League club.',
    source: 'TrueRate Sports',
    time: 'Jun 17, 2026',
    body: [
      "Four Liberian under-20s — Kollie, Sumo, Pewee (the footballer, no relation to the basketball player), and Toe — have been on European scout watchlists since the 2025 WAFU U20 tournament, where Liberia reached the semi-finals. The interest has prompted the LFA to formally scope a $500K academy partnership with a Premier League club to monetise the pipeline.",
      'The proposed structure, modelled on FA-Brighton and FA-City Group academy partnerships in West Africa, would have the Premier League partner fund a residential academy in Monrovia and acquire a right of first refusal on academy graduates aged 18 and over. The LFA would receive an annual licensing fee of approximately $200K and a 15% share of any subsequent transfer fee on partner-developed players.',
      "Three Premier League clubs — none yet named publicly — have entered exploratory talks. The most-cited interest comes from a club that operates a similar academy partnership in Ghana and is looking to expand its Liberian and Sierra Leonean footprint. The deal, if signed, would be the first of its kind in Liberia.",
      "Domestic clubs are watching the negotiation closely. The LFA's structure would, by design, route academy graduates through a single Premier League partner — a model that could displace existing club youth pipelines at Monrovia FC, LISCR FC, and BYC FC. The commercial committee of the LFA has scheduled a stakeholder consultation for May 2026 to align on a structure that protects domestic-club development pathways alongside the partnership.",
    ],
  },
  {
    slug: 'west-africa-athletics-grand-prix',
    section: 'main',
    category: 'Athletics',
    title: 'West Africa Athletics Grand Prix returns to Monrovia — $180K prize pool announced',
    summary:
      'The continental circuit event returns after a two-year absence, with prize money up 60% and broadcast coverage confirmed on SuperSport.',
    source: 'World Athletics',
    time: 'Jun 17, 2026',
    body: [
      'World Athletics has confirmed Monrovia as host of the 2026 West Africa Athletics Grand Prix, with a meet date of 14 June at the National Stadium. The $180K prize pool is a 60% increase on the 2023 edition and the largest single-meet prize purse offered in Liberian athletics history.',
      "Prize money is structured by event group. The 100m and 200m sprints — expected to feature Comfort Brown — carry a $25,000 first-place prize, the highest in the meet. Middle-distance and field-event prizes scale from $15,000 to $5,000 across podium finishes. The structure is consistent with the World Athletics Continental Tour bronze-tier framework.",
      "Broadcast coverage is confirmed on SuperSport's Pan-African feed and Eurosport's Africa-targeted secondary channel — the first time Eurosport has carried a Liberian athletics meet since 2018. The broadcast deal is expected to deliver an audience of approximately 8M cumulative viewers across the continent, a number that materially shifts the meet's commercial profile.",
      "The meet's title sponsor, Liberia Petroleum, paid $400K for naming and presenting rights — a fee that, on its own, covers approximately 40% of operational costs. The Liberia Athletics Federation has indicated that a successful 2026 edition would support a renewed three-year commitment from World Athletics, locking Monrovia into the Continental Tour calendar through 2028.",
    ],
  },

  // ── /sports/sponsorship ────────────────────────────────────────────────
  {
    slug: 'top-10-shirt-deals-west-africa',
    section: 'sponsorship',
    hero: true,
    category: 'Football',
    title: 'Shirt sponsorship in West African football: the 10 biggest deals, ranked',
    summary:
      "A survey of 40 top-flight clubs finds median jersey deal values of $120K/yr — with Monrovia FC's Orange partnership among the region's top 10. Here are the full numbers.",
    source: 'TrueRate Sports Business',
    time: 'Jun 20, 2026',
    body: [
      "TrueRate Sports Business has compiled a ranked list of West Africa's 10 largest shirt sponsorship deals — a snapshot of the commercial depth in the region's top-flight football clubs as of April 2026. The ten deals together account for roughly $4.8M of annual rights value, dominated by Nigerian Premier League clubs but with strong Liberian and Ghanaian representation.",
      "The top deal is Enyimba's $720K/yr partnership with Dangote Cement, signed in late 2024 and running through 2027. Nasarawa United's $580K/yr Konga deal sits second; Hearts of Oak's $510K/yr deal with MTN Ghana is third. Liberia's Monrovia FC enters the list at number nine, with its $320K/yr Orange Liberia agreement — the only Liberian deal in the top 10 and one of two telco-led deals in the top half of the ranking.",
      'What unites the top deals is structure rather than brand. Eight of the ten are multi-year (three-year minimum), include performance-linked uplifts tied to continental qualification, and bundle digital and broadcast rights alongside front-of-shirt placement. The two outliers — both Nigerian deals — are single-season agreements, reflecting the FX volatility that has driven shorter-tenor commercial commitments in that market.',
      "Looking ahead, the 2026 sponsorship cycle will test whether the top-tier deals can hold their dollar values against weakening regional currencies. Liberian deals, denominated in USD with a fixed CBL reference rate, have proven more resilient than Nigerian and Ghanaian deals during recent FX cycles. That structural advantage is one reason brand interest in Liberian top-flight clubs has accelerated despite the country's smaller domestic media market.",
    ],
  },
  {
    slug: 'orange-vs-mtn-sponsorship-arms-race',
    section: 'sponsorship',
    category: 'Football',
    title: 'Orange vs MTN: the Liberian telco sponsorship arms race',
    summary: 'Both carriers are expanding football portfolios to reach young male subscribers.',
    source: 'TrueRate Sports',
    time: 'Jun 20, 2026',
    body: [
      "Orange Liberia and Lonestar Cell MTN — the two licensed mobile network operators in Liberia — have committed approximately $1.2M between them to football sponsorships in 2026, a 38% increase on 2024 levels. The race is structural: both carriers compete for the same demographic of 18-to-34 male subscribers, where football fandom is the highest-indexing media property available.",
      "Orange's portfolio is anchored by the Monrovia FC shirt deal ($320K/yr, running through 2026 with a renewal under negotiation) and supplementary partnerships with the LFA League ($180K presenting-sponsor placement) and the Lone Star Foundation, the LFA's grassroots arm. The carrier's strategy, according to its commercial director Mariama Kromah, is to bundle football access into post-paid subscriber tiers — a model that delivered a 14% post-paid uplift in 2025.",
      "MTN's strategy, structured by Lonestar Cell MTN CCO Aaron Toe, leans more on national-team association. The carrier holds a $90K/yr LFA partnership, the LISCR FC kit deal ($180K/yr), and a multi-year telecom-services partnership with the Liberia Athletics Federation valued at approximately $70K/yr. MTN's emphasis on the national-team association rather than club shirt deals reflects, in part, the brand's broader West Africa positioning around AFCON 2027.",
      "What differentiates the two carriers in the eyes of brands and clubs is not portfolio size but activation depth. Orange has been more aggressive on bundled subscriber promotions — match-day data passes, shirt-with-airtime bundles — while MTN has invested more heavily in retail and out-of-home presence. Both strategies are working, with each carrier reporting subscriber acquisition uplift attributable to football sponsorship in 2025 financial filings.",
    ],
  },
  {
    slug: 'comfort-brown-brand-value-tripled',
    section: 'sponsorship',
    category: 'Athletics',
    title: "How Comfort Brown's brand value tripled in six months",
    summary: 'A record run, a US agent, and the first Liberian athlete to clear $200K in sponsorships.',
    source: 'TrueRate Sports',
    time: 'Jun 19, 2026',
    body: [
      "Comfort Brown's $220K/yr sponsorship total — a tripling of her commercial value in the six months since her 9.87s West African 100m record — is the result of three concrete decisions that, taken together, restructured how Liberian athletics talent is monetised.",
      'The first was choice of representation. Brown signed with Lagos-based Athletes Africa Group in November 2025, three weeks after her record. The agency, founded by former Nigerian sprinter Blessing Okagbare, specialises in sub-Saharan African athletics talent and has the rare combination of regional brand relationships and access to global rights structures that Brown\'s previous Liberian-only representation could not offer.',
      'The second was structuring. Brown\'s deals are denominated in USD with quarterly disbursement schedules — a structure that protects the athlete from local FX volatility but has historically been resisted by Liberian-domiciled sponsors. The breakthrough came when Liberia Petroleum, acting as a presenting sponsor for her domestic appearances, agreed to USD payment with a 90-day FX hedge built in. Once that precedent was set, Puma and MTN followed.',
      'The third decision was timing. Brown\'s deals were closed in a six-week window between the record run and her first post-record international appearance, the Doha Diamond League stop. By concentrating the negotiations into that window, Athletes Africa retained pricing power that would have eroded had Brown finished outside the podium in Doha. She finished fourth — a strong but not transformative result — but by that point the deals were already signed.',
      "The Brown template is now being replicated. Two emerging Liberian athletes — middle-distance runner Princess Hayes and 400m hurdler Joseph Tarpeh — have signed with Athletes Africa in the past quarter, each on the back of a single high-profile result. Whether their commercial trajectories match Brown's will determine whether the playbook is reproducible or whether Brown's run was an outlier event.",
    ],
  },
  {
    slug: 'lfa-federation-sponsorship-renewal',
    section: 'sponsorship',
    category: 'Football',
    title: "The LFA's federation sponsorship up for renewal — bidders lining up",
    summary: 'CBL, Orange, and a new entrant have all signalled interest.',
    source: 'TrueRate Sports',
    time: 'Jun 18, 2026',
    body: [
      "The Liberia Football Association's federation-level sponsorship — currently held jointly by the Central Bank of Liberia and the Government of Liberia at a combined $600K/year — expires at the end of 2026, and three bidders have formally signalled interest in the next cycle. The renewal negotiation is the most consequential federation-sponsorship review in Liberian football since 2018.",
      "The incumbent bidder — the joint CBL/Government structure — has indicated willingness to extend at the current rate of $600K/year for a further three-year term. That offer is expected to land formally with the LFA's commercial committee by May. The political weight of a CBL/Government renewal is not negligible: the structure carries goodwill across Liberian institutional stakeholders that a new entrant could not replicate.",
      "Orange Liberia, currently the title sponsor of Monrovia FC, has filed a non-binding expression of interest at $750K/year. Orange's bid would consolidate its football portfolio at the federation level — a structure the carrier has already deployed in three other African markets. The most-cited risk for the LFA is portfolio concentration: an Orange federation deal alongside its existing Monrovia FC and LFA League placements would deliver ~$650K of total telco-related sponsorship through a single brand.",
      'The new entrant — sources name a Lagos-headquartered fintech that has not yet operated in Liberia — has indicated a $850K/year ceiling, contingent on the LFA agreeing to bundled fintech rights including LFA member federation payment processing. The structure is more aggressive than either incumbent option but introduces operational complexity. The LFA Commercial Committee is expected to recommend a preferred bidder by Q3 2026.',
    ],
  },
  {
    slug: 'nba-africa-sap-title-deal',
    section: 'sponsorship',
    category: 'Basketball',
    title: "NBA Africa's SAP title deal: what comes next at $8M/yr",
    summary: 'Three options on the table, including a pivot to a consumer brand.',
    source: 'TrueRate Sports',
    time: 'Jun 18, 2026',
    body: [
      'NBA Africa\'s title sponsorship with SAP — the league\'s name has carried "presented by SAP" since 2021 — runs through the end of 2026 at $8M/year, the largest single sponsorship in African basketball. With the renewal window now open, NBA Africa\'s commercial team is weighing three structurally different options for the next cycle.',
      'The simplest is a SAP renewal. SAP has indicated commitment to the property at slightly higher economics — a renewed deal is expected to land at $9–10M/year for three years — and the relationship has matured into one of the most stable enterprise-software partnerships in African sport. The argument against is exposure: SAP\'s renewal would leave NBA Africa with concentration risk in a single enterprise sponsor.',
      'The second option is a pivot to a consumer brand. NBA Africa has had exploratory conversations with two pan-African beverage brands and one telco group about title sponsorship. A consumer-brand deal would deliver lower headline economics (probably $6–7M/year) but would substantially shift the league\'s grassroots activation profile. The most-cited concern is execution capacity: pan-African consumer brands have variable execution standards across markets.',
      "The third option is a co-title structure — splitting title rights between two parties at $4–5M each. The model is unusual in African sport but precedented in the NBA's global structure. NBA Africa's commercial advisors have flagged this as the option with the highest upside but the highest deal-complexity risk.",
      'A formal RFP is expected by August 2026, with a decision in Q4. Whatever the outcome, the next NBA Africa title cycle will be the largest single basketball sponsorship in Africa\'s history — a fact that, as much as any individual deal, signals where the continental basketball commercial market is heading.',
    ],
  },

  // ── /sports/transfers-deals ────────────────────────────────────────────
  {
    slug: 'pewee-rivers-840k-negotiation',
    section: 'transfers',
    hero: true,
    category: 'Basketball',
    title: "Marcus Pewee's $840K deal is the biggest Liberian basketball contract ever. Here's how it happened.",
    summary:
      "A forensic breakdown of the negotiation that took Rivers Hoopers' newest star from free agent to the highest-earning Liberian athlete in active competition — and what it signals for the NBL Africa market.",
    source: 'TrueRate Sports Business',
    time: 'Jun 20, 2026',
    body: [
      "The Marcus Pewee–Rivers Hoopers deal, signed on 14 March, is structured as a two-year agreement worth $840,000 — $360K in year one, $400K in year two, with a $80K signing bonus payable on completion of the medical. It is the largest single-player contract in NBL Africa history outside the Petro de Luanda squad and the largest contract any Liberian athlete has signed in any sport since 2008.",
      "The negotiation began in early February, three weeks after Pewee's NBA combine in Chicago. Rivers Hoopers' general manager Akin Ladipo had identified Pewee as the team's priority free-agent signing in late 2025; what changed in February was the financial scope. After Pewee's combine performance — particularly his shooting splits — Ladipo went back to ownership and secured authorisation to bid above the BAL\\'s typical $250K/year ceiling for non-Angolan free agents.",
      "Pewee's representation, Lagos-based Athletes Africa Sports Division, ran a parallel negotiation with two Egyptian BAL teams. The Egyptian offers — both in the $280–320K/year range — were used as anchor points but were never the primary commercial focus, given Rivers Hoopers' aggressive opening offer. The decisive moment came on 8 March when Hoopers ownership conceded on a previously contested term: Pewee's right to opt out after year one if he is selected in the 2026 NBA Draft.",
      "The opt-out is the most consequential clause in the deal. If Pewee goes in the first round (current projections place him 24th–32nd), the rookie-scale contract values for those slots range from $2.4M–$3.1M annually. The Hoopers' option to retain Pewee through year two of his BAL deal therefore depends entirely on his draft outcome — a risk Hoopers ownership accepted in return for the marquee signing.",
      "For the BAL, the deal is a market-shifting event. Until February, the league's salary structure assumed a $250K/year ceiling for non-marquee free agents and a $400K/year ceiling for franchise players. The Pewee deal — for a 22-year-old with no BAL track record — implicitly resets those ceilings. Three other BAL teams have already raised internal bid authorisations on out-of-contract free agents in response.",
    ],
  },
  {
    slug: 'rivers-record-money-pewee',
    section: 'transfers',
    category: 'Basketball',
    title: 'Why Rivers Hoopers were willing to pay record money for Pewee',
    summary: "The Nigerian club's scouting file, the counter-offers, and the playmaking metrics that closed the deal.",
    source: 'TrueRate Sports',
    time: 'Jun 20, 2026',
    body: [
      "Rivers Hoopers' decision to bid $420K/year for Marcus Pewee — almost double the BAL's prior ceiling for non-marquee free agents — was rooted in a 14-month scouting cycle that began at the 2024 BAL playoffs. The team's analytics team, led by data scientist Ifeoma Eze, had flagged Pewee's true-shooting percentage and assist-to-turnover ratio as outliers among NBL Africa qualifiers.",
      'The internal model the Hoopers used — a roster-fit projection adapted from MLB sabermetrics frameworks — projected Pewee\'s offensive value at approximately 6.4 wins above replacement over a two-year contract. At the league\'s implicit $50K-per-win benchmark for franchise players, that placed his ceiling value around $640K — well above the $250K/year threshold the BAL had historically supported for free agents.',
      "What pushed the bid beyond the model output was strategic context. Rivers Hoopers' ownership group, led by Nigerian businessman Tony Elumelu, had publicly committed to a BAL Final Four appearance by 2027. The team's existing roster lacked a primary playmaker in the modern position-less mould — exactly the role Pewee was projected to fill. The strategic premium on top of the model output justified, in ownership's view, the additional $200K/year above the analytics ceiling.",
      "The negotiation strategy was also distinctive. Rather than match competing offers, Hoopers led with their best number on day one. The strategy was risk-loaded: it foreclosed the possibility of a counter-bid escalation but signalled certainty that Pewee was the team's priority. By 5 March — three weeks before the deadline — Athletes Africa had effectively committed to closing the deal with Hoopers contingent on the opt-out clause.",
    ],
  },
  {
    slug: 'monrovia-fc-summer-plan',
    section: 'transfers',
    category: 'Football',
    title: "Monrovia FC's summer plan: three outgoing, two incoming — and a new CFO",
    summary: "With budget tightening and a league title push, the club's sporting director explains the trade-offs.",
    source: 'TrueRate Sports',
    time: 'Jun 20, 2026',
    body: [
      "Monrovia FC's summer 2026 transfer plan, briefed to TrueRate by sporting director Daniel Bardor, is built around three outgoing transfers, two incoming signings, and a structural change in the club's commercial leadership. The strategy is shaped by a 14% reduction in the club's player budget for 2026/27 and the priority of defending the LFA League title.",
      'The three outgoing players — defender Ibrahim Kamara (sold to Williamsville AC, $310K), striker Emmanuel Kollie (loan to LISCR FC, with a $280K option to buy), and goalkeeper Patrick Toe (released as a free agent) — together free up approximately $480K of annual wage budget. The largest single saving is on Kamara, whose departure also delivers a $310K transfer fee.',
      "Incoming, the club is in advanced talks with two players: a Nigerian-American midfielder, Adam Sesay, currently at FC Cincinnati's reserve squad in MLS Next Pro, and Liberian U20 striker Sekou Manneh. Sesay is the bigger commitment — his projected fee is approximately $200K with a $120K/year wage — and represents the club's first signing from US-development-system football.",
      "The structural change is the appointment of a CFO with primarily commercial responsibilities. Until now, Monrovia FC's CEO Jubilee Cooper has held both operational and commercial accountability. The new CFO — expected to be named in May — will report jointly to Cooper and the chairman, with a brief that includes leading the new stadium PPP financial structuring, managing the Orange Liberia shirt-deal renewal, and rebuilding the club's media-rights revenue line.",
    ],
  },
  {
    slug: 'how-west-african-clubs-price-players',
    section: 'transfers',
    category: 'Football',
    title: 'How West African clubs price players: the hidden factors',
    summary: 'Age, position, international appearances — and the big one nobody names: social media following.',
    source: 'Sportcal',
    time: 'Jun 19, 2026',
    body: [
      'TrueRate has reviewed the player-pricing models used by 18 top-flight West African clubs across six leagues. The factors that explicitly enter the models are predictable — age (sharply positive between 19 and 24, declining thereafter), position (centre-forward and central midfield premium), international appearances (a roughly $35K-per-cap uplift for senior internationals), and goals/assists per 90 minutes.',
      'What these models miss — and what increasingly drives transactional pricing — is social media following. Players with verified Instagram followings above 100,000 carry a price premium of, on average, 22% above their model value. Above 500,000 followers the premium reaches 38%. The mechanism is straightforward: social presence is, for clubs, a proxy for the player\'s capacity to drive shirt and merchandise revenue, regional broadcast pickup, and post-career sponsorship.',
      'Liberian players sit at the lower end of the social-media-following distribution. The country\'s digital infrastructure and population profile both contribute — only one Liberian top-flight player has more than 50,000 verified followers. The result is that Liberian players are systematically priced below their on-pitch performance levels would suggest, by an estimated 15–20%.',
      "There are three interventions the LFA and individual clubs are exploring to address this. First, club-led social media training (already piloted at Monrovia FC). Second, structured content partnerships with Lagos-based digital agencies who can scale Liberian player presence in the West African diaspora. And third, deal structures that include explicit social-media performance bonuses — a feature that has appeared in two recent Liberian player contracts and is expected to become standard within 18 months.",
    ],
  },
  {
    slug: 'agent-commissions-liberia',
    section: 'transfers',
    category: 'Football',
    title: 'Agent commissions in Liberia: unregulated, opaque, and growing',
    summary: 'A survey of 22 recent deals finds median commissions of 12% — well above FIFA guidance.',
    source: 'TrueRate Sports',
    time: 'Jun 19, 2026',
    body: [
      "TrueRate's survey of 22 Liberian player transfers completed between January 2025 and March 2026 finds median agent commissions of 12% of total transfer value — substantially above FIFA's 3% guidance for non-affiliated clubs and well above the 5–7% range typical in larger West African markets. The figure varies widely (from 5% to 22%), suggesting that the absence of standardised pricing is itself a market failure.",
      "The structural drivers are well-documented. Liberia has no licensed football agent register; agents do not need to clear a background or competency test to operate; and the LFA has no enforcement mechanism for FIFA's intermediary regulations beyond a moral-suasion role. The result is a market where commission is set bilaterally between agent and player, with the buyer-side club typically uninformed of the commission structure.",
      "The cost is felt most acutely by junior players. A 19-year-old striker signing his first professional contract for $30K typically has limited capacity to negotiate down commission; a 12% commission therefore costs $3,600 — equivalent to four months of subsistence-level living costs in Monrovia. For senior players, the commissions are larger in absolute terms but are typically a smaller fraction of total compensation.",
      'The LFA has signalled, through the chair of its commercial committee, that an intermediary register is in development for the 2027 season. The framework would require agents to register with the federation, pass a competency exam, and adhere to a fee cap of approximately 8% of transfer value. The most contentious issue in the framework debate is enforcement: the LFA has limited resources to police agent-fee disclosures even after registration.',
    ],
  },

  // ── /sports/broadcast-rights ───────────────────────────────────────────
  {
    slug: 'afcon-2027-340m-deal-explained',
    section: 'broadcast',
    hero: true,
    category: 'Football',
    title: 'AFCON 2027 broadcast rights: the $340M deal, fully explained',
    summary:
      "Liberia's qualification has lifted regional viewership projections 12%. We map the rights-holders, the prize pool, and what CAF's next auction cycle will look like.",
    source: 'TrueRate Sports Business',
    time: 'Jun 20, 2026',
    body: [
      "The AFCON 2027 broadcast package, structured by CAF and sold through IMG, generates $340M in total rights revenue across global markets. The package is split into nine territorial buckets, with the largest single market — Sub-Saharan Africa — accounting for $145M of the total, sold jointly to SuperSport and beIN Sports under a co-production structure unique to this tournament cycle.",
      "The remaining $195M comes from eight territorial sales: North America ($45M, sold to ESPN and TUDN), Europe ($55M, primarily to Eurosport and a syndicated FTA package), MENA ($28M to beIN), the UK ($24M to BBC/ITV jointly), and four smaller territorial buckets totalling $43M. The package value represents a 22% uplift on AFCON 2025 — a number that already reflected COVID-recovery growth in continental sport.",
      "Liberia's qualification, while not material to the tournament's headline rights value, has prompted a noticeable secondary effect: SuperSport's and beIN Sports' digital products have both seen Liberian-targeted streaming pre-orders rise sharply since qualification was confirmed. SuperSport's Showmax has reported approximately 8,000 incremental Liberian subscribers in March alone — a small absolute number but a 14% uplift on the country's pre-qualification subscriber base.",
      "The CAF prize-money structure, separate from the broadcast deal, is funded principally by FIFA's solidarity pool and CAF's own rights revenue. Group-stage exits pay $700K per federation; the round of 16 lifts payouts to $1.25M; quarterfinalists receive $2.5M; semifinalists $4M; the runner-up $5M; and the champion $7M. For Liberia, the LFA has confirmed that 25% of any prize money will flow to the playing squad, with the balance reinvested in federation operations and youth development.",
      "Looking past 2027, the AFCON 2029 rights cycle is already in early scoping. CAF's commercial team is briefing rights advisors that a $400M+ package is achievable if the African football product continues to grow at current rates — a benchmark that would require continued deepening of Sub-Saharan Africa pay-TV penetration and stronger streaming uptake in the diaspora markets.",
    ],
  },
  {
    slug: 'supersport-bein-afcon-auction',
    section: 'broadcast',
    category: 'Football',
    title: 'SuperSport vs beIN: the AFCON auction strategy, decoded',
    summary: 'Two bidders, one territory, and a three-year negotiation. Inside the commercial playbook.',
    source: 'TrueRate Sports',
    time: 'Jun 20, 2026',
    body: [
      "The Sub-Saharan Africa AFCON 2027 rights — sold for $145M jointly to SuperSport and beIN Sports — were the product of a three-year negotiation between CAF, IMG, and the two bidders. The co-production structure that emerged is the first of its kind in African football and reflects a strategic concession from both bidders rather than a competitive auction outcome.",
      "SuperSport, the long-time incumbent, opened bidding in early 2023 at $110M for exclusive Sub-Saharan Africa rights. beIN Sports — historically focused on MENA — entered the auction with a $135M bid that targeted the Sub-Saharan market for the first time. Both bids fell short of CAF's $150M floor.",
      "The breakthrough came in mid-2024 when IMG, brokering on behalf of CAF, proposed a co-production model: SuperSport would lead linear distribution while beIN would lead OTT distribution, with shared production rights and a joint commercial pool. The structure resolved the bidding deadlock by removing the zero-sum dimension — both bidders accepted that the Sub-Saharan market was strategically critical and that exclusive rights would be too expensive for either bidder alone.",
      "The commercial implications for African football are significant. The co-production model gives CAF a higher rights value than either standalone bid would have produced, while giving both rightsholders strategic optionality. SuperSport retains its incumbent linear distribution; beIN gains a foothold in Sub-Saharan streaming. The model is widely expected to be replicated in the AFCON 2029 cycle, possibly with a third bidder added to the structure.",
    ],
  },
  {
    slug: 'canal-plus-premier-league-loss',
    section: 'broadcast',
    category: 'Football',
    title: 'Why Canal+ lost the Premier League — and what it pays next',
    summary: 'Subscription churn, currency exposure, and the pivot to rugby and Ligue 1.',
    source: 'Sportcal',
    time: 'Jun 20, 2026',
    body: [
      "Canal+ — the French-owned pay-TV operator that holds rights to Premier League football in francophone West and Central Africa — confirmed in March that it will not bid for the next Premier League rights cycle. The decision ends a 14-year incumbency and represents the largest single rights-strategy reversal by Canal+ in its African operations.",
      'Three factors drove the decision. The first was subscription churn: Canal+ had reported 18% year-over-year churn in its francophone Africa business in 2025, with internal modelling attributing approximately 40% of the churn to Premier League price-elasticity issues — the property had become loss-leading at retail prices that customers would still pay. The second was currency: the West African franc\'s weakness against the euro had eroded the operating margin on the rights deal by an estimated 22% over three years.',
      'The third was strategic pivot. Canal+ is increasingly focusing its African rights strategy on Ligue 1 (where it controls global rights) and rugby (where the brand is positioned as the premier rights-holder). Premier League rights, while strategically important, were not differentiated property for Canal+ — both SuperSport and beIN were better-positioned to commercialise them in the region.',
      'The void left by Canal+ has, in part, driven the heat in the next Premier League auction cycle. Both SuperSport and beIN Sports are now bidding for francophone rights as well as the broader Sub-Saharan package, with the auction value approaching $180M as a result. The most-cited beneficiaries are Liberia, Ghana, and Nigeria, where rights coverage will likely be more deeply distributed than under the Canal+ era.',
    ],
  },
  {
    slug: 'nba-africa-streaming-push',
    section: 'broadcast',
    category: 'Basketball',
    title: "NBA Africa's streaming push: DStv renewal or direct-to-consumer?",
    summary: 'Ad-supported streaming numbers look strong, but retention remains the open question.',
    source: 'TrueRate Sports',
    time: 'Jun 19, 2026',
    body: [
      "NBA Africa's broadcast strategy is at a strategic inflection point. The league's current pay-TV deal with DStv — which generates approximately $11M/year in rights value across Sub-Saharan Africa — expires at the end of 2026. NBA Africa's commercial team is weighing whether to renew with DStv or pivot to a direct-to-consumer streaming model.",
      "The DStv renewal offer, briefed to TrueRate by industry sources, is approximately $13M/year for three years — a 15% uplift on the current deal. The structure is conventional pay-TV: DStv distributes the BAL across its premium tier in 14 African markets and provides production support for NBA Africa-branded long-form content.",
      "The direct-to-consumer alternative is more complex. NBA Africa's preliminary modelling — produced by McKinsey — suggests a standalone NBA Africa streaming product could acquire approximately 350,000 paying subscribers across Africa within 24 months at a $4–6/month price point. That would deliver gross revenue of approximately $14M–$21M annually, with net revenue (after platform and acquisition costs) of $10M–$15M.",
      "The risk in the direct-to-consumer pivot is retention. Africa's pay-TV churn rates are high; OTT churn rates are higher still. McKinsey's central case assumes 24% annual churn — manageable but compressing the value of customer acquisition spend. The decision, expected by Q3 2026, will signal where African basketball broadcast strategy is heading for the rest of the decade.",
    ],
  },
  {
    slug: 'lfa-1-8m-tv-deal',
    section: 'broadcast',
    category: 'Football',
    title: "The LFA's $1.8M TV deal: is it enough to cover referee wages?",
    summary: 'A breakdown of where every dollar of broadcast revenue goes in Liberian football.',
    source: 'TrueRate Sports',
    time: 'Jun 18, 2026',
    body: [
      "The Liberia Football Association's domestic broadcast deal, jointly held by ELBC and Orange Liberia at $1.8M/year, is the smallest top-flight football broadcast deal among the eight LFA-comparable West African leagues. The deal generates an average of $90K per top-flight club — well below operational requirements.",
      "Where the money actually goes is instructive. The first $400K covers production costs (camera operators, lighting, mobile production unit hire, satellite uplink). The next $300K funds match-day operating costs across the LFA League's 15-match-per-week schedule, including security, ticketing infrastructure, and stewarding.",
      "Approximately $480K covers referee wages and travel for the LFA's officiating pool — the third-largest cost line. Referee compensation in Liberia averages $180/match for top-flight officials, well below FIFA's recommended minimums but consistent with the country's broader sports-economic environment. Even at this level, referee costs represent over a quarter of the broadcast revenue.",
      "The remaining $620K is split between LFA central administrative costs ($340K), youth development programmes ($180K), and a small reserve ($100K). The structure leaves no room for strategic investment — for example, in officiating training, broadcast quality upgrades, or commercial-development initiatives. A material expansion of the broadcast deal in 2026 is, on these mechanics, the most consequential variable in Liberian football economics.",
    ],
  },
];

export function getSportsStory(slug: string): SportsStory | undefined {
  return SPORTS_STORIES.find(s => s.slug === slug);
}

export function sportsHero(section: SportsSection): SportsStory {
  const hero = SPORTS_STORIES.find(s => s.section === section && s.hero);
  if (!hero) throw new Error(`No hero defined for sports section "${section}"`);
  return hero;
}

export function sportsStoriesBySection(section: SportsSection, opts: { includeHero?: boolean } = {}): SportsStory[] {
  return SPORTS_STORIES.filter(s => s.section === section && (opts.includeHero || !s.hero));
}
