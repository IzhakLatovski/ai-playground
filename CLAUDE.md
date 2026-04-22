# DCR — Project Instructions

DCR is an internal portal for devops engineers — professional development program with certifications, achievements, and level-ups. This file captures durable project-wide rules and design decisions.

**Full spec:** [docs/superpowers/specs/2026-04-22-design-system-baseline-design.md](docs/superpowers/specs/2026-04-22-design-system-baseline-design.md) is the canonical reference. This file is the short form.

---

## Tech stack

- **Next.js 16** (App Router, TypeScript, Turbopack).
- **Tailwind CSS v4** — CSS-first config in `app/globals.css` via `@theme inline`. No `tailwind.config.ts`.
- **shadcn/ui** primitives, re-themed to our tokens (not shadcn defaults).
- **next-themes** for light/dark/system mode (`attribute="class"`, `.dark` on `<html>`).
- **Geist Sans + Geist Mono** via `next/font/google`.
- **lucide-react** for icons.
- **Vitest + @testing-library/react** for unit tests. **Playwright** for visual/responsive QA.
- **pnpm** package manager.

---

## Design tokens — single source of truth

All design tokens live in [`lib/tokens.ts`](lib/tokens.ts). Every Tailwind utility, CSS variable, and showcase component reads from it. **Never hardcode hex values, font sizes, spacing values, radii, or shadows in JSX.** If a value is missing from `lib/tokens.ts`, add it there first.

The Tailwind utilities generated from these tokens are configured in [`app/globals.css`](app/globals.css) inside `@theme inline`, with light/dark semantic values in `:root` / `.dark` blocks.

### Colors
- **Primary — Electric Indigo.** Brand anchor `#5646FF` at step 600. Full 11-step scale as `brand-{50..950}`.
- **Dark-mode primary** shifts one step lighter to `#8070FF` (step 400) for contrast on dark surfaces.
- **Neutrals — Zinc.** Tailwind default scale.
- **Semantic colors** — Success `#10B981`, Info `#0EA5E9`, Warning `#F59E0B`, Error `#EF4444`. Each has strong + muted-bg + muted-fg variants for both modes.

### Typography
- **Geist Sans** for UI, **Geist Mono** for code.
- **10 named roles:** `text-display` (48/700), `text-h1` (36/700), `text-h2` (28/600), `text-h3` (22/600), `text-h4` (18/600), `text-lg` (17/400), `text-body` (15/400), `text-sm` (13/400), `text-xs` (11/500 uppercase), `text-code` (13/Geist Mono). Each Tailwind utility bundles size + weight + line-height + letter-spacing.
- **Weights used:** 400, 500, 600, 700.

### Spacing
- **4px base unit.** Tailwind default scale (`0`, `0.5`, `1`, `1.5`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `24`). Every value is a multiple of 4.

### Radius
- **Balanced (B+).** Default is `md` (8px). Buttons/inputs `md`, cards `lg` (12px), chips `full`.

### Elevation
- **Subtle shadows** tinted toward the primary color family (`rgba(22,16,74,α)` — primary-950 at low opacity).
- **Dark mode does not use real shadows** — elevation is signaled by borders + a very subtle dark shadow at higher steps. See the `.dark .shadow-*` overrides in `app/globals.css`.

### Breakpoints
- **Tailwind defaults, mobile-first.** `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.
- **Structural break is `md` (768px).** Below `md`: single-column layout, sidebar collapses to horizontal tab row. `xl` (1280px) is the design sweet spot for dashboards.
- **Max content width:** `max-w-screen-xl` centered with comfortable padding.

---

## Required for every feature

### 1. Light and dark mode parity
Every new screen, component, and primitive **must work in both light and dark modes**. Use the semantic color tokens (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, etc.) — they swap automatically via the `.dark` class.

If a color must stay mode-independent (e.g. labels on a colored swatch), set it via inline `style` with a literal value — don't use `text-foreground` or other semantic tokens that will flip with mode. See [`components/design-system/color-scale.tsx`](components/design-system/color-scale.tsx) for the pattern.

### 2. Responsive across viewport sizes
Every new screen and component **must be usable and legible at 375px (phone), 768px (tablet), and 1440px (laptop)**. Design mobile-first: write base styles for phone, then use `sm:` / `md:` / `lg:` / `xl:` prefixes to progressively enhance. Don't assume a desktop-first viewport.

### 3. Visual QA with Playwright
Before claiming a visual feature is complete, **use Playwright** to:
- Navigate to each affected route.
- Capture full-page screenshots in **both light and dark modes**.
- Capture at **375px, 768px, and 1440px viewports**.
- Inspect the screenshots for regressions (invisible text, overflow, broken reflow, missing chrome on mobile, etc.).

Type-check and test suites verify code correctness, not visual correctness. Running Playwright is the only way to catch visual regressions before shipping.

The dev server typically runs at `http://localhost:3000` (or `3001` if 3000 is taken — check the terminal output).

---

## Git workflow

- After completing each logical unit of work, use the `/gitpush` slash command to commit and push the changes.
- Do not commit secrets, `.env` files, or anything in `.gitignore`.
- Feature work happens on feature branches, not `main`.
