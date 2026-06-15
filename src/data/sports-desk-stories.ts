import type { SportsStory } from '@/data/sports-stories';

/**
 * Readable, category-specific stories for the sports desk topic pages that have
 * no dedicated data vertical (youth, women's, governance, technology,
 * interviews, data & research, opinion). Each story is tagged with its `topic`
 * (desk slug) and carries a full body so a headline click opens a real article
 * at /sports/news/<slug> that actually speaks to that category.
 *
 * Illustrative sample content for the design preview (section-wide "Sample
 * data" banner applies). Kept in a separate array so it never leaks into the
 * /sports front (which reads SPORTS_STORIES by section).
 */
export const DESK_STORIES: SportsStory[] = [
  // ── Youth Sports ────────────────────────────────────────────────────────
  {
    slug: 'youth-academy-economy-who-pays', topic: 'youth-sports', section: 'main',
    category: 'Youth Sports', flag: 'Analysis', author: 'Sarah Kollie', dateline: 'MONROVIA', readTime: '7 min read',
    source: 'TrueRate Sports', time: '2 days ago',
    title: 'The Academy Economy: Who Actually Pays to Develop Liberia’s Talent',
    summary: 'Club academies, NGO programmes and private camps compete for the same young players. We trace where the money comes from — and where it goes.',
    body: [
      'Liberia produces footballers far faster than it produces the institutions to develop them. The country’s academy landscape is a patchwork of club youth setups, NGO-funded programmes and fee-charging private camps — each chasing the same pool of promising under-16s, and each funded in a completely different way.',
      'Club academies are the cheapest to run and the most exposed: they invest in a player for years, then watch a foreign scout or a Monrovia agent capture most of the value when he leaves. NGO programmes have the most reliable money but the least continuity, often ending when a grant cycle does. Private camps charge families directly, which limits access but creates the only self-sustaining model in the system.',
      'The result is a development pipeline that works in spite of its economics, not because of them. Until clubs can reliably bank sell-on value and federations enforce training-compensation rules, the people paying to develop Liberian talent will keep being the ones least able to profit from it.',
    ],
  },
  {
    slug: 'youth-school-championships-corporate-backing', topic: 'youth-sports', section: 'main',
    category: 'Youth Sports', author: 'James Dweh', source: 'TrueRate Sports', time: '3 days ago',
    title: 'School Championships Return With Corporate Backing for the First Time',
    summary: 'A national schools competition returns with a title sponsor — and a template other youth events are already studying.',
    body: [
      'After two dormant seasons, Liberia’s national schools championship is back — and for the first time it carries a corporate title sponsor rather than relying solely on ministry funding. The shift is small in absolute terms but significant in what it signals: youth competition is now seen as a marketable property, not just a development cost.',
      'Organisers say the sponsorship covers travel, officiating and a modest prize fund, the three line items that most often sink school sport in Liberia. Whether the model holds depends on renewal — youth events are easy to sponsor once and quietly drop. For now, it gives the country’s biggest talent-spotting stage a budget it has lacked for years.',
    ],
  },
  {
    slug: 'youth-academy-player-sales-business-model', topic: 'youth-sports', section: 'main',
    category: 'Youth Sports', author: 'Comfort Davies', source: 'TrueRate Sports', time: '5 days ago',
    title: 'How One Monrovia Academy Turned Player Sales Into a Business Model',
    summary: 'A single academy has built a sustainable operation around sell-on clauses and structured transfers — and others are copying it.',
    body: [
      'Most Liberian academies treat a player’s departure as a loss. One Monrovia setup has spent five years treating it as revenue — negotiating sell-on percentages, documenting development contributions, and routing moves through formal contracts rather than handshake deals with agents.',
      'The approach has turned a community academy into something closer to a business, funding coaching and facilities from transfer income rather than donations. It is replicable, but only where clubs keep records and federations back training-compensation claims — two things Liberian football still does inconsistently.',
    ],
  },
  {
    slug: 'youth-academy-safeguarding-standards', topic: 'youth-sports', section: 'main',
    category: 'Youth Sports', author: 'Patrice Williams', source: 'TrueRate Sports', time: '1 week ago',
    title: 'The Safeguarding Standards Liberian Academies Still Lack',
    summary: 'As academies professionalise commercially, child-protection standards have not kept pace. The gap is becoming a liability.',
    body: [
      'The same academies learning to monetise players have been slower to protect them. Liberia has no enforced, sport-wide safeguarding framework — no mandatory background checks, no standard reporting channels, and little oversight of the camps that handle minors far from home.',
      'Reform advocates argue the commercial case is now aligned with the moral one: clubs and sponsors that take child protection seriously will be the ones partners and foreign buyers trust. The standards exist regionally; Liberian sport has yet to adopt them as a condition of operating.',
    ],
  },

  // ── Women's Sports ──────────────────────────────────────────────────────
  {
    slug: 'womens-football-fastest-growing-underfunded', topic: 'womens-sports', section: 'main',
    category: "Women's Sports", flag: 'Analysis', author: 'Tina Mensah', dateline: 'MONROVIA', readTime: '6 min read',
    source: 'TrueRate Sports', time: '2 days ago',
    title: 'Women’s Football Is Liberia’s Fastest-Growing Audience — and Its Most Underfunded',
    summary: 'Attendance and broadcast interest are rising faster than the men’s game in places. The commercial money has not yet followed.',
    body: [
      'In several Liberian counties, women’s football is now drawing crowds and broadcast interest faster than the men’s game. The Liberia Women’s Premier League has expanded its fixtures, the national team’s results have lifted attention, and clubs report rising local sponsorship inquiries for the women’s side.',
      'What hasn’t arrived is the money. Facilities, travel budgets and player wages still lag far behind the commercial momentum, leaving clubs unable to capitalise on an audience they already have. The commercial logic is increasingly obvious; the budgets have not caught up to it.',
      'The clubs that move first — building a women’s commercial offer before their rivals do — stand to lock in sponsors at a discount to where the market is heading. That window is open now, and narrowing.',
    ],
  },
  {
    slug: 'lwpl-first-standalone-title-sponsor', topic: 'womens-sports', section: 'main',
    category: "Women's Sports", author: 'Sarah Kollie', source: 'TrueRate Sports', time: '4 days ago',
    title: 'LWPL Lands Its First Standalone Title Sponsor',
    summary: 'The women’s league secures a title partner of its own rather than a bundled afterthought to the men’s deal.',
    body: [
      'For the first time, the Liberia Women’s Premier League has a title sponsor negotiated on its own terms — not bundled as an add-on to a men’s-league agreement. It is a modest deal by regional standards, but a structural milestone: it prices women’s football as a property in its own right.',
      'The significance is in the precedent. Standalone valuation lets the league build its own commercial history, set its own renewal benchmarks, and stop being treated as a rounding error in someone else’s contract.',
    ],
  },
  {
    slug: 'womens-national-team-qualifying-domestic-league', topic: 'womens-sports', section: 'main',
    category: "Women's Sports", author: 'Comfort Davies', source: 'TrueRate Sports', time: '6 days ago',
    title: 'The National Team’s Qualifying Run Is Reshaping the Domestic League',
    summary: 'Success for the senior women’s side is pulling investment, attention and players back into the home league.',
    body: [
      'A strong qualifying campaign by the senior women’s national team is doing what years of advocacy could not: making the domestic women’s league commercially interesting. Clubs report more spectators, more media requests and the first inbound sponsorship calls they have fielded in seasons.',
      'The risk is the familiar one — a results-driven bump that fades if the institutions don’t use it. Federations that convert this attention into multi-year deals will keep it; those that treat it as a one-off will watch it evaporate after the tournament.',
    ],
  },
  {
    slug: 'womens-sport-equal-pay-conversations', topic: 'womens-sports', section: 'main',
    category: "Women's Sports", author: 'James Dweh', source: 'TrueRate Sports', time: '1 week ago',
    title: 'Equal-Pay Conversations Reach Liberian Sport — Slowly',
    summary: 'The global debate over pay parity is arriving in Liberia, where the gap is structural as much as it is about wages.',
    body: [
      'The equal-pay debate that has reshaped women’s sport globally is beginning to surface in Liberia, though the conversation here is less about matching salaries than about closing a structural gap — in facilities, travel, medical support and prize money.',
      'Administrators caution that parity in a market this small will be gradual and contested. But framing it as an investment question rather than a charity one is changing how some clubs and the federation talk about it.',
    ],
  },

  // ── Sports Governance ───────────────────────────────────────────────────
  {
    slug: 'lfa-2026-budget-vote-on-the-table', topic: 'governance', section: 'main',
    category: 'Governance', flag: 'Exclusive', author: 'Emmanuel Toe', dateline: 'MONROVIA', readTime: '8 min read',
    source: 'TrueRate Sports', time: '1 day ago',
    title: 'LFA’s 2026 Budget Vote: What’s Actually on the Table',
    summary: 'Ahead of the AGM, the draft operating budget proposes a centralised referee-payment scheme, a club-licensing deadline, and a contested reserve fund.',
    body: [
      'Ahead of the Liberia Football Association’s annual general meeting, the draft 2026 operating budget sets up the most consequential governance vote in years. Three items dominate: a centralised referee-payment scheme, a hard club-licensing deadline, and a reserve fund that several member clubs want restructured.',
      'The referee proposal would move official payments away from individual clubs to the federation, a change reformers say is essential to integrity and sceptics say concentrates too much control. The licensing deadline ties a club’s right to compete to its financial disclosures — a discipline mechanism, but one smaller clubs warn they cannot meet on the proposed timeline.',
      'The reserve fund is the quiet flashpoint. How it is governed determines who controls the federation’s rainy-day money, and the clubs know it. Whatever passes will shape Liberian football’s institutions long after this season.',
    ],
  },
  {
    slug: 'caf-club-licensing-liberian-clubs-deadline', topic: 'governance', section: 'main',
    category: 'Governance', author: 'Sarah Kollie', source: 'TrueRate Sports', time: '3 days ago',
    title: 'CAF Club Licensing: Which Liberian Clubs Risk Missing the Deadline',
    summary: 'Continental licensing rules demand financial and infrastructure standards several Liberian clubs are not yet meeting.',
    body: [
      'CAF’s club-licensing framework requires audited accounts, infrastructure minimums and governance standards that some Liberian clubs are still scrambling to satisfy. Missing the deadline does not just risk continental exclusion — it increasingly gates domestic eligibility too, as the LFA aligns its own rules with CAF’s.',
      'The clubs most at risk are the ones with the least administrative capacity, not necessarily the least money. Licensing is becoming a test of governance as much as finance, and it is exposing which Liberian clubs have built institutions and which have built teams.',
    ],
  },
  {
    slug: 'governance-integrity-unit-liberian-sport', topic: 'governance', section: 'main',
    category: 'Governance', author: 'James Dweh', source: 'TrueRate Sports', time: '5 days ago',
    title: 'The Integrity Unit Liberian Sport Keeps Promising to Build',
    summary: 'Match-fixing and refereeing concerns have prompted repeated pledges of an integrity body. None has yet materialised.',
    body: [
      'For years, Liberian sport has responded to integrity scandals with the same promise: a dedicated unit to monitor match-fixing, refereeing and betting-related risk. The pledges recur after each controversy; the unit does not.',
      'The obstacle is rarely will and almost always funding and independence — an integrity body that reports to the people it is meant to scrutinise is no body at all. Until one is resourced and ringfenced, Liberian sport’s integrity response will stay reactive.',
    ],
  },
  {
    slug: 'governance-federation-elections-sponsorship-money', topic: 'governance', section: 'main',
    category: 'Governance', author: 'Patrice Williams', source: 'TrueRate Sports', time: '1 week ago',
    title: 'How Federation Elections Shape Where Sponsorship Money Flows',
    summary: 'Who runs a federation decides which clubs, regions and disciplines see commercial investment. The politics is the economics.',
    body: [
      'Federation elections in Liberian sport are not just administrative — they are commercial. The officials who win control the relationships, priorities and discretion that determine where sponsorship and development money actually lands.',
      'That is why election cycles reliably precede shifts in which clubs and regions get backing. Understanding Liberian sport’s money map means understanding its ballots; the two are inseparable.',
    ],
  },

  // ── Sports Technology ───────────────────────────────────────────────────
  {
    slug: 'tech-streaming-carve-out-lpl-reach', topic: 'technology', section: 'main',
    category: 'Technology', flag: 'Analysis', author: 'Tina Mensah', dateline: 'MONROVIA', readTime: '6 min read',
    source: 'TrueRate Sports', time: '2 days ago',
    title: 'A Streaming Carve-Out Could Double the LPL’s Reach Overnight',
    summary: 'Awarding linear and digital rights separately would push the league’s potential audience past a million viewers — including the diaspora.',
    body: [
      'The Liberian Premier League’s broadcast strategy has long assumed a single buyer for all rights. A growing case says splitting them — linear to a traditional broadcaster, digital to a streaming partner — could roughly double the league’s addressable audience, mostly by unlocking the diaspora.',
      'The technology that once made this impractical is now routine: low-cost streaming infrastructure, mobile-money payments and social distribution put a global Liberian audience within reach. The constraint is no longer capability but commercial nerve — whether the league will fragment a comfortable single deal for a larger, riskier one.',
      'Done well, a carve-out grows both the audience and the rights fee. Done carelessly, it splinters a free-to-air habit built over decades. The league is, cautiously, starting to test which it is.',
    ],
  },
  {
    slug: 'tech-clubs-adopt-performance-tracking', topic: 'technology', section: 'main',
    category: 'Technology', author: 'James Dweh', source: 'TrueRate Sports', time: '4 days ago',
    title: 'Clubs Begin Adopting Basic Performance-Tracking for the First Time',
    summary: 'A handful of Liberian clubs are deploying low-cost tracking tools — and discovering how much they didn’t know.',
    body: [
      'Performance data has been a luxury Liberian clubs assumed they couldn’t afford. Cheap GPS vests, phone-based video tools and free analysis software are changing that calculus, and the first clubs to adopt them are finding edges in fitness management and recruitment they previously ran on instinct.',
      'The bigger prize is commercial: tracked, documented players are easier to scout and to sell. Data is becoming part of a player’s market value, and the clubs that capture it first will price their talent more accurately than rivals still working blind.',
    ],
  },
  {
    slug: 'tech-mobile-money-sport-ticketing', topic: 'technology', section: 'main',
    category: 'Technology', author: 'Comfort Davies', source: 'TrueRate Sports', time: '6 days ago',
    title: 'Mobile Money Is Quietly Becoming Liberian Sport’s Ticketing Layer',
    summary: 'Orange Money and MTN MoMo are turning matchday payments into data — and a new revenue and marketing channel.',
    body: [
      'Cash has always been Liberian sport’s ticketing system, which means clubs have never really known who their fans are. Mobile-money ticketing is changing that: every Orange Money or MTN MoMo purchase is a data point — a contactable supporter, a spending pattern, a marketing target.',
      'The immediate win is leakage control at the gate. The longer game is the customer database it builds, the first time most Liberian clubs will have owned their own audience rather than renting it from broadcasters and sponsors.',
    ],
  },
  {
    slug: 'tech-data-gap-scouting-liberian-athletes', topic: 'technology', section: 'main',
    category: 'Technology', author: 'Sarah Kollie', source: 'TrueRate Sports', time: '1 week ago',
    title: 'The Data Gap That Makes Liberian Athletes Hard to Scout',
    summary: 'Foreign buyers price what they can verify. Liberia’s thin data trail quietly discounts its players.',
    body: [
      'A Liberian player and an equally talented peer elsewhere are not worth the same to a foreign buyer — because one comes with verifiable data and the other does not. Sparse match footage, inconsistent statistics and undocumented histories force scouts to discount Liberian talent for risk they cannot price.',
      'Closing that gap is among the cheapest, highest-return investments Liberian sport could make. Better data does not change how good the players are; it changes how much the market is willing to pay for them.',
    ],
  },

  // ── Interviews ──────────────────────────────────────────────────────────
  {
    slug: 'interview-cassell-kuoh-barrolle-profitable', topic: 'interviews', section: 'main',
    category: 'Interviews', flag: 'Interview', author: 'Sarah Kollie', authorRole: 'Sports Business Editor', dateline: 'MONROVIA', readTime: '9 min read',
    source: 'TrueRate Sports', time: '2 days ago',
    title: 'The Chairman Who Made Mighty Barrolle Profitable — In His Own Words',
    summary: 'Cassell Kuoh on the wage cap, the shirt-deal renegotiation, and why he thinks the rest of the league is still mispricing its own players.',
    body: [
      'Cassell Kuoh did something almost no chairman in Liberian football had managed: he made his club profitable. In a wide-ranging conversation, the Mighty Barrolle chairman explains how a hard wage cap, a renegotiated shirt deal and outsourced matchday operations moved the club from an operating loss to a surplus in a single year.',
      '“The wage bill was the disease, not the symptom,” he says. Capping senior wages as a share of revenue was unpopular and, he admits, cost the club a few players — but it ended the cycle of spending money the club did not have on results it could not guarantee.',
      'His sharpest point is about the rest of the league. Liberian clubs, he argues, still misprice their own players — underselling talent and overspending on wages — because they treat football as a passion project rather than a business. “The diaspora pipeline is real,” he says. “But we are exporting value we could be capturing at home.”',
    ],
  },

  // ── Data & Research ─────────────────────────────────────────────────────
  {
    slug: 'data-liberian-sport-money-map', topic: 'data-research', section: 'main',
    category: 'Data & Research', flag: 'Data', author: 'James Dweh', dateline: 'MONROVIA', readTime: '10 min read',
    source: 'TrueRate Sports', time: '2 days ago',
    title: 'The Liberian Sport Money Map: Where the Money Actually Flows',
    summary: 'We pulled together sponsorship, broadcast, transfer and gate figures across the major competitions to map the real size — and shape — of the market.',
    body: [
      'How big is Liberian sport, really? To answer it, we assembled the available sponsorship, broadcast, transfer and gate figures across the country’s major competitions into a single picture — the first attempt to map the market rather than guess at it.',
      'The shape matters more than the headline total. Sponsorship dominates the inflows, broadcast is small but rising, transfers move value out of the country faster than clubs capture it, and gate revenue is a fraction of what venues could earn. It is a market funded from the top and leaking from the middle.',
      'The map is a baseline, not a verdict — built from disclosed and estimated figures that the section will refine as real reporting replaces sample data. But even a first draft makes the structural problem legible: Liberian sport’s money is concentrated, exported, and under-monetised at exactly the points clubs control.',
    ],
  },

  // ── Opinion & Analysis ──────────────────────────────────────────────────
  {
    slug: 'opinion-balance-sheet-not-talent-problem', topic: 'opinion', section: 'main',
    category: 'Opinion', flag: 'Opinion', author: 'TrueRate Editorial Board', readTime: '5 min read',
    source: 'TrueRate Sports', time: '1 day ago',
    title: 'Liberian Sport Doesn’t Have a Talent Problem. It Has a Balance-Sheet Problem.',
    summary: 'The players keep coming. The institutions to monetise and retain them do not.',
    body: [
      'Liberia has never struggled to produce athletes. It struggles to build the institutions that turn them into lasting value at home. The talent pipeline is full; the balance sheets behind it are empty. That, not ability, is the constraint on Liberian sport.',
      'Every season the diaspora absorbs the country’s best, because foreign clubs offer the financial structure Liberian ones cannot. Fixing that is unglamorous work — licensing, accounting, sell-on clauses, governance — but it is the only work that compounds. Until the institutions catch up to the talent, export will remain Liberian sport’s most successful business.',
    ],
  },
  {
    slug: 'opinion-stop-celebrating-transfer-fees', topic: 'opinion', section: 'main',
    category: 'Opinion', author: 'Sarah Kollie', source: 'TrueRate Sports', time: '3 days ago',
    title: 'Stop Celebrating Transfer Fees. Start Asking Where the Money Goes.',
    summary: 'A record fee is only good news if the selling club, and Liberian football, actually keep a meaningful share of it.',
    body: [
      'Every record Liberian transfer fee is greeted as a triumph. It rarely is one for the club that developed the player. Too often the headline number masks how little reaches the academy or the league — lost to agents, intermediaries and the absence of enforced sell-on and training-compensation rules.',
      'The fee is not the achievement. Keeping a meaningful share of it is. Until Liberian football measures success by what stays in the system rather than what leaves it, big transfers will keep being other people’s windfalls.',
    ],
  },
  {
    slug: 'opinion-centralised-broadcast-rights-body', topic: 'opinion', section: 'main',
    category: 'Analysis', author: 'James Dweh', source: 'TrueRate Sports', time: '5 days ago',
    title: 'The Case for One Centralised Liberian Sports Broadcast Rights Body',
    summary: 'Fragmented, deal-by-deal rights selling leaves money on the table. A central body could change the league’s bargaining position.',
    body: [
      'Liberian sport sells its broadcast rights the way a market stall sells fruit — one buyer, one deal, one season at a time. The result is predictable: weak bargaining power, inconsistent production and a fraction of the value a coordinated approach would command.',
      'A centralised rights body — pooling competitions, standardising production and negotiating as one — would not be simple to build in a sport this political. But the alternative is the status quo, in which every federation undersells its own product in isolation.',
    ],
  },
  {
    slug: 'opinion-womens-sport-best-investment', topic: 'opinion', section: 'main',
    category: 'Opinion', author: 'Comfort Davies', source: 'TrueRate Sports', time: '1 week ago',
    title: 'Women’s Sport Is the Best Investment Nobody in Liberia Is Making',
    summary: 'The audience is already there and the entry price is low. The sponsors who move first will look prescient in five years.',
    body: [
      'The most mispriced asset in Liberian sport is women’s competition. The audience is growing, the entry price is low, and the brands attaching to it now are buying at a discount to where the market is clearly heading.',
      'This is not charity; it is timing. The sponsors who back women’s sport in Liberia today will, in five years, look like they saw something everyone else missed. The ones who wait will pay more for less.',
    ],
  },

  // ── Interviews ──────────────────────────────────────────────────────────
  {
    slug: 'interview-lwpl-commissioner-title-sponsor', topic: 'interviews', section: 'main',
    category: 'Interviews', flag: 'Interview', author: 'Tina Mensah', source: 'TrueRate Sports', time: '4 days ago',
    title: 'The Commissioner Who Sold the LWPL’s First Title Sponsorship — On What It Took',
    summary: 'Two years of pitches, one rewritten media kit, and a pricing decision that divided the board. The LWPL’s commissioner walks through the deal.',
    body: [
      'When the Liberian Women’s Premier League finally signed its first standalone title sponsor, the announcement ran to three paragraphs. The negotiation behind it ran to two years. The league’s commissioner says the breakthrough came not from a bigger pitch deck but from a smaller ask: pricing the property honestly for what it could prove today, with escalators tied to the attendance growth she was confident would come.',
      'In this conversation, she describes the board argument over that pricing decision — several members wanted to hold out for a figure benchmarked against the men’s league — and why she believes underpricing year one was the most commercially aggressive move available. The escalators have since triggered twice.',
      'She also talks about what the deal changed operationally: standardised match-day production for the first time, a small central marketing budget, and the leverage to require clubs to publish fixtures four weeks out — the kind of unglamorous reform, she argues, that sponsors actually pay for.',
    ],
  },
  {
    slug: 'interview-liscr-fc-ceo-shirt-renewal', topic: 'interviews', section: 'main',
    category: 'Interviews', flag: 'Interview', author: 'James Dweh', source: 'TrueRate Sports', time: '6 days ago',
    title: 'LISCR FC’s Chief Executive on Renewing a Shirt Deal in a Rising Market',
    summary: 'With telco money chasing Liberian football, the club boss explains how he is repricing the front of his shirt — and what he refuses to bundle.',
    body: [
      'LISCR FC’s shirt deal expires next season, and its chief executive is negotiating in a very different market from the one he signed in. Telco competition for football inventory has lifted regional benchmarks, and he is candid that the club’s current deal is below where the market has moved.',
      'His negotiating position rests on two things: the club’s consistency in continental qualification, which delivers guaranteed broadcast exposure, and a refusal to bundle digital rights into the front-of-shirt price. Sponsors increasingly ask for the club’s social channels as part of the package; he prices them separately, on principle and on spreadsheet.',
      'He is equally direct about the risk: hold out too long for the repriced figure and the club could enter the season unsponsored, an outcome that would cost more in credibility than the difference between the offers on the table.',
    ],
  },
  {
    slug: 'interview-athletes-africa-agent-liberia', topic: 'interviews', section: 'main',
    category: 'Interviews', flag: 'Interview', author: 'Comfort Davies', source: 'TrueRate Sports', time: '1 week ago',
    title: 'The Agent Building Liberia’s Athlete Market: ‘The Talent Was Never the Problem’',
    summary: 'The Lagos-based agent behind several Liberian breakout deals on contract structure, FX clauses, and why representation is the missing institution.',
    body: [
      'Ask the agent who structured several of Liberia’s recent breakout athlete deals what changed, and the answer is blunt: nothing about the athletes. The sprint times, the contracts, the brand interest — the raw material was always there. What was missing was representation that could turn a result into a market.',
      'In this interview, he walks through the mechanics his agency now treats as standard for Liberian clients: USD-denominated deals with FX hedges, quarterly disbursement, performance escalators, and renewal windows timed to championship cycles. None of it is exotic; all of it was absent from Liberian athlete contracts five years ago.',
      'The institutional gap he describes cuts both ways. Brands lacked a counterparty they could negotiate with professionally; athletes lacked anyone to tell them what their result was worth. His bet is that filling that gap is a bigger business than any single client — and that the next wave of Liberian athletes will sign their first deals already knowing the playbook.',
    ],
  },

  // ── Data & Research ─────────────────────────────────────────────────────
  {
    slug: 'data-lpl-attendance-tracker-2026', topic: 'data-research', section: 'main',
    category: 'Data & Research', flag: 'Data', author: 'Patrice Williams', source: 'TrueRate Sports', time: '4 days ago',
    title: 'The LPL Attendance Tracker: What the Turnstiles Say About the League’s Recovery',
    summary: 'We compiled match-by-match attendance across the season. The headline: crowds are back — but the growth is concentrated in four clubs.',
    body: [
      'TrueRate’s LPL attendance tracker compiles match-by-match crowd figures across the league season, cross-checked against gate-receipt filings where clubs publish them. The headline finding is a genuine recovery in aggregate attendance — but one driven overwhelmingly by four clubs, while the league’s bottom half plays to crowds little changed from the lean years.',
      'The concentration matters commercially. Sponsors price league properties on average reach, but activate at the matches where the crowds actually are. The data suggests the league’s commercial story and its median club’s reality are increasingly different products — a gap that will shape both the next broadcast negotiation and the case for redistribution.',
      'The tracker updates after every round. Methodology, club-by-club tables and the underlying figures are maintained by the Data & Research desk, and corrections from clubs are incorporated with a note.',
    ],
  },
  {
    slug: 'data-liberian-transfer-fees-database', topic: 'data-research', section: 'main',
    category: 'Data & Research', flag: 'Data', author: 'James Dweh', source: 'TrueRate Sports', time: '6 days ago',
    title: 'Every Recorded Liberian Transfer Fee Since 2015, in One Database',
    summary: 'A decade of deals, standardised and sourced. What the dataset shows about where Liberian players go — and what the market actually pays.',
    body: [
      'The Liberian transfer-fee database standardises a decade of recorded deals: fee, currency, direction, age at transfer, and the share — where documented — that reached the developing club. It is the dataset behind much of this desk’s transfer reporting, and it is now published in full.',
      'Three patterns stand out. Outbound fees cluster at ages 19–21, earlier than comparable West African markets. The West African regional market, not Europe, is the volume buyer of Liberian players — Europe pays the headlines, the region pays the median. And documented training-compensation payments appear in only a small minority of deals, the dataset’s starkest finding.',
      'The database is maintained continuously and versioned; entries carry their sourcing, and disputed fees are flagged rather than averaged. Researchers and clubs can request the full export from the desk.',
    ],
  },
  {
    slug: 'data-sports-sponsorship-census-method', topic: 'data-research', section: 'main',
    category: 'Data & Research', flag: 'Analysis', author: 'Sarah Kollie', source: 'TrueRate Sports', time: '1 week ago',
    title: 'How We Count Sponsorship Money: Inside the TrueRate Sports Census Method',
    summary: 'Deal values in African sport are routinely inflated. Here is the verification standard behind every figure this desk publishes.',
    body: [
      'Sponsorship figures in African sport suffer from a systematic inflation problem: announced values bundle in-kind contributions, multi-year totals are quoted as annual, and neither party has an incentive to correct the record. The TrueRate sponsorship census exists to publish numbers that survive contact with the contracts.',
      'The method is simple to state and laborious to run. Every deal value is classified by evidence tier: contract-sighted, counterparty-confirmed, single-source reported, or announced-only. Census totals use only the top two tiers; announced-only figures are tracked but never aggregated. In-kind value is recorded separately from cash, and multi-year deals are annualised explicitly.',
      'The desk republishes the census quarterly. Where our figure differs from an announced one, both are shown — because the gap between them is itself one of the most informative numbers in Liberian sport.',
    ],
  },

  // ── Athletics (desk-specific additions to the category pool) ───────────
  {
    slug: 'athletics-diamond-league-appearance-economics', topic: 'athletics', section: 'main',
    category: 'Athletics', flag: 'Analysis', author: 'Comfort Davies', source: 'TrueRate Sports', time: '5 days ago',
    title: 'What a Diamond League Lane Is Actually Worth to a Liberian Sprinter',
    summary: 'Appearance fees, prize structure, and the sponsorship halo: the full economics of a single top-tier meet invitation.',
    body: [
      'A Diamond League lane is the most valuable single asset available to a Liberian sprinter, and almost none of its value is the prize money. The appearance fee for a ranked athlete, the travel and accommodation covered by the meet, and above all the sponsorship escalators triggered by top-tier exposure together dwarf the cheque for finishing on the podium.',
      'The economics explain why representation matters as much as form. Meet directors allocate lanes through agents, and an athlete without established representation can hold a qualifying time all season without receiving an invitation. The lane is bought with relationships as much as with results.',
      'For the federation, the lesson is structural: every Liberian athlete who reaches the circuit lowers the barrier for the next one, because meet directors price unknown markets by their last data point. The first lane is the expensive one.',
    ],
  },
  {
    slug: 'athletics-national-stadium-track-certification', topic: 'athletics', section: 'main',
    category: 'Athletics', author: 'Emmanuel Toe', source: 'TrueRate Sports', time: '1 week ago',
    title: 'The Track Certification Standing Between Monrovia and World-Ranking Meets',
    summary: 'Times run on an uncertified track don’t count. The resurfacing and audit that would change what Liberian athletes can prove at home.',
    body: [
      'A fast time on an uncertified track is, for ranking purposes, a rumour. The National Stadium’s surface has not held World Athletics certification for years, which means Liberian athletes cannot post qualifying or ranking marks at home — every provable performance requires a flight.',
      'The fix is known and costed: resurfacing to specification, calibrated timing infrastructure, and a certification audit. Set against what the federation and athletes spend annually on travel to certified tracks in the region, the investment case is unusually clean — it is one of the few capital projects in Liberian sport that directly converts into athlete earnings.',
      'Until it happens, the country’s sprint revival will keep a structural handicap: its athletes can be fast in Monrovia, but they can only be officially fast somewhere else.',
    ],
  },

  // ── One more each for the editorial desks ───────────────────────────────
  {
    slug: 'youth-county-meet-scouting-economy', topic: 'youth-sports', section: 'main',
    category: 'Youth Sports', author: 'James Dweh', source: 'TrueRate Sports', time: '2 weeks ago',
    title: 'The County Meet Has Quietly Become Liberia’s Biggest Scouting Market',
    summary: 'Agents, academy recruiters and club scouts now treat the national county meet as a talent exchange. Nobody regulates it.',
    body: [
      'The National County Sports Meet remains Liberia’s most-watched sporting event, but its most consequential business now happens off the pitch: it has become the country’s de facto talent exchange, where agents, academy recruiters and club scouts converge on two weeks of concentrated youth talent.',
      'The market is real and entirely unregulated. Approaches to minors happen without standard process; verbal commitments made in county-meet euphoria routinely conflict with existing academy arrangements. The meet’s organisers regulate the competition, not the recruitment around it — and no other body has claimed the job.',
      'A registration system for recruiters at the meet — a desk, a list, a code of conduct — would be a modest intervention with outsized effect. Until then, Liberia’s biggest youth sporting stage doubles as its most informal transfer market.',
    ],
  },
  {
    slug: 'womens-broadcast-slot-experiment', topic: 'womens-sports', section: 'main',
    category: "Women's Sports", author: 'Tina Mensah', source: 'TrueRate Sports', time: '2 weeks ago',
    title: 'The Saturday-Slot Experiment: What Happened When Women’s Football Got Primetime',
    summary: 'A half-season scheduling change put LWPL matches in the weekend broadcast window. The audience response surprised everyone but the players.',
    body: [
      'For half a season, the LWPL’s match of the week moved into the Saturday afternoon broadcast window previously reserved for men’s fixtures — less a strategy than a scheduling accident. The audience numbers that followed have reshaped the league’s broadcast argument.',
      'Viewership for the slot held, and on several matchdays grew, against the men’s fixtures it displaced. The finding undercuts the standing assumption that women’s football in Liberia has a ceiling audience, and replaces it with a simpler explanation for historic figures: nobody had been able to watch.',
      'The experiment ends with the current rights cycle, and whether it becomes policy is now a commercial negotiation. The league’s position is straightforward — the slot was tested, the audience showed up, and the next broadcast deal should price accordingly.',
    ],
  },
  {
    slug: 'governance-club-licensing-financial-disclosure', topic: 'governance', section: 'main',
    category: 'Governance', author: 'Emmanuel Toe', source: 'TrueRate Sports', time: '2 weeks ago',
    title: 'Club Licensing’s Quietest Clause: The Financial Disclosure Nobody Has Complied With',
    summary: 'The licensing framework requires audited club accounts. As the deadline approaches, the compliance rate is effectively zero.',
    body: [
      'Buried in the club-licensing framework is its most consequential requirement: audited annual accounts, filed with the federation, as a condition of top-flight participation. It is the clause that would transform Liberian club football from an informal economy into an auditable one — and as the deadline approaches, effective compliance stands at zero.',
      'The reasons are structural rather than evasive. Most clubs have never produced audited accounts; several operate without the bookkeeping an audit requires. The federation faces a choice it has so far deferred: enforce the clause and decimate the license list, or waive it and confirm that licensing is aspiration rather than regulation.',
      'A phased route exists — management accounts first, audits later, with public deadlines. What the framework cannot survive is silence, because every season the clause goes unenforced reprices every other requirement in it.',
    ],
  },
  {
    slug: 'technology-var-lite-officiating-pilot', topic: 'technology', section: 'main',
    category: 'Technology', author: 'Sarah Kollie', source: 'TrueRate Sports', time: '2 weeks ago',
    title: 'VAR Is Out of Reach. The League Is Piloting Something Cheaper.',
    summary: 'Full video review costs more than the league’s broadcast deal. A two-camera review protocol is being tested instead.',
    body: [
      'Full VAR costs more per season than the LPL’s entire broadcast deal generates, which is why the league has never seriously considered it. What it is now piloting is deliberately humbler: a two-camera review protocol for the broadcast match of the week, giving the fourth official replay access for red cards and disputed goals.',
      'The pilot reuses infrastructure that already exists — the broadcast cameras — and adds a monitor, a communication channel and a protocol. Its constraint is honest: only televised matches get the safety net, which the referees’ body has flagged as a consistency problem in its own right.',
      'The experiment’s real significance is precedent. Liberian sport rarely pilots officiating technology at all; a cheap, working review system at one match a week is a more credible path to better refereeing than waiting for a VAR budget that is never coming.',
    ],
  },
  {
    slug: 'opinion-county-meet-commercial-underuse', topic: 'opinion', section: 'main',
    category: 'Opinion', author: 'Patrice Williams', source: 'TrueRate Sports', time: '2 weeks ago',
    title: 'The County Meet Is Liberia’s Biggest Sports Property. We Treat It Like a Festival.',
    summary: 'The country’s most-watched competition has no rights strategy, no sponsorship architecture and no data. That is a choice.',
    body: [
      'Every year the National County Sports Meet delivers the largest audiences in Liberian sport, and every year it is administered as a celebration rather than managed as a property. No coherent rights strategy, no tiered sponsorship architecture, no audience measurement worth the name. The most valuable asset in the country’s sporting economy is the one nobody is responsible for monetising.',
      'The objection writes itself: the meet is heritage, not inventory. But these are not in tension. Properly priced sponsorship and broadcast structures are what would fund better facilities, county-level sport development and the meet’s own production values. Leaving the money on the table does not protect the tradition; it starves it.',
      'The meet needs what every serious property has — an owner with a mandate. Until someone is accountable for its commercial performance, Liberia will keep staging its biggest sporting event at a loss and calling the loss culture.',
    ],
  },
];

/** Desk stories for a given topic slug. */
export function deskStoriesForTopic(topic: string): SportsStory[] {
  return DESK_STORIES.filter((s) => s.topic === topic);
}
