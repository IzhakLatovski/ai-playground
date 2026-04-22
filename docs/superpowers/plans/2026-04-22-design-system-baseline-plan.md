# DCR Design System Baseline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a Next.js + Tailwind + shadcn/ui application that implements the six design-system foundations (colors, typography, spacing, radius, elevation, breakpoints) as design tokens and renders each at its own showcase route with full light/dark mode parity and responsive behavior.

**Architecture:** All tokens live in a single module (`lib/tokens.ts`) that both the Tailwind config and the showcase pages consume — no hex strings or font sizes are hardcoded in JSX. CSS variables in `globals.css` (swapped by a `.dark` class) power mode-aware semantic tokens. The `/design-system` route group shares a chrome layout (sidebar + topbar + mode toggle) and hosts one route per foundation.

**Tech Stack:** Next.js 16 (App Router, TypeScript), **Tailwind CSS v4** (CSS-first — no `tailwind.config.ts`), shadcn/ui, next-themes, lucide-react, Geist + Geist Mono via `next/font`, Vitest + @testing-library/react for tests.

> **v4 Adaptation Note.** The originally-written Task 6 ("Wire Tailwind config to tokens") is no longer needed — Tailwind v4 has no JS config file; theme config lives in CSS via `@theme inline`. The work from old Task 6 is merged into Task 7 below, which now contains the full v4 `globals.css` with `@theme inline`, `@custom-variant dark`, and `:root`/`.dark` CSS variable blocks. Task 6 is retained as a small "components.json adjustment" task, and downstream task numbering is preserved. The implementer for each task receives v4-adapted instructions directly from the controller.

**Spec:** [`docs/superpowers/specs/2026-04-22-design-system-baseline-design.md`](../specs/2026-04-22-design-system-baseline-design.md)

**Testing strategy:** TDD is applied selectively. Non-trivial logic — the tokens module's structural integrity and the breakpoint-indicator's resize behavior — gets unit tests. Purely visual components (color swatches, type rows, radius squares) are verified by browser QA in Task 17. Writing "renders without crashing" tests for each swatch is YAGNI.

**Package manager:** `pnpm`. If the engineer prefers npm/yarn, swap every `pnpm` command accordingly.

**Working directory for all commands:** `/Users/izhak/Desktop/AI-playground/ai-playground`.

---

## Task 1: Initialize Next.js + TypeScript + Tailwind

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `app/layout.tsx` (placeholder from scaffold), `app/page.tsx` (placeholder), `app/globals.css` (placeholder)
- Modify: `.gitignore` (extended by create-next-app)

- [ ] **Step 1: Confirm directory is ready**

```bash
ls -la
```
Expected output includes: `.git`, `.gitignore`, `CLAUDE.md`, `docs/`, `.superpowers/` (from brainstorming — should already be in `.gitignore`). No `package.json`, no `node_modules`.

- [ ] **Step 2: Scaffold the Next.js app into the current directory**

```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --turbopack --import-alias="@/*" --use-pnpm
```

When prompted about the non-empty directory, answer **Yes** to continue. `create-next-app` preserves existing files it doesn't need to overwrite.

Expected: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts` (or `.js`), `postcss.config.mjs`, `eslint.config.mjs`, and an `app/` directory with `layout.tsx`, `page.tsx`, `globals.css` are created.

- [ ] **Step 3: Normalize the Tailwind config extension**

If Step 2 created `tailwind.config.js`, rename it to `tailwind.config.ts`. If it's already `.ts`, skip this step.

```bash
test -f tailwind.config.js && mv tailwind.config.js tailwind.config.ts || echo "already .ts"
```

- [ ] **Step 4: Verify dev server boots**

```bash
pnpm dev
```

Visit `http://localhost:3000`. Expected: the default Next.js starter page loads. Stop the dev server (Ctrl+C).

- [ ] **Step 5: Commit the scaffold**

```bash
git add -A
git commit -m "chore: scaffold Next.js + TypeScript + Tailwind app"
```

---

## Task 2: Install shadcn/ui and add primitives

**Files:**
- Create: `components.json`, `components/ui/button.tsx`, `components/ui/card.tsx`, `lib/utils.ts`

- [ ] **Step 1: Initialize shadcn/ui**

```bash
pnpm dlx shadcn@latest init
```

Answer the prompts:
- Style: **Default**
- Base color: **Zinc**
- CSS variables: **Yes**

This creates `components.json`, `lib/utils.ts`, and updates `tailwind.config.ts` + `app/globals.css` with shadcn's defaults. We will overwrite both of those with our own values in Tasks 5–6 — shadcn's scaffolding is the starting point, not the final state.

- [ ] **Step 2: Add the Button and Card primitives**

```bash
pnpm dlx shadcn@latest add button card
```

Expected: `components/ui/button.tsx` and `components/ui/card.tsx` exist.

- [ ] **Step 3: Verify the app still builds**

```bash
pnpm build
```

Expected: build succeeds. Ignore any warnings about unused exports.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: initialize shadcn/ui with button and card primitives"
```

---

## Task 3: Install remaining dependencies

**Files:** Modify `package.json` (via pnpm).

- [ ] **Step 1: Install runtime deps**

```bash
pnpm add next-themes lucide-react geist
```

`geist` ships both Geist Sans and Geist Mono as `next/font`-compatible modules.

- [ ] **Step 2: Install test deps**

```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 3: Verify installs**

```bash
pnpm list next-themes lucide-react geist vitest
```

Expected: all four appear with version numbers.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add next-themes, lucide-react, geist, and vitest"
```

---

## Task 4: Configure Vitest

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (add test script), `tsconfig.json` (add vitest types)

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 2: Create `vitest.setup.ts`**

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Add test script to `package.json`**

In the `"scripts"` block add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Add vitest globals to `tsconfig.json`**

In the `"compilerOptions"` block add (or extend) `"types": ["vitest/globals", "@testing-library/jest-dom"]`.

- [ ] **Step 5: Smoke test**

Create `lib/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run:

```bash
pnpm test
```

Expected: 1 test passes.

- [ ] **Step 6: Remove the smoke test and commit**

```bash
rm lib/__tests__/smoke.test.ts
rmdir lib/__tests__ 2>/dev/null || true
git add -A
git commit -m "chore: configure Vitest + Testing Library"
```

---

## Task 5: Create the tokens module (TDD)

**Files:**
- Create: `lib/tokens.ts`, `lib/tokens.test.ts`

This is the single source of truth referenced by Tailwind config, global CSS, and every showcase component. Tests lock in structural invariants.

- [ ] **Step 1: Write the failing test**

