# DCR Design System — Baseline Spec (Colors + Showcase Page)

**Date:** 2026-04-22
**Status:** Approved, pending implementation plan
**Scope:** Foundation only — color system, dark mode, responsive showcase page. Feature pages (certifications, achievements, plans, level-ups) are out of scope for this spec.

---

## 1. Overview

DCR is an internal portal for DevOps engineers participating in a professional development program. It tracks certifications, achievements, learning plans, and level-ups. This spec establishes the visual foundation the rest of the app will build on:

1. A purple-branded color system (primary + neutrals + semantic) with full light/dark mode parity.
2. A responsive **design-system showcase page** that renders every locked-in design decision as a reference. It starts with colors and will grow as typography, spacing, radius, and components are added.

The showcase page is not user-facing product UI — it's the source of truth for designers and engineers working on DCR.

## 2. Out of Scope

- Cert/achievement/plan/level-up pages and data models — separate specs.
- Authentication, routing to real product pages.
- Typography, spacing, radius, and component primitives beyond what the showcase page itself needs — these get their own specs + showcase sections later.
- Copy-to-clipboard on swatches, search, contrast-ratio annotations — nice-to-haves, explicitly deferred.

## 3. Tech Stack

- **Next.js 15** (App Router) — TypeScript.
- **Tailwind CSS v3** — palette expressed via `tailwind.config.ts` + CSS custom properties. (v3 chosen over v4 because shadcn/ui tooling is most polished there; revisit later.)
- **shadcn/ui** — initialized, using `Button` and `Card` primitives in the showcase. Theme uses our palette tokens, not shadcn defaults.
- **next-themes** — light/dark/system mode with no-flash hydration.
- **lucide-react** — icons (sidebar, mode toggle).

## 4. Color System

The palette is defined once as design tokens and consumed both by Tailwind utilities (e.g. `bg-brand-600`) and by semantic CSS variables that swap between light and dark mode (e.g. `bg-background`).

### 4.1 Primary — Electric Indigo

Brand anchor: **#5646FF** at step 600.

| Step | Hex     | Step | Hex     |
|------|---------|------|---------|
| 50   | #F0EEFF | 500  | #6656FF |
| 100  | #E0DCFF | **600 ★** | **#5646FF** |
| 200  | #C4BBFF | 700  | #4233E0 |
| 300  | #A296FF | 800  | #3527B0 |
| 400  | #8070FF | 900  | #261B7D |
|      |         | 950  | #16104A |

