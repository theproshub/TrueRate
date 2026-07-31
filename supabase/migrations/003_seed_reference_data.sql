-- Seed reference data for TrueRate v1.
-- Idempotent: re-running is safe (on conflict do nothing).
--
-- Hydration of macro_values + quotes_daily happens via scrapers, not here.
-- This file only defines WHAT we'll track, not the values themselves.

-- ─────────────────────────────────────────────────────────────────
-- Currencies (ISO 4217)
-- ─────────────────────────────────────────────────────────────────
insert into public.currencies (code, name, symbol) values
  ('LRD', 'Liberian Dollar',          'L$'),
  ('USD', 'US Dollar',                '$'),
  ('EUR', 'Euro',                     '€'),
  ('GBP', 'British Pound',            '£'),
  ('CNY', 'Chinese Yuan',             '¥'),
  ('XOF', 'West African CFA Franc',   'CFA'),
  ('GHS', 'Ghanaian Cedi',            '₵'),
  ('NGN', 'Nigerian Naira',           '₦'),
  ('ZAR', 'South African Rand',       'R'),
  ('JPY', 'Japanese Yen',             '¥')
on conflict (code) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- Regional exchanges (MIC codes per ISO 10383)
-- ─────────────────────────────────────────────────────────────────
insert into public.exchanges (mic, name, country, currency, timezone) values
  ('XBRV', 'Bourse Régionale des Valeurs Mobilières', 'CIV', 'XOF', 'Africa/Abidjan'),
  ('XGHA', 'Ghana Stock Exchange',                    'GHA', 'GHS', 'Africa/Accra'),
  ('XNGS', 'Nigerian Exchange Group',                 'NGA', 'NGN', 'Africa/Lagos'),
  ('XJSE', 'Johannesburg Stock Exchange',             'ZAF', 'ZAR', 'Africa/Johannesburg')