```ts
// lib/tokens.test.ts
import { describe, it, expect } from 'vitest';
import { tokens } from './tokens';

describe('tokens', () => {
  it('brand scale has all 11 steps', () => {
    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    expect(Object.keys(tokens.colors.brand)).toEqual(steps);
  });

  it('brand-600 is the electric-indigo anchor', () => {
    expect(tokens.colors.brand['600']).toBe('#5646FF');
  });

  it('has four semantic colors, each with strong+muted light+dark variants', () => {
    const names = ['success', 'info', 'warning', 'error'] as const;
    for (const name of names) {
      const s = tokens.colors.semantic[name];
      expect(s.strong.light).toMatch(/^#[0-9A-F]{6}$/i);
      expect(s.strong.dark).toMatch(/^#[0-9A-F]{6}$/i);
      expect(s.mutedBg.light).toMatch(/^#[0-9A-F]{6}$/i);
      expect(s.mutedBg.dark).toMatch(/^#[0-9A-F]{6}$/i);
      expect(s.mutedFg.light).toMatch(/^#[0-9A-F]{6}$/i);
      expect(s.mutedFg.dark).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it('typography has 10 roles', () => {
    expect(Object.keys(tokens.typography.scale)).toHaveLength(10);
  });

  it('every typography role has size/weight/lineHeight/letterSpacing', () => {
    for (const role of Object.values(tokens.typography.scale)) {
      expect(role.fontSize).toMatch(/^\d+px$/);
      expect(typeof role.fontWeight).toBe('number');
      expect(typeof role.lineHeight).toBe('number');
      expect(role.letterSpacing).toMatch(/em$|^0$/);
    }
  });

  it('radius scale has none/sm/md/lg/xl/2xl/full', () => {
    expect(Object.keys(tokens.radius)).toEqual(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']);
  });

  it('shadow scale has sm through 2xl with light+dark variants', () => {
    const steps = ['sm', 'base', 'md', 'lg', 'xl', '2xl'] as const;
    for (const step of steps) {
      expect(typeof tokens.shadows[step].light).toBe('string');
      expect(typeof tokens.shadows[step].dark).toBe('string');
    }
  });

  it('breakpoints match Tailwind defaults', () => {
    expect(tokens.breakpoints).toEqual({
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    });
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

```bash
pnpm test lib/tokens.test.ts
```

Expected: FAIL — `tokens` is not defined.

- [ ] **Step 3: Create `lib/tokens.ts`**

```ts
// lib/tokens.ts
// Single source of truth for every design-system foundation.
// Consumed by tailwind.config.ts, globals.css generators, and showcase components.

