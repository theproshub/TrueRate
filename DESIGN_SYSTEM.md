# TrueRate Design System

Single source of truth for colors, typography, spacing, and UI primitives.
All tokens are defined in `tailwind.config.ts` and mirrored as CSS custom properties in `src/app/globals.css`.

---

## Tokens

### Colors

| Token | Class | Value | Use |
|-------|-------|-------|-----|
| Brand accent | `brand-accent` | `#BFEA36` | Primary CTA backgrounds, active indicators |
| Brand accent hover | `brand-accent-hover` | `#a8d42a` | Hover state for brand-accent buttons |
| Brand dark | `brand-dark` | `#050d11` | Page background |
| Brand muted | `brand-muted` | `#030a0e` | Deepest dark — innermost header layer |
| Brand header | `brand-header` | `#061520` | Top navigation background |
| Brand card | `brand-card` | `#040f18` | Card / panel background |
| Brand azure | `brand-azure` | `#061E29` | Borders, subtle accents |
| Brand light | `brand-light` | `#F3F4F4` | Light-mode surface / subtle text |
| Brand surface | `brand-surface` | `#f8f9fa` | Light page background (news, article pages) |
| Brand ink | `brand-ink` | `#0a0a0d` | Near-black text on light surfaces |
| Positive | `pos` | `#00a757` | Up-moves, success states |
| Negative | `neg` | `#e11b22` | Down-moves, error states |
| Warning | `warning` | `#f59e0b` | Alert states |
| Info | `info` | `#3b82f6` | Informational states |

**Rule:** never write a raw hex value in a page or component. If a value doesn't have a token, add one to `tailwind.config.ts`.

#### Gray scale
Use Tailwind's built-in gray scale (`gray-300` through `gray-600`) for text hierarchy on dark surfaces. On light surfaces use `gray-600` through `gray-900`.

#### Opacity overlays
Prefer opacity modifiers (`bg-white/5`, `border-white/10`) over hardcoded semi-transparent colors.

---

### Typography

All sizes are defined in `tailwind.config.ts → fontSize`. **Never write `text-[Xpx]`.**

| Class | Size | Line height | Use |
|-------|------|------------|-----|
| `text-2xs` | 10px | 1.35 | Tiny badges, eyebrow labels |
| `text-xs`  | 11px | 1.35 | Timestamps, small meta |
| `text-sm`  | 12px | 1.35 | Secondary labels |
| `text-base`| 13px | 1.385 | Body text (primary reading size) |
| `text-md`  | 14px | 1.4 | Body emphasis, form text |
| `text-lg`  | 16px | 1.4 | h4 / sub-heading |
| `text-xl`  | 18px | 1.3 | h3 / card title |
| `text-2xl` | 22px | 1.2 | h2 / section heading |
| `text-3xl` | 32px | 1.125 | h1 / hero |

#### Font families
| Class | Family | Use |
|-------|--------|-----|
| `font-sans` / `font-inter` | Inter | Headings, UI labels, buttons |
| `font-montserrat` / `font-body` | Montserrat | Body copy, paragraphs, form text |
| `font-mono` | Roboto Mono | Financial figures, tabular data |

#### Financial numbers
Always pair `font-mono tabular-nums` on price / percentage displays so digits align in columns.

---

### Spacing

Stick to Tailwind's default spacing scale. Custom tokens added for sticky positioning offsets only:

| Class | Value | Use |
|-------|-------|-----|
| `top-header`    | 64px  | Sticky sidebar/rail offset — below header |
| `top-header-md` | 100px | Sticky offset — below header + indicator strip |
| `top-header-lg` | 120px | Sticky offset — below header + strip + section nav |

---

### Border Radius

| Class | Value |
|-------|-------|
| `rounded-sm` | 4px |
| `rounded-md` | 6px |
| `rounded-lg` | 8px |
| `rounded-xl` | 12px |
| `rounded-full` | 9999px |

---

### Box Shadow

Subtle only — no glow or colored shadows.

| Class | Use |
|-------|-----|
| `shadow-sm` | Inline elements, badges |
| `shadow-md` | Cards, dropdowns |
| `shadow-lg` | Modals, popovers |

---

## UI Primitives

Located in `src/components/ui/`. Import from the barrel:

```ts
import { Button, Card, Badge, Heading, Text, Container, Input } from '@/components/ui';
```

### Container
Centered page wrapper — `max-w-[1320px]`, consistent horizontal padding.

```tsx
<Container>                   {/* wraps page content */}
<Container padded>            {/* adds vertical padding */}
```

