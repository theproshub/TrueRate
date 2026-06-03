import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Don't lint build output / generated files (keeps lint signal on real source only).
  { ignores: ["**/.next/**", "**/out/**", "**/build/**", "**/dist/**", "next-env.d.ts", "**/*.min.js"] },

  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },

  // Node scripts and root config files run in Node, not the browser.
  { files: ["scripts/**/*.{js,mjs,cjs}", "*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Next.js plugin (flat-config registration — the package still ships eslintrc presets,
  // so register manually and apply both rule sets). Resolves @next/next/* rules used in
  // inline disable directives and enables Core Web Vitals checks.
  {
    plugins: { "@next/next": pluginNext },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },

  // Next.js uses the automatic JSX runtime — React need not be in scope, and TS
  // covers prop types. Without this, react/react-in-jsx-scope floods every JSX line.
  {
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },

  // ── Brand design-system guardrail ──────────────────────────────────────────
  // Locks in the accent-unification + on-brand-CTA work (see DESIGN-AUDIT.md).
  // Only patterns with ZERO current occurrences are errors, so this never breaks
  // a clean tree — it just blocks regressions. Expand as more debt is paid down
  // (e.g. add raw max-w-[1320px] once that is migrated).
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/text-\\[\\d/]",
          message:
            "Arbitrary text sizes are banned — use the type-scale tokens (text-2xs … text-3xl) or stat-sm/md/xl for display figures. (text-[clamp(...)] is allowed for decorative type.)",
        },
        {
          selector: "TemplateElement[value.raw=/text-\\[\\d/]",
          message:
            "Arbitrary text sizes are banned — use the type-scale tokens (text-2xs … text-3xl) or stat-sm/md/xl for display figures. (text-[clamp(...)] is allowed for decorative type.)",
        },
        {
          selector: "Literal[value=/max-w-\\[1320px\\]/]",
          message:
            "Raw max-w-[1320px] is banned — use the max-w-container token (or the <Container> primitive).",
        },
        {
          selector: "TemplateElement[value.raw=/max-w-\\[1320px\\]/]",
          message:
            "Raw max-w-[1320px] is banned — use the max-w-container token (or the <Container> primitive).",
        },
        {
          selector: "Literal[value=/-lime-/]",
          message:
            "Tailwind lime-* is banned — use brand tokens: brand-accent (dark surfaces) or brand-accent-ink (light). See DESIGN-AUDIT.md.",
        },
        {
          selector: "TemplateElement[value.raw=/-lime-/]",
          message:
            "Tailwind lime-* is banned — use brand tokens: brand-accent (dark surfaces) or brand-accent-ink (light). See DESIGN-AUDIT.md.",
        },
        {
          selector: "Literal[value=/#(6001d2|490099)/i]",
          message:
            "Off-brand purple (#6001d2/#490099) is banned. Use brand-accent for primary CTAs.",
        },
        {
          selector: "TemplateElement[value.raw=/#(6001d2|490099)/i]",
          message:
            "Off-brand purple (#6001d2/#490099) is banned. Use brand-accent for primary CTAs.",
        },
      ],
    },
  },
]);