- **Light-mode semantic primary:** step 600 (#5646FF).
- **Dark-mode semantic primary:** step 400 (#8070FF) — lighter shift for contrast on dark surfaces.

### 4.2 Neutrals — Zinc

Tailwind's `zinc` scale, 50–950. Chosen for its neutral undertone; `slate` would introduce a blue cast that fights the indigo primary, `gray` leans slightly warm.

### 4.3 Semantic Colors

Each semantic color has a **strong** value (used on icons, dots, solid buttons) and a **soft** pair (muted background + muted foreground) used for banners and chips. The soft pair swaps values in dark mode.

| Semantic | Strong (light) | Strong (dark) | Soft BG (light) | Soft FG (light) | Soft BG (dark) | Soft FG (dark) |
|----------|---------------|---------------|-----------------|-----------------|----------------|----------------|
| Success  | #10B981       | #34D399       | #D1FAE5         | #065F46         | #064E3B        | #A7F3D0        |
| Info     | #0EA5E9       | #38BDF8       | #E0F2FE         | #075985         | #0C4A6E        | #BAE6FD        |
| Warning  | #F59E0B       | #FBBF24       | #FEF3C7         | #92400E         | #78350F        | #FDE68A        |
| Error    | #EF4444       | #F87171       | #FEE2E2         | #991B1B         | #7F1D1D        | #FECACA        |

Info is kept as sky-blue for now. If it reads too close to the indigo primary once everything is wired up, the fallback is teal (#14B8A6) — to be re-evaluated after implementation.

### 4.4 Token Layer

Two layers of tokens — the **scale** (raw hues) and the **semantic** (role-based) — so component code never hardcodes hex:

**Scale tokens** (Tailwind config `theme.extend.colors`):
- `brand-{50..950}` — the primary scale above.
- `zinc-{50..950}` — Tailwind default (still referenced explicitly).
- Semantic hue scales if needed (`success-{500,600,...}` etc.) — but implementation mostly uses the semantic layer below.

**Semantic tokens** (CSS variables in `globals.css`, swapped by `.dark` class):
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--muted`, `--muted-foreground`, `--border`, `--ring`
- `--primary`, `--primary-foreground`
- `--success`, `--success-foreground`, `--success-muted`, `--success-muted-foreground`
- `--info`, `--info-foreground`, `--info-muted`, `--info-muted-foreground`
- `--warning`, `--warning-foreground`, `--warning-muted`, `--warning-muted-foreground`
- `--error`, `--error-foreground`, `--error-muted`, `--error-muted-foreground`

These are exposed as Tailwind utilities (`bg-background`, `text-primary-foreground`, `bg-success-muted`, etc.) via the Tailwind config.

### 4.5 Light and Dark Values — Semantic Tokens

| Token                      | Light         | Dark          |
|----------------------------|---------------|---------------|
| `--background`             | #FFFFFF       | #09090B       |
| `--foreground`             | #09090B       | #FAFAFA       |
| `--card`                   | #FFFFFF       | #18181B       |
| `--card-foreground`        | #09090B       | #FAFAFA       |
| `--muted`                  | #F4F4F5       | #27272A       |
| `--muted-foreground`       | #71717A       | #A1A1AA       |
| `--border`                 | #E4E4E7       | #27272A       |
| `--ring`                   | #5646FF       | #8070FF       |
| `--primary`                | #5646FF       | #8070FF       |
| `--primary-foreground`     | #FFFFFF       | #FFFFFF       |

Semantic-color variables use the values in §4.3.

## 5. Dark Mode Strategy

- `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`.
- Default on first visit: system preference.
- User can override with the mode toggle in the showcase topbar — choice persists in localStorage.
- `<html>` gets `class="dark"` when dark is active. Tailwind config uses `darkMode: 'class'`.
- A minimal inline script in `<head>` sets the class before hydration to prevent the light-flash on reload.

## 6. Showcase Page Structure

**Layout: sidebar navigation + route-per-decision.**

Each design decision is a distinct route under `/design-system`. Future decisions appear in the sidebar as disabled items so engineers can see what's coming.

### 6.1 Routes

| Route                              | Status           | Contents                         |
|------------------------------------|------------------|----------------------------------|
| `/`                                | redirect         | → `/design-system/colors`        |
| `/design-system`                   | redirect         | → `/design-system/colors`        |
| `/design-system/colors`            | **implemented**  | Full palette (see §6.3)          |
| `/design-system/typography`        | deferred         | Sidebar entry disabled           |
| `/design-system/spacing`           | deferred         | Sidebar entry disabled           |
| `/design-system/radius`            | deferred         | Sidebar entry disabled           |
| `/design-system/components/*`      | deferred         | Sidebar entries disabled         |

### 6.2 Chrome (present on every showcase route)

- **Sidebar (≥ md breakpoint, 240px wide):**
  - DCR wordmark at top.
  - Group label **"Foundations"** → Colors (active), Typography (disabled), Spacing (disabled), Radius (disabled).
  - Group label **"Components"** → Buttons (disabled), Cards (disabled).
  - Disabled items render at ~40% opacity, italicized, no hover.
- **Topbar:**
  - Page title on the left ("Colors").
  - Light/dark mode toggle on the right (sun/moon icon, cycles light → dark → system).
- **Main area:**
  - Max-width ~960px, centered, generous padding.

### 6.3 Colors Page Content

Rendered in this order, each as its own section with an H2:

1. **Primary** — the full 11-step scale as labeled swatches. Each swatch shows: the Tailwind token name (`brand-600`), hex, and step number. A ★ marker on step 600 (light primary) and a ◐ on step 400 (dark primary).
2. **Neutrals** — same treatment using zinc tokens.
3. **Semantic** — a 2×2 grid (success, info, warning, error). Each card shows the strong hex, a light-mode soft banner preview, and a dark-mode soft banner preview stacked inside the card regardless of the active mode (so you can see both values at once without toggling).
4. **In-context preview** — one sample "certification card" rendered in the currently-active mode showing primary button, outlined button, muted text, and a success chip. This validates the tokens work as a real UI, not just swatches.

### 6.4 Responsive Behavior

- **≥ md (768px):** sidebar visible at 240px, main content to its right.
- **< md:** sidebar collapses into a horizontal-scrolling pill-tab row at the top of the page (active pill uses `--primary`). DCR wordmark + mode toggle are in a slim top bar above the tabs.
- All swatch grids reflow from 4 columns → 2 → 1 via Tailwind responsive prefixes.
- The primary/neutral scale rows stay single-row on all sizes (swatches shrink), because breaking the scale across rows obscures the lightness progression.

## 7. Project Structure

```
ai-playground/
├── app/
│   ├── layout.tsx                     # <html> + ThemeProvider + global styles
│   ├── page.tsx                       # redirect → /design-system/colors
│   └── design-system/
│       ├── layout.tsx                 # sidebar + topbar chrome
│       ├── page.tsx                   # redirect → /colors
│       └── colors/
│           └── page.tsx               # the colors showcase content
├── components/
│   ├── design-system/
│   │   ├── sidebar.tsx                # desktop sidebar + mobile tab row
│   │   ├── mode-toggle.tsx            # light/dark/system button
│   │   ├── color-scale.tsx            # 11-step scale renderer
│   │   ├── semantic-card.tsx          # one semantic color card w/ dual-mode banners
│   │   └── in-context-preview.tsx     # sample certification card
│   ├── theme-provider.tsx             # wraps next-themes
│   └── ui/                            # shadcn primitives (button, card)
├── lib/
│   ├── tokens.ts                      # exported JS object of the palette, used by showcase components
│   └── utils.ts                       # shadcn cn() helper
├── app/globals.css                    # CSS variables (light + .dark) + Tailwind directives
└── tailwind.config.ts                 # darkMode: 'class', extended colors referencing CSS vars
```

`lib/tokens.ts` is the single source of truth the showcase reads from — if we edit a hex there, the page updates without touching JSX. Tailwind config and CSS variables also reference the same values (duplicated literals are fine at the config layer; the showcase never hardcodes).

## 8. Future Extensibility

The sidebar + route-per-decision structure makes adding the next foundation trivial:

1. Add a new entry to `lib/tokens.ts` (e.g. `typography`).
2. Create `app/design-system/typography/page.tsx` with the showcase content.
3. Un-disable the sidebar item.

No refactor to the chrome, sidebar logic, or theme system is required.

## 9. Success Criteria

The spec is complete when the implementation ships a page where:

- Every color defined in §4 is visible at `/design-system/colors`.
- Toggling light/dark via the topbar swaps all semantic tokens correctly with no flash on reload.
- The page is usable and legible at 375px (iPhone SE), 768px (iPad portrait), and 1440px (laptop).
- Adding a new design decision requires only the three steps in §8.
