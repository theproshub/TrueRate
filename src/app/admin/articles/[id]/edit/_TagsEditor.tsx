import { createClient } from '@/lib/supabase/server';
import { setArticleMacroTags, setArticleSymbolTags } from '../../_actions';
import MacroTagForm from './_MacroTagForm';

interface MacroRow {
  id: string;
  series_id: string;
  label: string;
  category: string;
}

interface SymbolRow {
  id: string;
  ticker: string;
  name: string;
  asset_class: string;
}

interface TagsEditorProps {
  articleId: string;
  articleTitle: string;
  articleBody: string;
}

const SECTION =
  'rounded-2xl border border-white/[0.07] bg-brand-card p-6';
const SECTION_HEADER = 'mb-4 flex items-end justify-between gap-3';
const SECTION_TITLE  = 'text-base font-bold text-white';
const SECTION_HINT   = 'mt-1 text-xs text-gray-500';
const CHECKBOX_LABEL =
  'group flex items-start gap-2 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors';
const CHECKBOX =
  'mt-0.5 h-4 w-4 shrink-0 accent-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';
const SAVE_BUTTON =
  'rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';

export default async function TagsEditor({ articleId, articleTitle, articleBody }: TagsEditorProps) {
  const supabase = await createClient();

  const [allMacrosResult, allSymbolsResult, currentMacrosResult, currentSymbolsResult] =
    await Promise.all([
      supabase
        .from('macro_series')
        .select('id, series_id, label, category')
        .order('category')
        .order('label'),
      supabase
        .from('symbols')
        .select('id, ticker, name, asset_class')
        .eq('is_active', true)
        .order('asset_class')
        .order('ticker'),
      supabase.from('article_macros').select('series_id').eq('article_id', articleId),
      supabase.from('article_symbols').select('symbol_id').eq('article_id', articleId),
    ]);

  const allMacros  = (allMacrosResult.data  ?? []) as MacroRow[];
  const allSymbols = (allSymbolsResult.data ?? []) as SymbolRow[];
  const currentMacroIds = new Set(
    (currentMacrosResult.data ?? []).map((r) => (r as { series_id: string }).series_id),
  );
  const currentSymbolIds = new Set(
    (currentSymbolsResult.data ?? []).map((r) => (r as { symbol_id: string }).symbol_id),
  );

  const macrosByCategory = new Map<string, MacroRow[]>();
  for (const m of allMacros) {
    const arr = macrosByCategory.get(m.category) ?? [];
    arr.push(m);
    macrosByCategory.set(m.category, arr);
  }

  const symbolsByClass = new Map<string, SymbolRow[]>();
  for (const s of allSymbols) {
    const arr = symbolsByClass.get(s.asset_class) ?? [];
    arr.push(s);
    symbolsByClass.set(s.asset_class, arr);
  }

  const saveMacros  = setArticleMacroTags.bind(null, articleId);
  const saveSymbols = setArticleSymbolTags.bind(null, articleId);

  const articleText = `${articleTitle} ${articleBody}`;

  return (
    <div id="tags" className="space-y-6">
      {/* Macro tags — client component for auto-detect */}
      <MacroTagForm
        macros={allMacros}
        macrosByCategory={Array.from(macrosByCategory.entries())}
        initialChecked={Array.from(currentMacroIds)}
        articleText={articleText}
        action={saveMacros}
      />

      {/* Symbol tags */}
      <form action={saveSymbols} className={SECTION}>
        <div className={SECTION_HEADER}>
          <div>
            <h2 className={SECTION_TITLE}>Symbols referenced</h2>
            <p className={SECTION_HINT}>
              {allSymbols.length === 0
                ? 'No symbols in the universe yet. Add them via the equities seed migration.'
                : currentSymbolIds.size === 0
                  ? 'None tagged yet.'
                  : `${currentSymbolIds.size} tagged.`}
            </p>
          </div>
          <button
            type="submit"
            className={SAVE_BUTTON}
            disabled={allSymbols.length === 0}
          >
            Save symbol tags
          </button>
        </div>
        {allSymbols.length === 0 ? (
          <p className="text-sm text-gray-500">
            Once you seed regional equities, FX pairs, and commodities, you&apos;ll be able
            to tag this article with any of them here.
          </p>
        ) : (
          <div className="space-y-5">
            {Array.from(symbolsByClass.entries()).map(([assetClass, items]) => (
              <fieldset key={assetClass}>
                <legend className="mb-2 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
                  {assetClass}
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {items.map((s) => (
                    <label key={s.id} className={CHECKBOX_LABEL}>
                      <input
                        type="checkbox"
                        name="symbol_id"
                        value={s.id}
                        defaultChecked={currentSymbolIds.has(s.id)}
                        className={CHECKBOX}
                      />
                      <span>
                        <span className="font-mono text-xs uppercase text-white">{s.ticker}</span>
                        <span className="ml-2 text-xs text-gray-400">{s.name}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
