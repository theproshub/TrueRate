# Contributing — TrueRate

## Domain Boundary Rules

TrueRate is a CBL interpreter. The codebase physically separates:

1. **Verified recounting (facts)** — figures, series, periods, units from CBL / Supabase. Never invented, never inferred.
2. **Interpretation (editorial)** — "what this means for Liberia." Traceable to a human decision or house-style rule.

### Import rules (enforced by ESLint as warnings → errors)

| From | May import | Must NOT import |
|------|-----------|-----------------|
| `domain/cbl`, `domain/markets` | `data/*`, `lib/*` (utilities) | `domain/interpretation`, `domain/editorial` |
| `domain/interpretation`, `domain/editorial` | `domain/cbl`, `domain/markets`, `lib/*` | — |
| `components/*` | `domain/*`, `lib/*` | `@supabase/*`, `data/*` (storage clients) |
| `app/*` (pages/routes) | anything via server imports | — |

### Data access

Only `src/data/` and `src/lib/supabase/` should create Supabase clients. Domain logic stays testable and storage-agnostic.

## Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| Files (modules, components) | `kebab-case.tsx` | `exchange-rate-card.tsx` |
| Types, interfaces, components | `PascalCase` | `ExchangeRate`, `TrendChart` |
| Functions, variables | `camelCase` | `fetchLiveRates` |
| Constants | `UPPER_SNAKE` | `CBL_POLICY_RATE` |
| CBL identifiers | Canonical shape (upper) | `LBR_EXR_EPR_1` |

## Types

One definition per concept, canonically in `src/types/` (or `src/lib/types/` until migration). If a type exists in multiple places, collapse to one and re-export.

## Commits

- Imperative mood: "Add rate limiter" not "Added rate limiter"
- One logical change per commit
- Reference the domain boundary being touched: `[cbl]`, `[editorial]`, `[data]`, `[ui]`

## No Fabricated Data

Every displayed figure must trace back to a CBL series, external API, or clearly-labelled seed constant. Components render dashes (not zeros, not stale values) when live data is unavailable.
