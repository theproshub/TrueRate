# TrueRate — Claude working notes

Liberia-focused financial news / Yahoo-Finance-style product. Next.js App Router, Tailwind, Recharts.

## HCI guidelines (apply to every UI change)

These rules are non-negotiable for any new or edited interactive UI. They blend WCAG 2.2 AA, Nielsen heuristics, and platform conventions. When a rule conflicts with a request, surface it — don't silently break it.

### 1. Structure & semantics

- Every page has exactly one `<h1>`. Headings descend without skipping levels.
- Use real landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`. Annotate duplicates with `aria-label` (`<nav aria-label="Footer">`).
- Lists are `<ul>`/`<ol>`, tables are `<table>` with `<thead>` + `scope="col"` on headers and an `sr-only` `<caption>`.
- Forms use `<form>` with a real submit handler and a `<label>` (visible or `sr-only`) for every input.
- Internal navigation uses `next/link`. Reserve `<a href>` for external/mailto/tel links.

### 2. Keyboard & focus

- Everything clickable is reachable by Tab and operable with Enter/Space. No `onMouseEnter`-only menus — pair with click + Escape.
- Visible focus on every interactive element: `focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none`. Never set `outline:none` without a replacement.
- Modals/drawers: trap focus inside, restore focus to the trigger on close, close on Escape, lock body scroll. (Header's MobileMenu is the reference implementation.)
- Disclosure widgets (accordions, dropdowns) expose `aria-expanded` and reference their content via `aria-controls`.

### 3. Touch & pointer targets

- Minimum 44×44px hit area (WCAG 2.5.5). For visually small icons, expand the click area with padding, not transforms.
- Never rely on hover alone for critical info — every hover state has a focus or tap equivalent.

### 4. Color & contrast

- Body text and UI labels: ≥4.5:1 against background. Large text (≥18px bold or ≥24px regular): ≥3:1.
- Tailwind shorthand: `text-gray-500` on dark (`bg-brand-dark`) is borderline — prefer `text-gray-400` for body, `text-gray-500` only for de-emphasized metadata ≤12px, and check with a contrast tool when unsure.
- Color is never the only carrier of meaning. Up/down deltas pair color with `+`/`−` signs or arrows.

### 5. Motion & live regions

- Wrap decorative animation in `motion-safe:` so `prefers-reduced-motion` users get static UI. Pulse dots, autoplay, parallax — all gated.
- Content that updates without user action (live feeds, tickers, toast) gets `aria-live="polite"` (or `"assertive"` for errors). Counters/timers that change every second should not be live-announced.

### 6. Images & icons

- Decorative images: `alt=""` and `aria-hidden="true"`. Informative: `alt="<concise description>"`.
- Standalone icon buttons (no visible text) must have `aria-label`. SVGs inside labelled buttons get `aria-hidden="true"`.

### 7. Data visualization

- Every chart has a text summary nearby (one sentence stating the headline) and an `aria-label` or `<figcaption>` describing the data shape.
- Tooltips that appear on hover must also appear on keyboard focus, or the underlying data must be available another way (table, list).

### 8. Error prevention & feedback

- Destructive actions confirm. Forms validate inline with `aria-invalid` and `aria-describedby` pointing at the error message.
- Empty `<input>` submissions don't navigate or no-op silently — show an inline message.

### Quick checklist before merging UI changes

1. Tab through the page — every interactive thing is reachable, focus is visible.
2. Test with the keyboard only — open menus, close them with Escape, submit forms with Enter.
3. Zoom to 200% — layout doesn't break; text doesn't get clipped.
4. Run `prefers-reduced-motion` — nothing animates that doesn't have to.
5. Check contrast on any new color combination.