export const tokens = {
  colors: {
    brand: {
      '50':  '#F0EEFF',
      '100': '#E0DCFF',
      '200': '#C4BBFF',
      '300': '#A296FF',
      '400': '#8070FF',
      '500': '#6656FF',
      '600': '#5646FF',
      '700': '#4233E0',
      '800': '#3527B0',
      '900': '#261B7D',
      '950': '#16104A',
    },
    zinc: {
      '50':  '#FAFAFA',
      '100': '#F4F4F5',
      '200': '#E4E4E7',
      '300': '#D4D4D8',
      '400': '#A1A1AA',
      '500': '#71717A',
      '600': '#52525B',
      '700': '#3F3F46',
      '800': '#27272A',
      '900': '#18181B',
      '950': '#09090B',
    },
    semantic: {
      success: {
        strong:  { light: '#10B981', dark: '#34D399' },
        mutedBg: { light: '#D1FAE5', dark: '#064E3B' },
        mutedFg: { light: '#065F46', dark: '#A7F3D0' },
      },
      info: {
        strong:  { light: '#0EA5E9', dark: '#38BDF8' },
        mutedBg: { light: '#E0F2FE', dark: '#0C4A6E' },
        mutedFg: { light: '#075985', dark: '#BAE6FD' },
      },
      warning: {
        strong:  { light: '#F59E0B', dark: '#FBBF24' },
        mutedBg: { light: '#FEF3C7', dark: '#78350F' },
        mutedFg: { light: '#92400E', dark: '#FDE68A' },
      },
      error: {
        strong:  { light: '#EF4444', dark: '#F87171' },
        mutedBg: { light: '#FEE2E2', dark: '#7F1D1D' },
        mutedFg: { light: '#991B1B', dark: '#FECACA' },
      },
    },
    // Light/dark values for semantic UI tokens (rendered as CSS variables).
    ui: {
      background:         { light: '#FFFFFF', dark: '#09090B' },
      foreground:         { light: '#09090B', dark: '#FAFAFA' },
      card:               { light: '#FFFFFF', dark: '#18181B' },
      cardForeground:     { light: '#09090B', dark: '#FAFAFA' },
      muted:              { light: '#F4F4F5', dark: '#27272A' },
      mutedForeground:    { light: '#71717A', dark: '#A1A1AA' },
      border:             { light: '#E4E4E7', dark: '#27272A' },
      ring:               { light: '#5646FF', dark: '#8070FF' },
      primary:            { light: '#5646FF', dark: '#8070FF' },
      primaryForeground:  { light: '#FFFFFF', dark: '#FFFFFF' },
    },
  },

  typography: {
    // Tailwind utility names are generated from these keys: text-display, text-h1, ...
    scale: {
      display: { fontSize: '48px', fontWeight: 700, lineHeight: 1.1,  letterSpacing: '-0.03em' },
      h1:      { fontSize: '36px', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em' },
      h2:      { fontSize: '28px', fontWeight: 600, lineHeight: 1.2,  letterSpacing: '-0.02em' },
      h3:      { fontSize: '22px', fontWeight: 600, lineHeight: 1.3,  letterSpacing: '-0.015em' },
      h4:      { fontSize: '18px', fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.01em' },
      lg:      { fontSize: '17px', fontWeight: 400, lineHeight: 1.55, letterSpacing: '0' },
      body:    { fontSize: '15px', fontWeight: 400, lineHeight: 1.55, letterSpacing: '0' },
      sm:      { fontSize: '13px', fontWeight: 400, lineHeight: 1.5,  letterSpacing: '0' },
      xs:      { fontSize: '11px', fontWeight: 500, lineHeight: 1.4,  letterSpacing: '0.08em' },
      code:    { fontSize: '13px', fontWeight: 400, lineHeight: 1.5,  letterSpacing: '0' },
    },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },

  // Tailwind defaults — documented here so the showcase can render the table from tokens.
  spacing: {
    '0':   '0px',
    '0.5': '2px',
    '1':   '4px',
    '1.5': '6px',
    '2':   '8px',
    '3':   '12px',
    '4':   '16px',
    '5':   '20px',
    '6':   '24px',
    '8':   '32px',
    '10':  '40px',
    '12':  '48px',
    '16':  '64px',
    '24':  '96px',
  },

  radius: {
    none: '0px',
    sm:   '4px',
    md:   '8px',
    lg:   '12px',
    xl:   '16px',
    '2xl':'20px',
    full: '9999px',
  },

  shadows: {
    sm:   {
      light: '0 1px 2px rgba(22,16,74,0.04)',
      dark:  'none',
    },
    base: {
      light: '0 1px 3px rgba(22,16,74,0.05), 0 1px 2px rgba(22,16,74,0.04)',
      dark:  'none',
    },
    md: {
      light: '0 4px 10px rgba(22,16,74,0.08), 0 2px 4px rgba(22,16,74,0.05)',
      dark:  '0 1px 3px rgba(0,0,0,0.4)',
    },
    lg: {
      light: '0 6px 16px rgba(22,16,74,0.10), 0 2px 6px rgba(22,16,74,0.06)',
      dark:  '0 4px 12px rgba(0,0,0,0.5)',
    },
    xl: {
      light: '0 12px 28px rgba(22,16,74,0.14), 0 4px 10px rgba(22,16,74,0.08)',
      dark:  '0 8px 20px rgba(0,0,0,0.6)',
    },
    '2xl': {
      light: '0 24px 48px rgba(22,16,74,0.18), 0 8px 20px rgba(22,16,74,0.10)',
      dark:  '0 16px 32px rgba(0,0,0,0.7)',
    },
  },

  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const;

export type Tokens = typeof tokens;
export type TypographyRole = keyof Tokens['typography']['scale'];
export type SemanticName = keyof Tokens['colors']['semantic'];
export type BreakpointName = keyof Tokens['breakpoints'];
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
pnpm test lib/tokens.test.ts
```

Expected: all 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/tokens.ts lib/tokens.test.ts
git commit -m "feat(tokens): add single-source-of-truth design tokens module"
```

---

## Task 6: Wire Tailwind config to tokens

**Files:**
- Modify: `tailwind.config.ts` (replace shadcn scaffold)

- [ ] **Step 1: Overwrite `tailwind.config.ts`**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { tokens } from './lib/tokens';

// Turn the typography scale into Tailwind's fontSize shape:
//   [fontSize, { lineHeight, fontWeight, letterSpacing }]
const fontSize = Object.fromEntries(
  Object.entries(tokens.typography.scale).map(([key, v]) => [
    key,
    [
      v.fontSize,
      {
        lineHeight: String(v.lineHeight),
        fontWeight: String(v.fontWeight),
        letterSpacing: v.letterSpacing,
      },
    ],
  ]),
);

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: tokens.colors.brand,
        // Semantic tokens resolve to CSS variables defined in globals.css.
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT:     'hsl(var(--card) / <alpha-value>)',
          foreground:  'hsl(var(--card-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT:     'hsl(var(--muted) / <alpha-value>)',
          foreground:  'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        ring:   'hsl(var(--ring) / <alpha-value>)',
        primary: {
          DEFAULT:    'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT:    'hsl(var(--success) / <alpha-value>)',
          foreground: 'hsl(var(--success-foreground) / <alpha-value>)',
          muted:      'hsl(var(--success-muted) / <alpha-value>)',
          'muted-foreground': 'hsl(var(--success-muted-foreground) / <alpha-value>)',
        },
        info: {
          DEFAULT:    'hsl(var(--info) / <alpha-value>)',
          foreground: 'hsl(var(--info-foreground) / <alpha-value>)',
          muted:      'hsl(var(--info-muted) / <alpha-value>)',
          'muted-foreground': 'hsl(var(--info-muted-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT:    'hsl(var(--warning) / <alpha-value>)',
          foreground: 'hsl(var(--warning-foreground) / <alpha-value>)',
          muted:      'hsl(var(--warning-muted) / <alpha-value>)',
          'muted-foreground': 'hsl(var(--warning-muted-foreground) / <alpha-value>)',
        },
        error: {
          DEFAULT:    'hsl(var(--error) / <alpha-value>)',
          foreground: 'hsl(var(--error-foreground) / <alpha-value>)',
          muted:      'hsl(var(--error-muted) / <alpha-value>)',
          'muted-foreground': 'hsl(var(--error-muted-foreground) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize,
      borderRadius: {
        none: tokens.radius.none,
        sm:   tokens.radius.sm,
        DEFAULT: tokens.radius.md,
        md:   tokens.radius.md,
        lg:   tokens.radius.lg,
        xl:   tokens.radius.xl,
        '2xl': tokens.radius['2xl'],
        full: tokens.radius.full,
      },
      boxShadow: {
        // Light values live directly here; dark values are applied via a custom
        // variant in globals.css (`.dark .shadow-* { box-shadow: ... }`).
        sm:    tokens.shadows.sm.light,
        DEFAULT: tokens.shadows.base.light,
        md:    tokens.shadows.md.light,
        lg:    tokens.shadows.lg.light,
        xl:    tokens.shadows.xl.light,
        '2xl': tokens.shadows['2xl'].light,
        none:  'none',
      },
    },
  },
  plugins: [],
};

export default config;
```

Note: hex values are converted to HSL triplets in the CSS variables (Task 7). Tailwind reads the variables in `hsl(var(--x) / <alpha-value>)` form so utilities like `bg-primary/50` work.

- [ ] **Step 2: Verify the build**

```bash
pnpm build
```

Expected: build succeeds. (No CSS errors, no missing variable warnings — the variables themselves don't exist yet but that's not a compile error, only a runtime visual issue that Task 7 resolves.)

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(tailwind): wire tailwind config to tokens module"
```

---

## Task 7: Write globals.css with CSS variables

**Files:**
- Modify: `app/globals.css` (replace shadcn scaffold)

- [ ] **Step 1: Overwrite `app/globals.css`**

Values are HSL triplets (no `hsl()` wrapper, no commas — e.g. `0 0% 100%`) because Tailwind wraps them with `hsl()` in the config. Convert each hex from `tokens.ui` via any hex→HSL converter; the table below is pre-computed.

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* UI semantic tokens — light */
    --background: 0 0% 100%;
    --foreground: 240 5% 4%;

    --card: 0 0% 100%;
    --card-foreground: 240 5% 4%;

    --muted: 240 5% 96%;
    --muted-foreground: 240 4% 46%;

    --border: 240 5% 90%;
    --ring: 246 100% 64%;

    --primary: 246 100% 64%;          /* #5646FF */
    --primary-foreground: 0 0% 100%;

    --success: 160 84% 39%;           /* #10B981 */
    --success-foreground: 0 0% 100%;
    --success-muted: 152 81% 90%;     /* #D1FAE5 */
    --success-muted-foreground: 164 86% 20%; /* #065F46 */

    --info: 199 89% 48%;              /* #0EA5E9 */
    --info-foreground: 0 0% 100%;
    --info-muted: 204 94% 94%;        /* #E0F2FE */
    --info-muted-foreground: 202 80% 24%; /* #075985 */

    --warning: 38 92% 50%;            /* #F59E0B */
    --warning-foreground: 0 0% 100%;
    --warning-muted: 49 95% 89%;      /* #FEF3C7 */
    --warning-muted-foreground: 23 83% 31%; /* #92400E */

    --error: 0 84% 60%;               /* #EF4444 */
    --error-foreground: 0 0% 100%;
    --error-muted: 0 93% 94%;         /* #FEE2E2 */
    --error-muted-foreground: 0 74% 36%; /* #991B1B */
  }

  .dark {
    --background: 240 6% 4%;          /* #09090B */
    --foreground: 0 0% 98%;

    --card: 240 4% 10%;               /* #18181B */
    --card-foreground: 0 0% 98%;

    --muted: 240 4% 16%;              /* #27272A */
    --muted-foreground: 240 5% 65%;

    --border: 240 4% 16%;
    --ring: 243 100% 72%;             /* #8070FF */

    --primary: 243 100% 72%;          /* #8070FF */
    --primary-foreground: 0 0% 100%;

    --success: 160 64% 52%;           /* #34D399 */
    --success-foreground: 0 0% 100%;
    --success-muted: 164 86% 16%;     /* #064E3B */
    --success-muted-foreground: 152 76% 80%; /* #A7F3D0 */

    --info: 199 94% 60%;              /* #38BDF8 */
    --info-foreground: 0 0% 100%;
    --info-muted: 201 90% 24%;        /* #0C4A6E */
    --info-muted-foreground: 204 94% 86%; /* #BAE6FD */

    --warning: 43 96% 56%;            /* #FBBF24 */
    --warning-foreground: 0 0% 100%;
    --warning-muted: 22 82% 26%;      /* #78350F */
    --warning-muted-foreground: 48 96% 76%; /* #FDE68A */

    --error: 0 91% 71%;               /* #F87171 */
    --error-foreground: 0 0% 100%;
    --error-muted: 0 63% 30%;         /* #7F1D1D */
    --error-muted-foreground: 0 96% 89%; /* #FECACA */
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}

