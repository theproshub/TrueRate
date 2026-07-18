// Explainer/Story hook packs, written in plain, simple language led by everyday
// Liberian archetypes (market woman, keke driver, susu member, family living on
// money from abroad …). The HOOK is the relatable scroll-stopper; the three
// POINTS carry the data-backed breakdown — the exact figures come from the
// published article catalog (13.11% lending, 1.94% deposit, 11.17-pt spread,
// 183.93 LD$/US$, 16.16% personal loan, 16.25% policy rate, US$314M imports,
// US$175M gold, US$304M revenue, LD$299B money supply, US$5.2B GDP, 12% fuel).
//
// Per CLAUDE.md, re-check freshness against live CBL data before publishing.
// Illustrative math (LD$500,000 loan, US$100 remittance and what they imply) uses
// real rates on explicit example amounts — the same technique the articles use.

export interface HookEntry {
  hook: string;
  /** Three reason-point titles that back the hook, seeded into ex1/2/3Title. */
  points: [string, string, string];
}

export interface HookGroup {
  category: string;
  hooks: HookEntry[];
}

export const HOOK_BANK: HookGroup[] = [
  {
    category: 'Curiosity',
    hooks: [
      { hook: 'Market woman, your bank charges you far more than it pays you.',
        points: ['It pays you 1.94% to save', 'It charges 13.11% to borrow', 'A gap of 11.17 points — the bank’s cut'] },
      { hook: 'There’s a cost in your loan you never counted.',
        points: ['A LD$500,000 loan at 13.11%', 'That’s LD$65,550 in interest a year', 'Before you repay any of it'] },
      { hook: 'In Red Light, few people know what the LD$ did this week.',
        points: ['Today it’s 183.93 to the US dollar', 'A week ago it was different', 'It changes what imported goods cost'] },
      { hook: 'Market woman, the real reason rice costs more isn’t your seller.',
        points: ['The country’s import bill hit US$314M', 'A weaker LD$ raises the landed price', 'The cost reaches your table last'] },
      { hook: 'One number explains why borrowing feels so hard right now.',
        points: ['The Central Bank’s rate is 16.25%', 'Banks lend at 13.11% and up', 'That’s the floor on any new loan'] },
      { hook: 'The rate everyone quotes on the street is wrong.',
        points: ['The street says 250', 'The Central Bank rate is 183.93', 'Trusting the wrong one costs you'] },
      { hook: 'Family abroad, here’s what your US$100 really buys back home now.',
        points: ['At 183.93, about LD$18,393', 'Last month it was different', 'Rising prices eat some of it too'] },
      { hook: 'Your 16.16% personal loan hides a second cost.',
        points: ['The rate you see is 16.16%', 'Then come the fees and charges', 'Together, that’s your real cost'] },
      { hook: 'Everyone watches the dollar. Few see what holds it up.',
        points: ['The rate sits at 183.93', 'Reserves stand behind it', 'That’s why it stays steady — for now'] },
      { hook: 'Susu member, more cash is around — but savings are dropping.',
        points: ['Money supply reached LD$299B', 'Cash outside banks is rising', 'Bank deposits are sliding'] },
    ],
  },
  {
    category: 'Controversy',
    hooks: [
      { hook: 'They say the dollar is 250. Market woman, it isn’t.',
        points: ['The claim on the street: 250', 'The Central Bank rate: 183.93', 'Check the date before you trust it'] },
      { hook: 'Your susu may be quietly beating the bank.',
        points: ['The bank pays about 1.94%', 'A susu can return more', 'But weigh the risk before you choose'] },
      { hook: '“Prices doubled this year.” The truth is stranger.',
        points: ['Inflation is far below double', 'Some items jumped more than others', 'That’s why it feels worse than it is'] },
      { hook: 'Everyone blames the shopkeeper for high rice. The data says otherwise.',
        points: ['It’s not the corner shop’s margin', 'The import bill hit US$314M', 'A weaker LD$ did the rest'] },
      { hook: 'Saver, leaving money in the bank can quietly cost you.',
        points: ['The bank pays about 1.94%', 'Prices can rise faster than that', 'So idle money can lose value'] },
      { hook: '“The government has no money.” The revenue line says otherwise.',
        points: ['March revenue reached US$304M', 'It comes from taxes and more', 'The real question is where it goes'] },
      { hook: 'Stop saying “about 13%.” That small bit is real money.',
        points: ['The exact rate is 13.11%', 'On LD$500,000, that’s LD$65,550', 'The rounding hides about LD$550'] },
      { hook: 'The lending rate isn’t the real problem. The spread is.',
        points: ['You borrow at 13.11%', 'You save at 1.94%', 'The 11.17-point gap is the squeeze'] },
      { hook: 'Most small businesses here don’t fail from bad ideas.',
        points: ['Credit costs 13.11% and up', 'Cash runs out before profit comes', 'The cost of money is the real killer'] },
      { hook: '“Rates always go up.” That’s a myth — here’s the real cycle.',
        points: ['The rate today is 16.25%', 'It has moved both ways before', 'Look at when it last changed'] },
    ],
  },
  {
    category: 'Storytelling',
    hooks: [
      { hook: 'A cookshop owner borrows LD$500,000. Here’s her real cost.',
        points: ['Her rate is 13.11%', 'That’s LD$65,550 in interest a year', 'Before she repays any of the loan'] },
      { hook: 'A keke driver fills his tank. Watch what a 12% jump does.',
        points: ['Fuel rose 12% in a month', 'His daily cost climbs', 'His profit shrinks by the same'] },
      { hook: 'She restocks her stall each week. This week the basket cost more.',
        points: ['Her goods cost more to buy', 'Rising prices are the reason', 'She cuts back to stay afloat'] },
      { hook: 'A builder bids for a job. Then cement prices move.',
        points: ['His bid price was fixed', 'Cement costs went up', 'The difference eats his profit'] },
      { hook: 'Every Friday, a mother abroad sends US$100. Here’s its worth now.',
        points: ['At 183.93, about LD$18,393', 'Last month it was different', 'The rate decides what family gets'] },
      { hook: 'A trader takes a 16.16% loan to grow. Do the math with her.',
        points: ['Her rate is 16.16%', 'Plus fees on top', 'Her sales must beat all of it'] },
      { hook: 'He saved with a susu instead of a bank. Here’s how it went.',
        points: ['The bank offered about 1.94%', 'His susu returned more', 'But he carried more risk'] },
      { hook: 'An importer prices his goods at 8am. By noon, the LD$ moves.',
        points: ['The rate shifted during the day', 'His costs changed with it', 'His margin took the hit'] },
      { hook: 'Two shops, the same loan, different banks. One number split them.',
        points: ['Same LD$500,000 borrowed', 'Different interest rates', 'One paid far more than the other'] },
      { hook: 'She used the “street rate” to send money. It cost her.',
        points: ['The street rate: 250', 'The real rate: 183.93', 'The gap came out of her pocket'] },
    ],
  },
  {
    category: 'Listicle',
    hooks: [
      { hook: '5 numbers that quietly shape every trader’s month.',
        points: ['The LD$ to US dollar rate', 'The cost to borrow', 'The rise in prices'] },
      { hook: '3 things your loan rate is really telling you.',
        points: ['What new credit will cost', 'How risky banks think you are', 'The profit you must beat'] },
      { hook: '4 ways the dollar’s price shows up in your daily costs.',
        points: ['Imported goods', 'Fuel', 'Rent and supplies'] },
      { hook: '5 money myths the market repeats — and what’s true.',
        points: ['“The rate is 250”', '“Prices doubled”', '“The government is broke”'] },
      { hook: '3 reasons savings are dropping while cash goes up.',
        points: ['Low bank interest', 'Rising prices', 'People trusting cash more'] },
      { hook: '6 numbers behind the US$5.2B economy — and who they touch.',
        points: ['Total output: US$5.2B', 'Trade', 'Services'] },
      { hook: 'Family abroad: 4 things to check before you send money home.',
        points: ['Today’s rate', 'Whether it’s high or low', 'What rising prices will eat'] },
      { hook: '5 parts of the economy moving now — and one nobody watches.',
        points: ['Gold', 'Rubber', 'Services'] },
      { hook: '3 costs hiding inside a 16.16% personal loan.',
        points: ['The 16.16% rate', 'The fees', 'The length of the loan'] },
      { hook: '7 Central Bank numbers that matter more than the headline rate.',
        points: ['Rising prices', 'The borrow-save gap', 'The reserves'] },
    ],
  },
  {
    category: 'Bold',
    hooks: [
      { hook: 'You pay 11 extra points just to borrow your own country’s money.',
        points: ['Borrow at 13.11%', 'Save at 1.94%', 'The 11.17-point gap is the cost'] },
      { hook: 'The most costly number in the market is a personal loan.',
        points: ['Personal loans: 16.16%', 'Business loans: 13.11%', 'Personal borrowing costs more'] },
      { hook: 'Gold is now two-thirds of everything the country sells abroad.',
        points: ['Gold: US$175M a month', 'About two-thirds of exports', 'A risky amount to lean on'] },
      { hook: 'Cash is up. Savings are down. That says one thing.',
        points: ['Cash outside banks is rising', 'Deposits are falling', 'People trust cash over the bank'] },
      { hook: 'Every rounded number you hear is someone bending the truth.',
        points: ['“About 13%” vs the real 13.11%', 'The small bit is real LD$', 'Exact numbers protect you'] },
      { hook: 'The gap between borrowing and saving is where money quietly moves.',
        points: ['Borrow at 13.11%', 'Save at 1.94%', 'Someone keeps the 11.17 points'] },
      { hook: 'If you don’t know the date, you don’t really know the number.',
        points: ['A rate with no date means little', 'Numbers change fast', 'Always ask “as of when?”'] },
      { hook: 'Fuel jumped 12% in a month. Your prices haven’t caught up — yet.',
        points: ['Fuel rose 12%', 'Transport costs follow', 'Shop prices come next'] },
      { hook: 'There’s a real, checked number for this. The rest is rumor.',
        points: ['The Central Bank’s figure', 'The street’s figure', 'Learn to tell them apart'] },
      { hook: 'The number that runs your business just changed.',
        points: ['The Central Bank rate: 16.25%', 'It flows down to your loan', 'Watch what happens next'] },
    ],
  },
];
