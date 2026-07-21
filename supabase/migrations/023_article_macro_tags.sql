-- ─────────────────────────────────────────────────────────────────
-- 023_article_macro_tags.sql
--
-- Adds a first-class `macro_tags text[]` column to articles holding CBL
-- warehouse mnemonics (LBR_*), so the truerate-mcp `article_data_context`
-- tool can resolve an article to real cbl_series data directly.
--
-- Background: the pre-existing article_macros -> macro_series tagging uses a
-- separate curated namespace (CBL.POLICY_RATE, WB.NY.GDP.MKTP.CD, …) that does
-- NOT match cbl_series.mnemonic (LBR_INR_MPR_1, …). See issue #5. macroTags
-- (the LBR_* arrays) previously lived only in src/data/news.ts.
--
-- Backfill strategy:
--   Step 2  authoritative: exact hand-picked arrays from news.ts (18 articles).
--   Step 3  gap-fill: derive tags from existing article_macros via a
--           conservative CBL.*/WB.* -> LBR_* map, ONLY for articles Step 2 left
--           empty. Keys with no faithful warehouse equivalent are intentionally
--           unmapped (see note at the bottom) and contribute no tag.
--
-- Safe to re-run (idempotent): add-column is guarded; Step 2 is deterministic;
-- Step 3 only writes rows still empty.
-- ─────────────────────────────────────────────────────────────────

-- 1. Column ---------------------------------------------------------
alter table public.articles
  add column if not exists macro_tags text[] not null default '{}';

-- 2. Authoritative backfill from news.ts (18 articles) --------------
update public.articles set macro_tags = '{LBR_EXR_EPR_1,LBR_INT_TME_1,LBR_TME_1_3,LBR_MON_2}' where slug = 'exchange-rate-8-percent-shift-business-impact';
update public.articles set macro_tags = '{LBR_TME_1_3,LBR_TME_1_1,LBR_INT_TME_1,LBR_TME_1_2}' where slug = 'gold-export-concentration-risk-march-2026';
update public.articles set macro_tags = '{LBR_MON_DC_4,LBR_MON_DC_4_1,LBR_MON_DC_4_2,LBR_MON_6}' where slug = 'money-supply-299-billion-composition-shift-march-2026';
update public.articles set macro_tags = '{LBR_INR_LRL_2,LBR_INR_SRL_6,LBR_INR_LRU_8,LBR_INR_SRU_12,LBR_INR_DRU_11}' where slug = 'banking-spread-13-percent-lending-2-percent-savings-feb-2026';
update public.articles set macro_tags = '{LBR_CPI_1_5,LBR_CPI_0_7,LBR_CPI_0,LBR_EXR_EPR_1}' where slug = 'fuel-cost-jump-small-business-impact-march-2026';
update public.articles set macro_tags = '{LBR_PRO_1,LBR_TME_1_2,LBR_INT_TME_1,LBR_TME_1_3}' where slug = 'rubber-production-drop-smallholder-impact-march-2026';
update public.articles set macro_tags = '{LBR_INT_TMI_FOB_1,LBR_INT_TME_1,LBR_EXR_EPR_1}' where slug = 'record-imports-small-retailer-impact-march-2026';
update public.articles set macro_tags = '{LBR_INR_LRL_2,LBR_INR_LRU_8,LBR_INR_MPR_1,LBR_INR_SRL_6,LBR_MON_ODC_5_4}' where slug = 'cost-of-credit-liberian-business-borrowing';
update public.articles set macro_tags = '{LBR_NAT_0,LBR_NAT_00,LBR_NAT_01,LBR_NAT_03,LBR_NAT_04,LBR_NAT_05}' where slug = 'liberia-5-billion-economy-sectoral-breakdown';
update public.articles set macro_tags = '{LBR_FIS_BUD_1,LBR_FIS_BUD_1_1,LBR_FIS_BUD_2,LBR_FIS_DEBT_1}' where slug = 'government-revenue-surges-march-2026';
update public.articles set macro_tags = '{LBR_NAT_05_4,LBR_NAT_05,LBR_NAT_05_2,LBR_NAT_05_6,LBR_NAT_0}' where slug = 'trade-hospitality-sector-services-boom';
update public.articles set macro_tags = '{LBR_FIS_BUD_1_1,LBR_FIS_BUD_1,LBR_FIS_BUD_1_2,LBR_CPI_0,LBR_NAT_0}' where slug = 'liberia-gst-to-vat-transition';
update public.articles set macro_tags = '{LBR_INR_PRL_3,LBR_INR_PRU_9,LBR_INR_LRL_2,LBR_INR_MRL_4,LBR_INR_SRL_6,LBR_INR_MPR_1}' where slug = 'personal-loans-hidden-tax-informal-entrepreneurs';
update public.articles set macro_tags = '{LBR_INT_EXP_5_1,LBR_INT_EXP_5,LBR_INT_EXP_1,LBR_INT_EXP_7}' where slug = 'china-buys-134-million-liberian-exports-2025';
update public.articles set macro_tags = '{LBR_MON_ODC_7,LBR_MON_ODC_8,LBR_MON_ODC_5_4,LBR_MON_DC_4,LBR_INR_LRL_2,LBR_INR_SRL_6}' where slug = 'banks-hold-260-billion-deposits-where-goes-money';
update public.articles set macro_tags = '{LBR_INR_PRL_3,LBR_INR_LRL_2,LBR_MON_ODC_5_4,LBR_NAT_00,LBR_NAT_05,LBR_EXR_EPR_1}' where slug = 'liberian-startups-barriers-first-year';
update public.articles set macro_tags = '{LBR_NAT_01_1,LBR_PRO_1,LBR_TME_1_2,LBR_NAT_01}' where slug = 'rubber-output-106-million-uneven-recovery';
update public.articles set macro_tags = '{LBR_INR_MPR_1,LBR_CPI_0,LBR_INR_LRL_2,LBR_INR_PRL_3,LBR_MON_6,LBR_MON_DC_4}' where slug = 'cbl-holds-policy-rate-16-25-what-businesses-know';