/* Dark-mode shadow overrides.
   Elevation lifts with a subtle border + progressively stronger shadow on dark surfaces. */
@layer utilities {
  .dark .shadow-sm      { box-shadow: none; }
  .dark .shadow         { box-shadow: none; }
  .dark .shadow-md      { box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
  .dark .shadow-lg      { box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
  .dark .shadow-xl      { box-shadow: 0 8px 20px rgba(0,0,0,0.6); }
  .dark .shadow-2xl     { box-shadow: 0 16px 32px rgba(0,0,0,0.7); }
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(tokens): add semantic CSS variables for light + dark modes"
```

---

## Task 8: Configure Geist fonts in the root layout

**Files:**
- Modify: `app/layout.tsx` (replace scaffold)

- [ ] **Step 1: Overwrite `app/layout.tsx`**

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'DCR Design System',
  description: 'Design foundations and showcase for DCR.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      style={{
        // Expose Geist CSS vars under the names Tailwind expects.
        ['--font-sans' as string]: `var(${GeistSans.variable})`,
        ['--font-mono' as string]: `var(${GeistMono.variable})`,
      }}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`ThemeProvider` is created in Task 9 — the import will fail until then; that's expected.

- [ ] **Step 2: Commit (build will pass after Task 9)**

Skip running `pnpm build` here — the next task fixes the import.

```bash
git add app/layout.tsx
git commit -m "feat(fonts): wire Geist Sans + Mono via next/font"
```

---

## Task 9: Create the ThemeProvider

**Files:**
- Create: `components/theme-provider.tsx`

- [ ] **Step 1: Create `components/theme-provider.tsx`**

```tsx
// components/theme-provider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git add components/theme-provider.tsx
git commit -m "feat(theme): add next-themes provider wrapper"
```

---

## Task 10: Create root redirect + design-system redirect

**Files:**
- Modify: `app/page.tsx`
- Create: `app/design-system/page.tsx`

- [ ] **Step 1: Overwrite `app/page.tsx`**

```tsx
// app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/design-system/colors');
}
```

- [ ] **Step 2: Create `app/design-system/page.tsx`**

```tsx
// app/design-system/page.tsx
import { redirect } from 'next/navigation';

export default function DesignSystemIndex() {
  redirect('/design-system/colors');
}
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx app/design-system/page.tsx
git commit -m "feat(routes): add redirects to /design-system/colors"
```

---

## Task 11: Build the sidebar

**Files:**
- Create: `components/design-system/sidebar.tsx`

- [ ] **Step 1: Create the sidebar**

```tsx
// components/design-system/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Item = { href: string; label: string; disabled?: boolean };
type Group = { label: string; items: Item[] };

const groups: Group[] = [
  {
    label: 'Foundations',
    items: [
      { href: '/design-system/colors',      label: 'Colors' },
      { href: '/design-system/typography',  label: 'Typography' },
      { href: '/design-system/spacing',     label: 'Spacing' },
      { href: '/design-system/radius',      label: 'Radius' },
      { href: '/design-system/elevation',   label: 'Elevation' },
      { href: '/design-system/breakpoints', label: 'Breakpoints' },
    ],
  },
  {
    label: 'Components',
    items: [
      { href: '#', label: 'Buttons', disabled: true },
      { href: '#', label: 'Inputs',  disabled: true },
      { href: '#', label: 'Cards',   disabled: true },
      { href: '#', label: 'Badges',  disabled: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-border md:bg-card md:px-4 md:py-6">
        <Link href="/design-system/colors" className="mb-6 px-2 text-h3 font-semibold text-primary">
          DCR
        </Link>
        <nav className="flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <div className="px-2 text-xs text-muted-foreground">{group.label}</div>
              {group.items.map((item) => {
                const active = !item.disabled && pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.disabled ? '#' : item.href}
                    aria-disabled={item.disabled}
                    onClick={(e) => item.disabled && e.preventDefault()}
                    className={cn(
                      'rounded-md px-2 py-1.5 text-sm transition-colors',
                      active && 'bg-primary/10 text-primary font-medium',
                      !active && !item.disabled && 'text-foreground hover:bg-muted',
                      item.disabled && 'italic text-muted-foreground/60 cursor-not-allowed',
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile horizontal tab row */}
      <nav className="md:hidden overflow-x-auto border-b border-border bg-card">
        <div className="flex gap-2 px-4 py-3">
          {groups.flatMap((g) => g.items).map((item) => {
            const active = !item.disabled && pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.disabled ? '#' : item.href}
                aria-disabled={item.disabled}
                onClick={(e) => item.disabled && e.preventDefault()}
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors',
                  active && 'bg-primary text-primary-foreground',
                  !active && !item.disabled && 'bg-muted text-foreground',
                  item.disabled && 'bg-muted italic text-muted-foreground/60',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/design-system/sidebar.tsx
git commit -m "feat(ds): add sidebar with desktop column + mobile tab row"
```

---

## Task 12: Build the mode toggle

**Files:**
- Create: `components/design-system/mode-toggle.tsx`

- [ ] **Step 1: Create the mode toggle**

```tsx
// components/design-system/mode-toggle.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

const order = ['light', 'dark', 'system'] as const;
type Mode = typeof order[number];

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const current: Mode = mounted ? ((theme as Mode) ?? 'system') : 'system';
  const next = order[(order.indexOf(current) + 1) % order.length];
  const Icon = current === 'light' ? Sun : current === 'dark' ? Moon : Monitor;
  const label = `Theme: ${current}. Click to switch to ${next}.`;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/design-system/mode-toggle.tsx
git commit -m "feat(ds): add light/dark/system mode toggle"
```

---

## Task 13: Build the design-system layout + page-section wrapper

**Files:**
- Create: `app/design-system/layout.tsx`, `components/design-system/page-section.tsx`

- [ ] **Step 1: Create `components/design-system/page-section.tsx`**

```tsx
// components/design-system/page-section.tsx
import type { ReactNode } from 'react';

export function PageSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-h2 mb-1">{title}</h2>
      {description && <p className="text-body text-muted-foreground mb-5">{description}</p>}
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Create `app/design-system/layout.tsx`**

```tsx
// app/design-system/layout.tsx
import { Sidebar } from '@/components/design-system/sidebar';
import { ModeToggle } from '@/components/design-system/mode-toggle';

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3 md:px-10">
          <span className="text-h4">Design System</span>
          <ModeToggle />
        </header>
        <main className="flex-1 px-6 py-10 md:px-10 max-w-screen-xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: build succeeds. Routes may 404 for the unimplemented pages — that's expected until Tasks 14–19.

- [ ] **Step 4: Commit**

```bash
git add app/design-system/layout.tsx components/design-system/page-section.tsx
git commit -m "feat(ds): add showcase layout (sidebar + topbar) and PageSection wrapper"
```

---

## Task 14: Build the colors page

**Files:**
- Create: `components/design-system/color-scale.tsx`, `components/design-system/semantic-card.tsx`, `components/design-system/in-context-preview.tsx`, `app/design-system/colors/page.tsx`

- [ ] **Step 1: Create `components/design-system/color-scale.tsx`**

```tsx
// components/design-system/color-scale.tsx
import { cn } from '@/lib/utils';

type ColorScaleProps = {
  tokenPrefix: string;       // e.g. "brand" or "zinc"
  scale: Record<string, string>;
  markers?: Record<string, string>; // e.g. { '600': '★', '400': '◐' }
};

export function ColorScale({ tokenPrefix, scale, markers = {} }: ColorScaleProps) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-border">
      {Object.entries(scale).map(([step, hex]) => {
        const isLight = parseInt(step) <= 400;
        return (
          <div
            key={step}
            className={cn(
              'flex min-h-24 flex-1 flex-col justify-end p-2 font-mono text-[10px] leading-tight',
              isLight ? 'text-foreground/80' : 'text-white/95',
            )}
            style={{ backgroundColor: hex }}
          >
            <div className="text-xs font-semibold">
              {step} {markers[step] && <span>{markers[step]}</span>}
            </div>
            <div>{hex.toUpperCase()}</div>
            <div className="opacity-70">{tokenPrefix}-{step}</div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create `components/design-system/semantic-card.tsx`**

```tsx
// components/design-system/semantic-card.tsx
import type { SemanticName, Tokens } from '@/lib/tokens';

type Props = {
  name: SemanticName;
  color: Tokens['colors']['semantic'][SemanticName];
  sampleText: string;
};

export function SemanticCard({ name, color, sampleText }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div
        className="flex items-center justify-between px-3 py-2 font-semibold text-white"
        style={{ backgroundColor: color.strong.light }}
      >
        <span className="capitalize">{name}</span>
        <span className="font-mono text-xs opacity-90">{color.strong.light}</span>
      </div>
      <div className="grid grid-cols-2">
        <Banner label="Light" color={color} mode="light" text={sampleText} surface="#FFFFFF" />
        <Banner label="Dark"  color={color} mode="dark"  text={sampleText} surface="#09090B" />
      </div>
    </div>
  );
}

function Banner({
  label,
  color,
  mode,
  text,
  surface,
}: {
  label: string;
  color: Props['color'];
  mode: 'light' | 'dark';
  text: string;
  surface: string;
}) {
  return (
    <div className="p-3" style={{ backgroundColor: surface }}>
      <div className={mode === 'light' ? 'text-xs text-zinc-500 mb-2' : 'text-xs text-zinc-400 mb-2'}>
        {label}
      </div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs"
        style={{ backgroundColor: color.mutedBg[mode], color: color.mutedFg[mode] }}
      >
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color.strong[mode] }}
        />
        {text}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `components/design-system/in-context-preview.tsx`**

```tsx
// components/design-system/in-context-preview.tsx
import { Button } from '@/components/ui/button';

export function InContextPreview() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow">
      <h3 className="text-h4 text-card-foreground mb-1">Foundations preview</h3>
      <p className="text-sm text-muted-foreground mb-4">
        A neutral card demonstrating the current mode's tokens in a real UI.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button>Primary action</Button>
        <Button variant="outline">Secondary</Button>
        <span className="rounded-full bg-success-muted px-2.5 py-0.5 text-xs font-medium text-success-muted-foreground">
          Ready
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `app/design-system/colors/page.tsx`**

```tsx
// app/design-system/colors/page.tsx
import { tokens } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { ColorScale } from '@/components/design-system/color-scale';
import { SemanticCard } from '@/components/design-system/semantic-card';
import { InContextPreview } from '@/components/design-system/in-context-preview';

export default function ColorsPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Colors</h1>
      <p className="text-lg text-muted-foreground mb-10">
        The DCR palette — primary, neutrals, and semantic colors — in light and dark mode.
      </p>

      <PageSection title="Primary" description="Electric Indigo — the brand color scale.">
        <ColorScale
          tokenPrefix="brand"
          scale={tokens.colors.brand}
          markers={{ '600': '★', '400': '◐' }}
        />
        <p className="text-sm text-muted-foreground mt-3">
          ★ = light-mode primary (step 600). ◐ = dark-mode primary (step 400).
        </p>
      </PageSection>

      <PageSection title="Neutrals" description="Zinc — neutral undertone, stays out of the primary's way.">
        <ColorScale tokenPrefix="zinc" scale={tokens.colors.zinc} />
      </PageSection>

      <PageSection title="Semantic" description="Each color shows its strong value and soft banners in both modes.">
        <div className="grid gap-3 sm:grid-cols-2">
          <SemanticCard name="success" color={tokens.colors.semantic.success} sampleText="Task completed" />
          <SemanticCard name="info"    color={tokens.colors.semantic.info}    sampleText="New update available" />
          <SemanticCard name="warning" color={tokens.colors.semantic.warning} sampleText="Expires in 14 days" />
          <SemanticCard name="error"   color={tokens.colors.semantic.error}   sampleText="Action failed — retry" />
        </div>
      </PageSection>

      <PageSection title="In-context preview" description="Tokens rendered in a real UI block in the active mode.">
        <InContextPreview />
      </PageSection>
    </>
  );
}
```

- [ ] **Step 5: Verify in the browser**

```bash
pnpm dev
```

Visit `http://localhost:3000` → redirects to `/design-system/colors`. Confirm:
- Primary scale visible with ★ on 600, ◐ on 400.
- Zinc scale visible.
- 4 semantic cards visible, each with light + dark banner previews.
- In-context card renders with purple "Primary action" button.
- Sidebar shows all 6 foundation entries active; 4 component entries italicized/disabled.

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add app/design-system/colors components/design-system/color-scale.tsx components/design-system/semantic-card.tsx components/design-system/in-context-preview.tsx
git commit -m "feat(ds): build /design-system/colors page"
```

---

## Task 15: Build the typography page

**Files:**
- Create: `components/design-system/type-row.tsx`, `app/design-system/typography/page.tsx`

- [ ] **Step 1: Create `components/design-system/type-row.tsx`**

```tsx
// components/design-system/type-row.tsx
import type { TypographyRole, Tokens } from '@/lib/tokens';

type Props = {
  role: TypographyRole;
  meta: Tokens['typography']['scale'][TypographyRole];
  sample: string;
  mono?: boolean;
};

export function TypeRow({ role, meta, sample, mono }: Props) {
  return (
    <div className="grid grid-cols-[150px_1fr] items-baseline gap-5 border-b border-border py-4 last:border-b-0">
      <div className="font-mono text-xs text-muted-foreground leading-snug">
        <div className="text-foreground font-medium">{role}</div>
        <div>{meta.fontSize} / {meta.fontWeight}</div>
        <div>lh {meta.lineHeight} · ls {meta.letterSpacing}</div>
      </div>
      <div className={mono ? 'font-mono text-foreground' : 'text-foreground'} style={{
        fontSize: meta.fontSize,
        fontWeight: meta.fontWeight,
        lineHeight: meta.lineHeight,
        letterSpacing: meta.letterSpacing,
        textTransform: role === 'xs' ? 'uppercase' : undefined,
      }}>
        {sample}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/design-system/typography/page.tsx`**

```tsx
// app/design-system/typography/page.tsx
import { tokens, type TypographyRole } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { TypeRow } from '@/components/design-system/type-row';

const samples: Record<TypographyRole, string> = {
  display: 'Level up your skills',
  h1:      'Page heading',
  h2:      'Section heading',
  h3:      'Subsection heading',
  h4:      'Card title',
  lg:      'Lead paragraph — used sparingly for intros.',
  body:    'Default body text for paragraphs, form labels, and descriptive content.',
  sm:      'Small text — helper copy, metadata, table cells.',
  xs:      'Label · Eyebrow · Tag',
  code:    'kubectl get pods -n prod',
};

export default function TypographyPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Typography</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Geist Sans for UI, Geist Mono for code. Ten named roles cover every usage.
      </p>

      <PageSection title="Font families">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="font-mono text-xs text-muted-foreground mb-2">Geist Sans</div>
            <div className="text-display text-card-foreground">The quick brown fox</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="font-mono text-xs text-muted-foreground mb-2">Geist Mono</div>
            <div className="font-mono text-h3 text-card-foreground">docker compose up -d</div>
          </div>
        </div>
      </PageSection>

      <PageSection title="Type scale">
        <div className="rounded-lg border border-border bg-card px-5 py-2">
          {(Object.keys(tokens.typography.scale) as TypographyRole[]).map((role) => (
            <TypeRow
              key={role}
              role={role}
              meta={tokens.typography.scale[role]}
              sample={samples[role]}
              mono={role === 'code'}
            />
          ))}
        </div>
      </PageSection>

      <PageSection title="Weights">
        <div className="rounded-lg border border-border bg-card p-5 space-y-2">
          <div style={{ fontSize: '20px', fontWeight: 400 }}>Regular · 400</div>
          <div style={{ fontSize: '20px', fontWeight: 500 }}>Medium · 500</div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>Semibold · 600</div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>Bold · 700</div>
        </div>
      </PageSection>
    </>
  );
}
```

- [ ] **Step 3: Verify in the browser**

```bash
pnpm dev
```

Visit `/design-system/typography`. Confirm all 10 rows render, sizes scale correctly, Geist is applied. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add app/design-system/typography components/design-system/type-row.tsx
git commit -m "feat(ds): build /design-system/typography page"
```

---

## Task 16: Build the spacing page

**Files:**
- Create: `components/design-system/spacing-row.tsx`, `app/design-system/spacing/page.tsx`

- [ ] **Step 1: Create `components/design-system/spacing-row.tsx`**

```tsx
// components/design-system/spacing-row.tsx
export function SpacingRow({ token, value }: { token: string; value: string }) {
  return (
    <div className="grid grid-cols-[100px_80px_1fr] items-center gap-4 py-2">
      <code className="font-mono text-sm text-foreground">{token}</code>
      <div className="font-mono text-sm text-muted-foreground">{value}</div>
      <div className="h-3 rounded bg-primary" style={{ width: value }} />
    </div>
  );
}
```

- [ ] **Step 2: Create `app/design-system/spacing/page.tsx`**

```tsx
// app/design-system/spacing/page.tsx
import { tokens } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { SpacingRow } from '@/components/design-system/spacing-row';

export default function SpacingPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Spacing</h1>
      <p className="text-lg text-muted-foreground mb-10">
        4px base unit. Tailwind default scale. Every value is a multiple of 4.
      </p>

      <PageSection title="Scale">
        <div className="rounded-lg border border-border bg-card p-5 overflow-x-auto">
          {Object.entries(tokens.spacing).map(([token, value]) => (
            <SpacingRow key={token} token={token} value={value} />
          ))}
        </div>
      </PageSection>

      <PageSection title="In context">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-h4 mb-2">Internal</h3>
            <p className="text-sm text-muted-foreground mb-3">Component internals — p-4, gap-2.</p>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded bg-primary/20" />
              <div className="h-8 w-8 rounded bg-primary/20" />
              <div className="h-8 w-8 rounded bg-primary/20" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-h4 mb-2">Layout</h3>
            <p className="text-sm text-muted-foreground mb-4">Between components — p-6, gap-6.</p>
            <div className="flex gap-6">
              <div className="h-10 w-10 rounded bg-primary/20" />
              <div className="h-10 w-10 rounded bg-primary/20" />
              <div className="h-10 w-10 rounded bg-primary/20" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-10">
            <h3 className="text-h4 mb-2">Page-level</h3>
            <p className="text-sm text-muted-foreground mb-4">Major sections — p-10, gap-10.</p>
            <div className="flex gap-10">
              <div className="h-10 w-10 rounded bg-primary/20" />
              <div className="h-10 w-10 rounded bg-primary/20" />
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
```

- [ ] **Step 3: Verify in the browser**

Visit `/design-system/spacing`. Confirm all 14 bars render at increasing widths, and the three in-context cards demonstrate component / layout / page spacing.

- [ ] **Step 4: Commit**

```bash
git add app/design-system/spacing components/design-system/spacing-row.tsx
git commit -m "feat(ds): build /design-system/spacing page"
```

---

## Task 17: Build the radius page

**Files:**
- Create: `components/design-system/radius-swatch.tsx`, `app/design-system/radius/page.tsx`

- [ ] **Step 1: Create `components/design-system/radius-swatch.tsx`**

```tsx
// components/design-system/radius-swatch.tsx
export function RadiusSwatch({ token, value }: { token: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-16 w-16 bg-primary/20 border border-primary/40"
        style={{ borderRadius: value }}
      />
      <div className="text-center">
        <code className="font-mono text-sm text-foreground">{token}</code>
        <div className="font-mono text-xs text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/design-system/radius/page.tsx`**

```tsx
// app/design-system/radius/page.tsx
import { tokens } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { RadiusSwatch } from '@/components/design-system/radius-swatch';
import { Button } from '@/components/ui/button';

export default function RadiusPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Radius</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Balanced radius scale. Default is <code className="font-mono text-body bg-muted px-1.5 py-0.5 rounded">md</code> (8px).
      </p>

      <PageSection title="Scale">
        <div className="flex flex-wrap gap-6 rounded-lg border border-border bg-card p-6">
          {Object.entries(tokens.radius).map(([token, value]) => (
            <RadiusSwatch key={token} token={token} value={value} />
          ))}
        </div>
      </PageSection>

      <PageSection title="Applied" description="Radii as they appear on real elements.">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-6">
          <Button>Button · md</Button>
          <input
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            placeholder="Input · md"
          />
          <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm">Card · lg</div>
          <span className="rounded-full bg-success-muted px-2.5 py-0.5 text-xs font-medium text-success-muted-foreground">
            Chip · full
          </span>
        </div>
      </PageSection>
    </>
  );
}
```

- [ ] **Step 3: Verify in the browser**

Visit `/design-system/radius`. Confirm 7 radius swatches (`none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`) render at increasing roundness.

- [ ] **Step 4: Commit**

```bash
git add app/design-system/radius components/design-system/radius-swatch.tsx
git commit -m "feat(ds): build /design-system/radius page"
```

---

## Task 18: Build the elevation page

**Files:**
- Create: `components/design-system/elevation-card.tsx`, `app/design-system/elevation/page.tsx`

- [ ] **Step 1: Create `components/design-system/elevation-card.tsx`**

```tsx
// components/design-system/elevation-card.tsx
import { cn } from '@/lib/utils';

export function ElevationCard({
  token,
  shadowClass,
  mode,
}: {
  token: string;
  shadowClass: string;
  mode: 'light' | 'dark';
}) {
  return (
    <div className={cn('p-4', mode === 'dark' && 'dark bg-zinc-950')}>
      <div className={cn('rounded-lg border border-border bg-card p-4', shadowClass)}>
        <code className="font-mono text-sm text-card-foreground">{token}</code>
        <div className="font-mono text-xs text-muted-foreground">{shadowClass}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/design-system/elevation/page.tsx`**

```tsx
// app/design-system/elevation/page.tsx
import { PageSection } from '@/components/design-system/page-section';
import { ElevationCard } from '@/components/design-system/elevation-card';

const steps: Array<{ token: string; cls: string }> = [
  { token: 'shadow-sm',  cls: 'shadow-sm' },
  { token: 'shadow',     cls: 'shadow' },
  { token: 'shadow-md',  cls: 'shadow-md' },
  { token: 'shadow-lg',  cls: 'shadow-lg' },
  { token: 'shadow-xl',  cls: 'shadow-xl' },
  { token: 'shadow-2xl', cls: 'shadow-2xl' },
];

export default function ElevationPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Elevation</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Subtle shadow scale, tinted toward the primary color family. In dark mode, shadows are replaced by
        borders and a minimal dark shadow.
      </p>

      <PageSection title="Scale — light">
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-zinc-50 p-6 sm:grid-cols-2 md:grid-cols-3">
          {steps.map((s) => (
            <ElevationCard key={s.token} token={s.token} shadowClass={s.cls} mode="light" />
          ))}
        </div>
      </PageSection>

      <PageSection title="Scale — dark" description="Same tokens; borders do the work on near-black surfaces.">
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-zinc-950 p-6 sm:grid-cols-2 md:grid-cols-3">
          {steps.map((s) => (
            <ElevationCard key={s.token} token={s.token} shadowClass={s.cls} mode="dark" />
          ))}
        </div>
      </PageSection>

      <PageSection title="Applied" description="A resting card, a floating menu, and a modal stacked in order.">
        <div className="relative rounded-lg bg-muted p-10">
          <div className="rounded-lg border border-border bg-card p-4 shadow">
            <div className="text-h4 text-card-foreground">Resting card</div>
            <div className="text-sm text-muted-foreground">shadow</div>
          </div>
          <div className="absolute right-16 top-20 w-48 rounded-lg border border-border bg-card p-2 shadow-lg">
            <div className="rounded-md px-2 py-1 text-sm text-card-foreground hover:bg-muted">Menu item</div>
            <div className="rounded-md px-2 py-1 text-sm text-card-foreground hover:bg-muted">Menu item</div>
            <div className="font-mono text-xs text-muted-foreground px-2 pt-1">shadow-lg</div>
          </div>
          <div className="mx-auto mt-20 max-w-sm rounded-lg border border-border bg-card p-5 shadow-xl">
            <div className="text-h4 text-card-foreground mb-1">Modal</div>
            <div className="text-sm text-muted-foreground">shadow-xl — deepest elevation.</div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
```

- [ ] **Step 3: Verify in the browser**

Visit `/design-system/elevation`. Toggle mode (topbar). In light mode, cards have subtle tinted shadows; in dark mode, shadows disappear on smaller steps and borders carry the separation.

- [ ] **Step 4: Commit**

```bash
git add app/design-system/elevation components/design-system/elevation-card.tsx
git commit -m "feat(ds): build /design-system/elevation page"
```

---

## Task 19: Build the breakpoint indicator (TDD) + breakpoints page

**Files:**
- Create: `components/design-system/breakpoint-indicator.tsx`, `components/design-system/breakpoint-indicator.test.tsx`, `app/design-system/breakpoints/page.tsx`

The indicator exposes live viewport state. We test its pure function for turning a width into a breakpoint name; the DOM listener is too thin to be worth a test.

- [ ] **Step 1: Write the failing test**

```tsx
// components/design-system/breakpoint-indicator.test.tsx
import { describe, it, expect } from 'vitest';
import { getActiveBreakpoint } from './breakpoint-indicator';

describe('getActiveBreakpoint', () => {
  it('returns "base" below sm', () => {
    expect(getActiveBreakpoint(375)).toBe('base');
    expect(getActiveBreakpoint(639)).toBe('base');
  });

  it('returns "sm" between 640 and 767', () => {
    expect(getActiveBreakpoint(640)).toBe('sm');
    expect(getActiveBreakpoint(767)).toBe('sm');
  });

  it('returns "md" between 768 and 1023', () => {
    expect(getActiveBreakpoint(768)).toBe('md');
    expect(getActiveBreakpoint(1023)).toBe('md');
  });

  it('returns "lg" between 1024 and 1279', () => {
    expect(getActiveBreakpoint(1024)).toBe('lg');
  });

  it('returns "xl" between 1280 and 1535', () => {
    expect(getActiveBreakpoint(1280)).toBe('xl');
    expect(getActiveBreakpoint(1535)).toBe('xl');
  });

  it('returns "2xl" at 1536 and above', () => {
    expect(getActiveBreakpoint(1536)).toBe('2xl');
    expect(getActiveBreakpoint(3000)).toBe('2xl');
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

```bash
pnpm test components/design-system/breakpoint-indicator.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/design-system/breakpoint-indicator.tsx`**

```tsx
// components/design-system/breakpoint-indicator.tsx
'use client';

import * as React from 'react';
import { tokens } from '@/lib/tokens';

export type ActiveBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function getActiveBreakpoint(width: number): ActiveBreakpoint {
  const bp = tokens.breakpoints;
  if (width >= bp['2xl']) return '2xl';
  if (width >= bp.xl) return 'xl';
  if (width >= bp.lg) return 'lg';
  if (width >= bp.md) return 'md';
  if (width >= bp.sm) return 'sm';
  return 'base';
}

export function BreakpointIndicator() {
  const [width, setWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (width === null) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="font-mono text-sm text-muted-foreground">Measuring viewport…</div>
      </div>
    );
  }

  const active = getActiveBreakpoint(width);
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="font-mono text-xs text-muted-foreground mb-1">Current viewport</div>
      <div className="flex items-baseline gap-3">
        <span className="text-h3 text-card-foreground">{width}px</span>
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          {active}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
pnpm test components/design-system/breakpoint-indicator.test.tsx
```

Expected: all 6 tests pass.

- [ ] **Step 5: Create `app/design-system/breakpoints/page.tsx`**

```tsx
// app/design-system/breakpoints/page.tsx
import { tokens } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { BreakpointIndicator } from '@/components/design-system/breakpoint-indicator';

export default function BreakpointsPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Breakpoints</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Tailwind defaults, mobile-first. The structural break is <code className="font-mono bg-muted px-1.5 py-0.5 rounded">md</code> (768px).
      </p>

      <PageSection title="Live indicator" description="Resize the window — the active breakpoint updates instantly.">
        <BreakpointIndicator />
      </PageSection>

      <PageSection title="Scale">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Token</th>
                <th className="px-4 py-2 text-left font-medium">Min width</th>
              </tr>
            </thead>
            <tbody className="text-card-foreground">
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code className="font-mono">(base)</code></td>
                <td className="px-4 py-2 font-mono">0px</td>
              </tr>
              {Object.entries(tokens.breakpoints).map(([token, value]) => (
                <tr key={token} className="border-t border-border">
                  <td className="px-4 py-2"><code className="font-mono">{token}</code></td>
                  <td className="px-4 py-2 font-mono">{value}px</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection title="Responsive demo" description="6 cells: 1 column at base, 2 at sm, 3 at md, 4 at lg, 6 at xl.">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex h-16 items-center justify-center rounded-lg bg-primary/20 font-mono text-sm text-primary">
              {i + 1}
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
```

- [ ] **Step 6: Verify in the browser**

```bash
pnpm dev
```

Visit `/design-system/breakpoints`. Resize the window and watch the live indicator update; watch the 6-cell grid reflow through 1/2/3/4/6 columns. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add app/design-system/breakpoints components/design-system/breakpoint-indicator.tsx components/design-system/breakpoint-indicator.test.tsx
git commit -m "feat(ds): build /design-system/breakpoints page with live indicator"
```

---

## Task 20: Final verification and cleanup

**Files:** none changed directly — this task is about QA and any bug fixes that surface.

- [ ] **Step 1: Run all tests**

```bash
pnpm test
```

Expected: all tests pass (tokens + breakpoint-indicator).

- [ ] **Step 2: Run the type checker + build**

```bash
pnpm build
```

Expected: build succeeds with no TS errors.

- [ ] **Step 3: Responsive + mode QA in the browser**

```bash
pnpm dev
```

For each of the 6 routes — `/design-system/colors`, `/typography`, `/spacing`, `/radius`, `/elevation`, `/breakpoints` — verify:

- Light mode renders correctly.
- Toggling to dark mode swaps all colors, banners, borders, and shadows without a white flash on reload.
- Toggling to system mode follows the OS preference.
- At 375px width (narrow phone), sidebar is a horizontal pill-tab row and all content fits without horizontal scroll.
- At 768px width, sidebar appears as a column.
- At 1280px, layout feels balanced and content caps at `max-w-screen-xl`.

Fix any issues found. If you edited anything, commit fixes with descriptive messages.

- [ ] **Step 4: Confirm file structure matches §12 of the spec**

```bash
find app components lib -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' \) | sort
```

Expected output (order may vary slightly):

```
app/design-system/breakpoints/page.tsx
app/design-system/colors/page.tsx
app/design-system/elevation/page.tsx
app/design-system/layout.tsx
app/design-system/page.tsx
app/design-system/radius/page.tsx
app/design-system/spacing/page.tsx
app/design-system/typography/page.tsx
app/globals.css
app/layout.tsx
app/page.tsx
components/design-system/breakpoint-indicator.test.tsx
components/design-system/breakpoint-indicator.tsx
components/design-system/color-scale.tsx
components/design-system/elevation-card.tsx
components/design-system/in-context-preview.tsx
components/design-system/mode-toggle.tsx
components/design-system/page-section.tsx
components/design-system/radius-swatch.tsx
components/design-system/semantic-card.tsx
components/design-system/sidebar.tsx
components/design-system/spacing-row.tsx
components/design-system/type-row.tsx
components/theme-provider.tsx
components/ui/button.tsx
components/ui/card.tsx
lib/tokens.test.ts
lib/tokens.ts
lib/utils.ts
```

- [ ] **Step 5: Final commit (if anything changed in Step 3) + push**

```bash
git status  # verify clean or commit any fixes
git log --oneline -n 25  # review the commit history
```

If the current branch is tracked upstream:

```bash
git push
```

---

## Self-Review Notes

**Spec coverage check:**
- §4 Color System → Tasks 5, 6, 7, 14 (tokens, Tailwind config, CSS vars, showcase page)
- §5 Typography → Tasks 5, 6, 8, 15 (tokens, Tailwind fontSize, Geist fonts, showcase page)
- §6 Spacing → Tasks 5, 16 (tokens, showcase page — Tailwind defaults need no config extension)
- §7 Radius → Tasks 5, 6, 17 (tokens, Tailwind borderRadius, showcase page)
- §8 Elevation → Tasks 5, 6, 7, 18 (tokens, Tailwind boxShadow, dark-mode CSS overrides, showcase page)
- §9 Breakpoints → Task 19 (live indicator, table, responsive demo — Tailwind defaults need no config extension)
- §10 Dark Mode Strategy → Tasks 7, 8, 9, 12 (globals `.dark` class, ThemeProvider, mode toggle)
- §11 Showcase Page Structure → Tasks 10–19 (redirects, chrome, six foundation pages)
- §12 Project Structure → verified in Task 20, Step 4
- §13 Future Extensibility → implicitly met by token-driven architecture (§13.1 four-step recipe works as written)
- §14 Success Criteria → verified in Task 20 Steps 1–3

**Placeholder scan:** No TBDs, TODOs, "add error handling", or "implement later" — every step contains concrete code or a concrete command.

**Type consistency:**
- `TypographyRole` from `lib/tokens.ts` used identically in Tasks 5, 15.
- `SemanticName` used identically in Tasks 5, 14.
- `ActiveBreakpoint` union matches `tokens.breakpoints` keys + `'base'`, exported from `breakpoint-indicator.tsx` (not `tokens.ts`) to keep the type local to its consumer.
- `getActiveBreakpoint` signature matches between its test (Task 19 Step 1) and implementation (Task 19 Step 3).
- `ColorScale`, `SemanticCard`, `InContextPreview`, `TypeRow`, `SpacingRow`, `RadiusSwatch`, `ElevationCard`, `BreakpointIndicator` component names match between the files that define them, the files that import them, and the project-structure listing in §12 of the spec.