### Heading
Renders `h1`–`h6` with the correct token-based size class. Forwards all standard
HTML heading attributes (`id`, `aria-*`, `role`) so it works with
`aria-labelledby` patterns.

| Level | Size | Default weight |
|-------|------|----------------|
| 1 | `text-3xl` (32px) | `bold` |
| 2 | `text-2xl` (22px) | `bold` |
| 3 | `text-xl`  (18px) | `semibold` |
| 4 | `text-lg`  (16px) | `semibold` |
| 5 | `text-md`  (14px) | `semibold` |
| 6 | `text-base`(13px) | `semibold` |

```tsx
<Heading level={1}>Page Title</Heading>
<Heading level={3} as="h2">Section (renders h2, styled as h3)</Heading>
<Heading level={2} id="top-stories">Top Stories</Heading>  {/* for aria-labelledby */}
<Heading level={1} weight="black">Hero with extra-heavy weight</Heading>
```

### Text
Body copy with variant-controlled size and color. Forwards all standard HTML attributes.

| Variant | Class output |
|---------|--------------|
| `body` (default) | `text-base text-gray-300 font-body` |
| `body-sm` | `text-sm text-gray-500 font-body` |
| `meta` | `text-xs text-gray-400 font-body` |
| `label` | `text-sm text-gray-400 font-medium uppercase tracking-wide` |
| `caption` | `text-2xs text-gray-500 font-body` |

```tsx
<Text>Body paragraph</Text>
<Text variant="body-sm">Secondary body copy</Text>
<Text variant="meta">Jan 12 · 3 min read</Text>
<Text variant="label" as="span">Category</Text>
<Text variant="caption">Footnote</Text>
```

**Color overrides:** primitives default to the dark-theme gray hierarchy. On
light-theme pages (news article detail), override with `className="text-gray-700"`
or similar.

### Badge
Inline pill / tag.

```tsx
<Badge variant="accent">LIVE</Badge>
<Badge variant="success" size="sm">+2.4%</Badge>
<Badge variant="danger">−0.8%</Badge>
<Badge variant="neutral">Draft</Badge>
```

### Card
Panel container with token-based background.

```tsx
<Card>…</Card>
<Card variant="surface" padding="lg">…</Card>   {/* for light-bg pages */}
<Card variant="transparent" padding="none">…</Card>
```

### Button
Interactive button with consistent focus ring.

```tsx
<Button variant="primary" onClick={fn}>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline" size="sm">View all</Button>
<Button variant="ghost" size="lg">Learn more</Button>
```

### Input
Labelled text input. Label is mandatory (visible or `sr-only`).

```tsx
<Input label="Email" type="email" value={email} onChange={setEmail} />
<Input label="Search" labelHidden placeholder="Search…" />
<Input label="Amount" error="Required" value="" onChange={…} />
```

---

## Rules

1. **No raw hex values** in pages or components. Add a token if one is missing.
2. **No `text-[Xpx]`** arbitrary font sizes. Use named `text-*` tokens.
3. **No `style={{}}`** for colors or layout that can be expressed as a Tailwind class. Reserve inline styles for runtime-computed values only (e.g., `style={{ width: \`${pct}%\` }}`).
4. **No raw `<h1>`–`<h6>` with ad-hoc classes** in new code — use `<Heading>`. Existing raw headings can be migrated incrementally.
5. **No raw `<p>` with ad-hoc size classes** in new code — use `<Text>`.
6. **Focus rings:** always `focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none`.
7. **Touch targets:** interactive elements must be ≥ 44×44px (`min-h-[44px]` or `size-11`).

## Intentional exceptions (do not change)

| File | Value | Reason |
|------|-------|--------|
| `sign-in`, `sign-up` pages | `#6001d2`, `#490099`, `#c4b5fd` | Clerk auth brand colors |
| Sports stat displays | `text-[44px]`, `text-[24px]` | Hero stat figures, outside typography scale |
| Markets table headers | `text-[9px]` | Below scale floor — intentional de-emphasis |
| Sports/markets headlines | `text-[26px]` | Responsive mid-point between `text-2xl` (22px) and `text-3xl` (32px) |

---

## Verification

Run this after any refactor to catch regressions:

```bash
# Should return empty (except intentional exceptions listed above)
grep -r --include="*.tsx" --include="*.ts" \
  -E 'text-\[([0-9]+px|#[0-9a-fA-F]+)\]|bg-\[#[0-9a-fA-F]+\]|style=\{\{[^}]*color' \
  src/ | grep -v '#6001d2\|#490099\|#c4b5fd\|44px\|24px\|9px\|26px'
```