-- 3. Gap-fill from article_macros via a conservative CBL.*/WB.* -> LBR_* map.
--    Only rows Step 2 left empty are written. Only warehouse-faithful keys are
--    mapped; everything else contributes no tag (documented below).
with mapping(macro_key, mnemonic) as (
  values
    ('CBL.POLICY_RATE',    'LBR_INR_MPR_1'),   -- Monetary Policy Rate
    ('CBL.LENDING_RATE',   'LBR_INR_LRL_2'),   -- Lending rate, LRD
    ('CBL.DEPOSIT_RATE',   'LBR_INR_SRL_6'),   -- Saving rate, LRD
    ('CBL.M1',             'LBR_MON_DC_4_1'),  -- Narrow money
    ('CBL.M2',             'LBR_MON_DC_4'),    -- Broad money
    ('CBL.MB',             'LBR_MON_6'),       -- Monetary Base (Reserve Money)
    ('CBL.CURRENCY_CIRC',  'LBR_MON_6_1'),     -- Currency in Circulation
    ('CBL.CPI_HEADLINE',   'LBR_CPI_0'),       -- Harmonized CPI
    ('CBL.CPI_FOOD',       'LBR_CPI_0_1'),     -- CPI: Food and non-alcoholic beverages
    ('CBL.CPI_NONFOOD',    'LBR_CPI_1_6'),     -- CPI: General Index less Food & Non-Alcoholic Bev.
    ('WB.NY.GDP.MKTP.CD',  'LBR_NAT_0')        -- GDP, market prices (current USD)
),
derived as (
  select am.article_id, array_agg(distinct m.mnemonic order by m.mnemonic) as tags
  from public.article_macros am
  join public.macro_series ms on ms.id = am.series_id
  join mapping m on m.macro_key = ms.series_id
  group by am.article_id
)
update public.articles a
set macro_tags = d.tags
from derived d
where a.id = d.article_id
  and (a.macro_tags is null or a.macro_tags = '{}');

-- ─────────────────────────────────────────────────────────────────
-- Intentionally UNMAPPED macro_series keys (no faithful cbl_series
-- equivalent in the warehouse; leaving them out is correct, not an omission):
--   CBL.TBILL_91 / CBL.TBILL_182 / CBL.TBILL_364  — T-bill yields not in warehouse
--   CBL.INTERBANK_RATE                            — not in warehouse
--   CBL.RESERVE_REQ                               — not in warehouse
--   CBL.FX_RESERVES                               — gross reserves not a distinct series
--   CBL.CPI_CORE / CBL.CPI_MOM                    — no clean single-series equivalent
--   WB.* (GDP per capita, growth %, sector shares, trade, FDI) — World Bank
--     annual, different source/measure than the CBL/LISGIS NAT & INT series
--
-- Articles tagged only with unmapped keys, or not tagged at all, keep the empty
-- default '{}' — article_data_context will report "no macro series tagged"
-- until they are tagged directly with LBR_* mnemonics.
-- ─────────────────────────────────────────────────────────────────
