-- Replace 6 weak/empty World Bank indicators with 4 better-populated ones
-- after the first hydration showed Liberia has poor coverage on several
-- of the original codes. DELETE cascades to macro_values, removing any
-- sparse rows that were inserted (1982-only revenue/expense, etc).
--
-- Apply once via the Supabase SQL Editor, then re-run:
--   npm run hydrate:worldbank

-- ─── Remove indicators with no usable Liberia data ────────────────
delete from public.macro_series where series_id in (
  'WB.GC.DOD.TOTL.GD.ZS',   -- Govt debt (% GDP): WB has no Liberia data
  'WB.GC.REV.XGRT.GD.ZS',   -- Govt revenue (% GDP): 1 row (1982) only
  'WB.GC.XPN.TOTL.GD.ZS',   -- Govt expense (% GDP): 1 row (1982) only
  'WB.NE.EXP.GNFS.CD',      -- Exports (national accounts): no data
  'WB.NE.IMP.GNFS.CD',      -- Imports (national accounts): no data
  'WB.NE.RSB.GNFS.CD'       -- Trade balance (national accounts): no data
);

-- ─── Replacements with much better Liberia coverage ───────────────
insert into public.macro_series
  (series_id, label, unit, category, source, source_url, frequency, description) values

  ('WB.DT.DOD.DECT.CD',  'External Debt Stocks (Total)',  'USD',  'fiscal',
   'World Bank',
   'https://data.worldbank.org/indicator/DT.DOD.DECT.CD?locations=LR',
   'annual',
   'Long- and short-term external debt stocks, current USD'),

  ('WB.BX.GSR.GNFS.CD',  'Exports of Goods & Services (BoP)',  'USD',  'trade',
   'World Bank',
   'https://data.worldbank.org/indicator/BX.GSR.GNFS.CD?locations=LR',
   'annual',
   'Exports of goods and services from balance-of-payments accounts (current USD)'),

  ('WB.BM.GSR.GNFS.CD',  'Imports of Goods & Services (BoP)',  'USD',  'trade',
   'World Bank',
   'https://data.worldbank.org/indicator/BM.GSR.GNFS.CD?locations=LR',
   'annual',
   'Imports of goods and services from balance-of-payments accounts (current USD)'),

  ('WB.BN.CAB.XOKA.CD',  'Current Account Balance',  'USD',  'trade',
   'World Bank',
   'https://data.worldbank.org/indicator/BN.CAB.XOKA.CD?locations=LR',
   'annual',
   'Current account balance (current USD)')

on conflict (series_id) do nothing;
