# TASK-001 — ESLint governance gate (design-system enforcement)

**Source:** `DESIGN-AUDIT.md` → C3, item #48, Component Plan #4 · **Priority:** P0 · **Effort:** S · **Impact:** High

## Problem
Design-system primitives and tokens exist but are bypassed at scale (Container 2 vs 41 raw uses; 4 parallel greens; off-brand purple CTAs; 18 arbitrary `text-[…px]`). There is no automated gate, so every new commit can add more drift. Fixing the drift by codemod is pointless until the gate exists — otherwise it re-rots.

## Goal
Add lint rules that fail CI on new design-system violations, run against a **guarded baseline** so existing violations don't block work but no *new* ones can land.

## Scope — rules to enforce (via `no-restricted-syntax` / `eslint-plugin-tailwindcss` / regex rules in `eslint.config.mjs`)
1. Ban arbitrary type sizes: `className` containing `text-[` (e.g. `text-[9px]`, `text-[44px]`). Use type tokens.
2. Ban off-brand green utilities: `*-lime-*` and `*-emerald-*`. Use `brand-accent` / `pos`.
3. Ban raw hex in `className` / inline `style` (e.g. `#6001d2`, `#490099`, `#16a34a`, `#dc2626`). Use tokens.
4. Ban raw container width: `max-w-[1320px]`. Use `<Container>`.
5. (Stretch) Warn on raw `gray-###` utilities — map to semantic text roles later (M6/#49).
6. (Stretch) Warn on `ring-lime-500` — focus ring must be `ring-brand-accent` (M5/#11).

## Baseline strategy
- Generate a baseline so the ~hundreds of existing violations are recorded, not blocking.
- New/changed lines that introduce a banned pattern must fail.
- Options (pick one): `eslint --no-error-on-unmatched-pattern` + a committed suppressions file, OR run lint only on staged/changed files in CI (`lint-staged` + diff-scoped lint), OR `eslint-nibble`/baseline snapshot. **Recommended:** diff-scoped lint in CI on changed files so the gate is strict for all new work without a giant suppressions file.

## Acceptance criteria
- [ ] Rules 1–4 implemented in `eslint.config.mjs` with clear error messages pointing to the right token/primitive.
- [ ] `npm run lint` passes on the current tree (baseline respected — existing violations don't fail the build).
- [ ] A new line with `text-[10px]`, `bg-lime-500`, `#6001d2`, or `max-w-[1320px]` **fails** lint.
- [ ] CI step runs the gate on PRs (diff-scoped) and blocks merge on new violations.
- [ ] Short note added to `CLAUDE.md` / `DESIGN_SYSTEM.md` documenting the banned patterns and their token replacements.

## Out of scope (follow-up tasks)
- The actual codemods (4 greens → 1, purple → `Button`, `text-[…]` → tokens, container migration). Those are TASK-002+ and run *against this guarded baseline*.

## Verification
- Add a temporary file with each banned pattern → confirm lint errors → remove it.
- Run `npm run build` to confirm no config regressions.