on conflict (mic) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- Sectors (flat for now; parent_id stays null)
-- ─────────────────────────────────────────────────────────────────
insert into public.sectors (slug, label) values
  ('banking',        'Banking & Financial Services'),
  ('telecom',        'Telecommunications'),
  ('mining',         'Mining & Metals'),
  ('agriculture',    'Agriculture & Forestry'),
  ('energy',         'Energy'),
  ('consumer-goods', 'Consumer Goods'),
  ('real-estate',    'Real Estate'),
  ('industrial',     'Industrial'),
  ('healthcare',     'Healthcare'),
  ('technology',     'Technology'),
  ('transportation', 'Transportation'),
  ('hospitality',    'Hospitality & Tourism')
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- Macro series we'll track.
--
-- Naming convention:
--   CBL.*   manual entry (CBL publishes PDF/Excel bulletins)
--   WB.*    auto from World Bank API (the suffix is the WB indicator code)
--   IMF.*   manual or IMF SDMX API
--
-- Frequencies: 'daily', 'weekly', 'monthly', 'quarterly', 'annual'
-- ─────────────────────────────────────────────────────────────────
insert into public.macro_series (series_id, label, unit, category, source, source_url, frequency, description) values

  -- Central Bank of Liberia: rates
  ('CBL.POLICY_RATE',     'CBL Monetary Policy Rate',         '%',           'rates',     'Central Bank of Liberia', 'https://www.cbl.org.lr', 'monthly',   'Headline policy rate set by the CBL Monetary Policy Committee'),
  ('CBL.TBILL_91',        '91-day Treasury Bill Yield',       '%',           'rates',     'Central Bank of Liberia', 'https://www.cbl.org.lr', 'weekly',    'Discount yield on the 91-day T-bill auction'),
  ('CBL.TBILL_182',       '182-day Treasury Bill Yield',      '%',           'rates',     'Central Bank of Liberia', 'https://www.cbl.org.lr', 'weekly',    'Discount yield on the 182-day T-bill auction'),
  ('CBL.TBILL_364',       '364-day Treasury Bill Yield',      '%',           'rates',     'Central Bank of Liberia', 'https://www.cbl.org.lr', 'weekly',    'Discount yield on the 364-day T-bill auction'),
  ('CBL.INTERBANK_RATE',  'Interbank Rate',                   '%',           'rates',     'Central Bank of Liberia', 'https://www.cbl.org.lr', 'weekly',    'Weighted-average interbank lending rate'),
  ('CBL.LENDING_RATE',    'Commercial Bank Lending Rate',     '%',           'rates',     'Central Bank of Liberia', 'https://www.cbl.org.lr', 'monthly',   'Weighted-average lending rate across commercial banks'),
  ('CBL.DEPOSIT_RATE',    'Commercial Bank Deposit Rate',     '%',           'rates',     'Central Bank of Liberia', 'https://www.cbl.org.lr', 'monthly',   'Weighted-average deposit rate across commercial banks'),
  ('CBL.RESERVE_REQ',     'Cash Reserve Requirement',         '%',           'rates',     'Central Bank of Liberia', 'https://www.cbl.org.lr', 'monthly',   'Reserve requirement ratio for commercial banks'),

  -- CBL: monetary aggregates
  ('CBL.M1',              'Money Supply (M1)',                'LRD millions', 'fiscal',   'Central Bank of Liberia', 'https://www.cbl.org.lr', 'monthly',   'Narrow money: currency in circulation + demand deposits'),
  ('CBL.M2',              'Money Supply (M2)',                'LRD millions', 'fiscal',   'Central Bank of Liberia', 'https://www.cbl.org.lr', 'monthly',   'Broad money: M1 + savings + time deposits'),
  ('CBL.MB',              'Monetary Base',                    'LRD millions', 'fiscal',   'Central Bank of Liberia', 'https://www.cbl.org.lr', 'monthly',   'Reserve money: currency + bank reserves at CBL'),
  ('CBL.CURRENCY_CIRC',   'Currency in Circulation',          'LRD millions', 'fiscal',   'Central Bank of Liberia', 'https://www.cbl.org.lr', 'monthly',   'Total LRD currency held outside the banking system'),
  ('CBL.FX_RESERVES',     'Gross Foreign Exchange Reserves',  'USD millions', 'fiscal',   'Central Bank of Liberia', 'https://www.cbl.org.lr', 'monthly',   'Gross international reserves held by the CBL'),

  -- CBL: inflation (locally measured, may diverge from WB)
  ('CBL.CPI_HEADLINE',    'CPI — Headline (YoY)',             '%',           'inflation', 'Liberia Institute of Statistics & Geo-Information Services', 'https://www.lisgis.gov.lr', 'monthly', 'Headline consumer price index, year-over-year change'),
  ('CBL.CPI_FOOD',        'CPI — Food (YoY)',                 '%',           'inflation', 'Liberia Institute of Statistics & Geo-Information Services', 'https://www.lisgis.gov.lr', 'monthly', 'Food component of CPI, year-over-year change'),
  ('CBL.CPI_NONFOOD',     'CPI — Non-food (YoY)',             '%',           'inflation', 'Liberia Institute of Statistics & Geo-Information Services', 'https://www.lisgis.gov.lr', 'monthly', 'Non-food component of CPI, year-over-year change'),
  ('CBL.CPI_CORE',        'CPI — Core (YoY)',                 '%',           'inflation', 'Liberia Institute of Statistics & Geo-Information Services', 'https://www.lisgis.gov.lr', 'monthly', 'Core CPI (excluding food and energy), year-over-year change'),
  ('CBL.CPI_MOM',         'CPI — Headline (MoM)',             '%',           'inflation', 'Liberia Institute of Statistics & Geo-Information Services', 'https://www.lisgis.gov.lr', 'monthly', 'Headline CPI, month-over-month change'),

  -- World Bank: growth
  ('WB.NY.GDP.MKTP.CD',     'GDP (current USD)',              'USD',         'growth',    'World Bank',              'https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=LR',     'annual',  'Gross Domestic Product at current US dollar prices'),
  ('WB.NY.GDP.PCAP.CD',     'GDP per capita (current USD)',   'USD',         'growth',    'World Bank',              'https://data.worldbank.org/indicator/NY.GDP.PCAP.CD?locations=LR',     'annual',  'GDP divided by mid-year population, current USD'),
  ('WB.NY.GDP.MKTP.KD.ZG',  'GDP Growth (annual)',            '%',           'growth',    'World Bank',              'https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG?locations=LR',  'annual',  'Annual percentage growth rate of GDP at constant local prices'),
  ('WB.NV.AGR.TOTL.ZS',     'Agriculture, share of GDP',      '%',           'growth',    'World Bank',              'https://data.worldbank.org/indicator/NV.AGR.TOTL.ZS?locations=LR',     'annual',  'Agriculture, forestry, and fishing value added (% of GDP)'),
  ('WB.NV.IND.TOTL.ZS',     'Industry, share of GDP',         '%',           'growth',    'World Bank',              'https://data.worldbank.org/indicator/NV.IND.TOTL.ZS?locations=LR',     'annual',  'Industry (including construction) value added (% of GDP)'),
  ('WB.NV.SRV.TOTL.ZS',     'Services, share of GDP',         '%',           'growth',    'World Bank',              'https://data.worldbank.org/indicator/NV.SRV.TOTL.ZS?locations=LR',     'annual',  'Services value added (% of GDP)'),

  -- World Bank: trade & external balance
  ('WB.NE.EXP.GNFS.CD',     'Exports of Goods & Services',    'USD',         'trade',     'World Bank',              'https://data.worldbank.org/indicator/NE.EXP.GNFS.CD?locations=LR',     'annual',  'Exports of goods and services (current USD)'),
  ('WB.NE.IMP.GNFS.CD',     'Imports of Goods & Services',    'USD',         'trade',     'World Bank',              'https://data.worldbank.org/indicator/NE.IMP.GNFS.CD?locations=LR',     'annual',  'Imports of goods and services (current USD)'),
  ('WB.NE.RSB.GNFS.CD',     'Trade Balance',                  'USD',         'trade',     'World Bank',              'https://data.worldbank.org/indicator/NE.RSB.GNFS.CD?locations=LR',     'annual',  'External balance on goods and services (current USD)'),
  ('WB.BX.KLT.DINV.CD.WD',  'Foreign Direct Investment (net)','USD',         'trade',     'World Bank',              'https://data.worldbank.org/indicator/BX.KLT.DINV.CD.WD?locations=LR',  'annual',  'FDI net inflows (BoP, current USD)'),

  -- World Bank: fiscal
  ('WB.GC.DOD.TOTL.GD.ZS',  'Government Debt (% of GDP)',     '%',           'fiscal',    'World Bank',              'https://data.worldbank.org/indicator/GC.DOD.TOTL.GD.ZS?locations=LR',  'annual',  'Central government debt, total (% of GDP)'),
  ('WB.GC.REV.XGRT.GD.ZS',  'Government Revenue (% of GDP)',  '%',           'fiscal',    'World Bank',              'https://data.worldbank.org/indicator/GC.REV.XGRT.GD.ZS?locations=LR',  'annual',  'Revenue, excluding grants (% of GDP)'),
  ('WB.GC.XPN.TOTL.GD.ZS',  'Government Expense (% of GDP)',  '%',           'fiscal',    'World Bank',              'https://data.worldbank.org/indicator/GC.XPN.TOTL.GD.ZS?locations=LR',  'annual',  'Total expense as a share of GDP'),

  -- World Bank: inflation cross-check
  ('WB.FP.CPI.TOTL.ZG',     'Inflation, CPI (annual)',        '%',           'inflation', 'World Bank',              'https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG?locations=LR',     'annual',  'Inflation, consumer prices (annual %)'),

  -- World Bank: employment & population
  ('WB.SL.UEM.TOTL.ZS',     'Unemployment Rate',              '%',           'employment','World Bank',              'https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS?locations=LR',     'annual',  'Unemployment, total (% of total labor force, modeled ILO estimate)'),
  ('WB.SL.TLF.CACT.ZS',     'Labor Force Participation',      '%',           'employment','World Bank',              'https://data.worldbank.org/indicator/SL.TLF.CACT.ZS?locations=LR',     'annual',  'Labor force participation rate, total (% ages 15+)'),
  ('WB.SP.POP.TOTL',        'Population, Total',              'people',      'population','World Bank',              'https://data.worldbank.org/indicator/SP.POP.TOTL?locations=LR',        'annual',  'Total mid-year population'),
  ('WB.SP.URB.TOTL.IN.ZS',  'Urban Population Share',         '%',           'population','World Bank',              'https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS?locations=LR',  'annual',  'Urban population as % of total')

on conflict (series_id) do nothing;
