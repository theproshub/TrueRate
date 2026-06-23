'use client';

import { useState } from 'react';

interface MacroRow {
  id: string;
  series_id: string;
  label: string;
  category: string;
}

interface MacroTagFormProps {
  macros: MacroRow[];
  macrosByCategory: [string, MacroRow[]][];
  initialChecked: string[];
  articleText: string;
  action: (form: FormData) => void;
}

const KEYWORD_MAP: Record<string, string[]> = {
  'CBL.CPI_HEADLINE':  ['inflation', 'consumer price', 'price index'],
  'CBL.CPI_CORE':      ['core inflation', 'core cpi'],
  'CBL.CPI_FOOD':      ['food price', 'food inflation', 'food cost'],
  'CBL.CPI_NONFOOD':   ['non-food price', 'nonfood'],
  'CBL.CPI_MOM':       ['month-on-month inflation', 'monthly inflation'],
  'WB.FP.CPI.TOTL.ZG': ['inflation rate', 'annual inflation'],
  'WB.NY.GDP.MKTP.CD':    ['gdp', 'gross domestic product', 'economy grew', 'economic output'],
  'WB.NY.GDP.MKTP.KD.ZG': ['gdp growth', 'economic growth', 'economy grew'],
  'WB.NY.GDP.PCAP.CD':    ['per capita', 'income per person', 'gdp per capita'],
  'WB.NV.AGR.TOTL.ZS':    ['agriculture', 'farming', 'crop'],
  'WB.NV.IND.TOTL.ZS':    ['industry', 'mining', 'manufacturing', 'industrial'],
  'WB.NV.SRV.TOTL.ZS':    ['services sector', 'service sector'],
  'CBL.M1':             ['money supply', 'narrow money'],
  'CBL.M2':             ['money supply', 'broad money', 'm2'],
  'CBL.MB':             ['monetary base', 'reserve money'],
  'CBL.CURRENCY_CIRC':  ['currency in circulation', 'cash outside bank', 'cash in circulation'],
  'CBL.FX_RESERVES':    ['foreign exchange reserve', 'forex reserve', 'gross reserve', 'international reserve'],
  'WB.DT.DOD.DECT.CD':  ['external debt', 'public debt', 'national debt', 'government debt'],
  'WB.BX.GSR.GNFS.CD':  ['exports', 'export earnings', 'export revenue'],
  'WB.BM.GSR.GNFS.CD':  ['imports', 'import bill', 'import cost'],
  'WB.BN.CAB.XOKA.CD':  ['current account', 'trade balance', 'balance of payment', 'remittance'],
  'WB.BX.KLT.DINV.CD.WD': ['foreign direct investment', 'fdi', 'foreign investment'],
  'CBL.POLICY_RATE':    ['policy rate', 'cbl rate', 'central bank rate', 'monetary policy'],
  'CBL.LENDING_RATE':   ['lending rate', 'loan rate', 'business loan', 'interest rate'],
  'CBL.DEPOSIT_RATE':   ['deposit rate', 'savings rate'],
  'CBL.INTERBANK_RATE': ['interbank'],
  'CBL.RESERVE_REQ':    ['reserve requirement', 'cash reserve'],
  'CBL.TBILL_91':       ['treasury bill', 't-bill', 'tbill'],
  'CBL.TBILL_182':      ['treasury bill', 't-bill', 'tbill'],
  'CBL.TBILL_364':      ['treasury bill', 't-bill', 'tbill'],
  'WB.SL.UEM.TOTL.ZS':  ['unemployment', 'jobless'],
  'WB.SL.TLF.CACT.ZS':  ['labor force', 'labour force', 'workforce participation'],
  'WB.SP.POP.TOTL':     ['population'],
  'WB.SP.URB.TOTL.IN.ZS': ['urban population', 'urbanization'],
};

function detectMacros(text: string, macros: MacroRow[]): Set<string> {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const m of macros) {
    if (lower.includes(m.label.toLowerCase())) {
      found.add(m.id);
      continue;
    }
    const escaped = m.series_id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(text)) {
      found.add(m.id);
      continue;
    }
    const keywords = KEYWORD_MAP[m.series_id];
    if (keywords?.some((kw) => lower.includes(kw))) {
      found.add(m.id);
    }
  }
  return found;
}

const SECTION =
  'rounded-2xl border border-gray-200 bg-brand-card p-6';
const SECTION_HEADER = 'mb-4 flex items-end justify-between gap-3';
const SECTION_TITLE  = 'text-base font-bold text-gray-900';
const SECTION_HINT   = 'mt-1 text-xs text-gray-500';
const CHECKBOX_LABEL =
  'group flex items-start gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 transition-colors';
const CHECKBOX =
  'mt-0.5 h-4 w-4 shrink-0 accent-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink';
const SAVE_BUTTON =
  'rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink';

export default function MacroTagForm({
  macros,
  macrosByCategory,
  initialChecked,
  articleText,
  action,
}: MacroTagFormProps) {
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(initialChecked),
  );
  const [detected, setDetected] = useState<Set<string> | null>(null);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function autoDetect() {
    const found = detectMacros(articleText, macros);
    setDetected(found);
    setChecked((prev) => {
      const next = new Set(prev);
      for (const id of found) next.add(id);
      return next;
    });
  }

  return (
    <form action={action} className={SECTION}>
      <div className={SECTION_HEADER}>
        <div>
          <h2 className={SECTION_TITLE}>Macro indicators referenced</h2>
          <p className={SECTION_HINT}>
            {checked.size === 0
              ? "None tagged yet. Tagging makes the article appear on each indicator’s page."
              : `${checked.size} tagged.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={autoDetect}
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
          >
            Auto-detect
          </button>
          <button type="submit" className={SAVE_BUTTON}>Save macro tags</button>
        </div>
      </div>

      {detected !== null && detected.size > 0 && (
        <p className="mb-4 text-xs text-brand-accent" role="status" aria-live="polite">
          +{detected.size} indicator{detected.size !== 1 ? 's' : ''} detected from article text.
        </p>
      )}
      {detected !== null && detected.size === 0 && (
        <p className="mb-4 text-xs text-gray-500" role="status" aria-live="polite">
          No indicators detected — tag manually below.
        </p>
      )}

      {/* Hidden inputs for checked IDs so the form action receives them */}
      {Array.from(checked).map((id) => (
        <input key={id} type="hidden" name="macro_id" value={id} />
      ))}

      <div className="space-y-5">
        {macrosByCategory.map(([category, items]) => (
          <fieldset key={category}>
            <legend className="mb-2 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
              {category}
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {items.map((m) => (
                <label key={m.id} className={CHECKBOX_LABEL}>
                  <input
                    type="checkbox"
                    checked={checked.has(m.id)}
                    onChange={() => toggle(m.id)}
                    className={CHECKBOX}
                  />
                  <span>
                    <span className={`font-medium ${detected?.has(m.id) ? 'text-brand-accent' : 'text-gray-900'} group-hover:text-gray-900`}>
                      {m.label}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">{m.series_id}</span>
                    {detected?.has(m.id) && (
                      <span className="ml-1.5 text-2xs text-brand-accent">auto</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </form>
  );
}
