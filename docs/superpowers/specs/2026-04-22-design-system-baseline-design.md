# DCR Design System — Baseline Spec

**Date:** 2026-04-22
**Status:** Approved. Covers all six foundations — colors, typography, spacing, radius, elevation, breakpoints — plus the showcase page that renders them.
**Scope:** Design foundations only — the visual language every future feature will be built on, plus a responsive showcase page that renders each decision as a live reference.

---

## 1. Overview

This spec defines the DCR design system baseline:

1. The visual foundations — **colors, typography, spacing, radius, elevation, breakpoints** — expressed as design tokens with full light/dark-mode parity.
2. A responsive **design-system showcase page** that renders every locked-in decision as a live reference. One route per foundation.

The showcase page is not product UI. It is the single source of truth for anyone building on top of the design system.

## 2. Out of Scope

- Any product features, routes, data models, or domain logic — those live in separate specs built on top of this foundation.
- **Primitive components** (buttons, inputs, cards as reusable components, badges, etc.) — covered in a follow-up stage. This spec sizes and tokens them implicitly through the showcase page's needs, but the component API and variants are designed separately.
- Advanced design tokens (motion/transitions, icon system, z-index scale) — deferred until a product need surfaces them.
- Showcase-page niceties: copy-to-clipboard on swatches, search, contrast-ratio annotations.

## 3. Tech Stack

- **Next.js 15** (App Router) — TypeScript.
- **Tailwind CSS v3** — foundations expressed via `tailwind.config.ts` + CSS custom properties. (v3 chosen over v4 because shadcn/ui tooling is most polished there; revisit later.)
- **shadcn/ui** — initialized, using `Button` and `Card` primitives in the showcase. Theme uses our tokens, not shadcn defaults.
- **next-themes** — light/dark/system mode with no-flash hydration.
- **lucide-react** — icons (sidebar, mode toggle).

## 4. Color System

Defined as design tokens consumed both by Tailwind utilities (e.g. `bg-brand-600`) and by semantic CSS variables that swap between light and dark mode (e.g. `bg-background`).

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

Two layers — the **scale** (raw hues) and the **semantic** (role-based) — so component code never hardcodes hex:

**Scale tokens** (Tailwind config `theme.extend.colors`):
- `brand-{50..950}` — the primary scale above.
- `zinc-{50..950}` — Tailwind default.
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

Exposed as Tailwind utilities (`bg-background`, `text-primary-foreground`, `bg-success-muted`, etc.) via the Tailwind config.

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

## 5. Typography

### 5.1 Font Families

- **Sans (UI):** Geist — loaded via `next/font/google` (weights 400, 500, 600, 700).
- **Mono (code, IDs, commands):** Geist Mono — loaded via `next/font/google` (weights 400, 500).
- **Fallback stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` for sans; `ui-monospace, SFMono-Regular, Menlo, monospace` for mono.

Exposed as Tailwind utilities `font-sans` (default) and `font-mono`. Font files are self-hosted via `next/font` — no runtime CDN request.

### 5.2 Type Scale

Ten roles. Each Tailwind utility bundles size + weight + line-height + letter-spacing so a component writes one class.

| Token        | Font size | Weight | Line-height | Letter-spacing | Role                                |
|--------------|-----------|--------|-------------|----------------|-------------------------------------|
| `text-display` | 48px    | 700    | 1.1         | -0.03em        | Hero headlines only                 |
| `text-h1`    | 36px      | 700    | 1.15        | -0.025em       | Page titles                         |
| `text-h2`    | 28px      | 600    | 1.2         | -0.02em        | Section headings                    |
| `text-h3`    | 22px      | 600    | 1.3         | -0.015em       | Subsections                         |
| `text-h4`    | 18px      | 600    | 1.35        | -0.01em        | Card titles, form section labels    |
| `text-lg`    | 17px      | 400    | 1.55        | 0              | Lead paragraphs, emphasized intros  |
| `text-body`  | 15px      | 400    | 1.55        | 0              | Default body                        |
| `text-sm`    | 13px      | 400    | 1.5         | 0              | Helper text, metadata, table cells  |
| `text-xs`    | 11px      | 500    | 1.4         | 0.08em         | Labels, eyebrows, tags (uppercase)  |
| `text-code`  | 13px      | 400    | 1.5         | 0              | Inline code (uses `font-mono`)      |

Weights used across the system: 400 (regular), 500 (medium — labels, buttons, emphasis), 600 (semibold — H2–H4), 700 (bold — H1/display).

## 6. Spacing

Base unit: **4px**. Tailwind's default spacing scale — no custom values.

| Token | px | Primary use                                |
|-------|-----|-------------------------------------------|
| `0`   | 0   | —                                         |
| `0.5` | 2   | Icon-to-text gap, tight dividers          |
| `1`   | 4   | Tight inline spacing                      |
| `1.5` | 6   | Chip padding                              |
| `2`   | 8   | Default gap between related items         |
| `3`   | 12  | Button horizontal padding                 |
| `4`   | 16  | Card padding, default section gap         |
| `5`   | 20  | Generous inline padding                   |
| `6`   | 24  | Comfortable card padding, section heads   |
| `8`   | 32  | Between major sections                    |
| `10`  | 40  | Page section breaks                       |
| `12`  | 48  | Large section breaks                      |
| `16`  | 64  | Page-level vertical rhythm                |
| `24`  | 96  | Hero sections                             |

**Rules:**
- Every spacing value is a multiple of 4.
- Prefer even steps (2, 4, 6, 8) over odd ones (5, 7).
- Component internals: 2/3/4/6. Layout between components: 6/8/10/12. Page-level rhythm: 12/16/24.

## 7. Radius

**Level: Balanced (B+).** Between Subtle and Friendly — crisper than consumer apps, softer than pure shadcn defaults.

Full scale:

| Token         | Value   | Primary use                              |
|---------------|---------|------------------------------------------|
| `rounded-none`| 0       | Flush elements, image tiles              |
| `rounded-sm`  | 4px     | Small tags, dense list items             |
| `rounded-md`  | 8px     | **Default** — buttons, inputs, selects   |
| `rounded-lg`  | 12px    | Cards, panels, modals, popovers          |
| `rounded-xl`  | 16px    | Feature cards, hero surfaces             |
| `rounded-2xl` | 20px    | Oversized promotional surfaces           |
| `rounded-full`| 9999px  | Chips, badges, avatars                   |

**Rules:**
- `md` is the default — interactive controls (buttons, inputs) use `md` unless they have a reason not to.
- Container surfaces (cards, modals) use `lg`.
- Chips and badges always use `full`.
- Focus rings follow the element's radius.

## 8. Elevation

**Level: Subtle (B).** Soft, tight shadows tinted toward the primary color family so elevated surfaces feel part of the same visual system.

Shadow color basis: `rgba(22, 16, 74, α)` — the primary-950 value at low opacity.

### 8.1 Light-Mode Shadow Scale

| Token              | Shadow                                                                                      | Primary use                  |
|--------------------|---------------------------------------------------------------------------------------------|------------------------------|
| `shadow-sm`        | `0 1px 2px rgba(22,16,74,0.04)`                                                             | Subtle card separation       |
| `shadow` (default) | `0 1px 3px rgba(22,16,74,0.05), 0 1px 2px rgba(22,16,74,0.04)`                              | Resting cards                |
| `shadow-md`        | `0 4px 10px rgba(22,16,74,0.08), 0 2px 4px rgba(22,16,74,0.05)`                             | Hover states, small floating |
| `shadow-lg`        | `0 6px 16px rgba(22,16,74,0.10), 0 2px 6px rgba(22,16,74,0.06)`                             | Dropdowns, popovers          |
| `shadow-xl`        | `0 12px 28px rgba(22,16,74,0.14), 0 4px 10px rgba(22,16,74,0.08)`                           | Modals, dialogs              |
| `shadow-2xl`       | `0 24px 48px rgba(22,16,74,0.18), 0 8px 20px rgba(22,16,74,0.10)`                           | Full-page overlays           |

### 8.2 Dark-Mode Shadow Scale

Dark-mode shadows barely register on near-black — elevation is signaled primarily by a **slightly lighter surface** and a **subtle border**, with a minimal shadow as a supporting cue.

| Token              | Treatment                                                                                          |
|--------------------|----------------------------------------------------------------------------------------------------|
| `shadow-sm` – `shadow` | 1px border in `--border` (#27272A) + no shadow                                                 |
| `shadow-md`        | Border + `0 1px 3px rgba(0,0,0,0.4)`                                                                |
| `shadow-lg`        | Border + `0 4px 12px rgba(0,0,0,0.5)`                                                               |
| `shadow-xl`        | Lighter border (`#3F3F46`) + `0 8px 20px rgba(0,0,0,0.6)`                                           |
| `shadow-2xl`       | Lighter border + `0 16px 32px rgba(0,0,0,0.7)`                                                      |

Implemented via CSS variables so the same `shadow-lg` utility produces the right treatment in each mode.

## 9. Breakpoints

Tailwind defaults — mobile-first. No custom breakpoints.

| Token  | Min width | Typical device                    |
|--------|-----------|-----------------------------------|
| (base) | 0         | Phone portrait                    |
| `sm`   | 640px     | Large phone / phone landscape     |
| `md`   | 768px     | Tablet portrait                   |
| `lg`   | 1024px    | Tablet landscape / small laptop   |
| `xl`   | 1280px    | Laptop — design sweet spot        |
| `2xl`  | 1536px    | Large monitor                     |

**Rules:**
- Mobile-first: base styles target phones; `sm:`/`md:`/etc. progressively enhance.
- **Structural break: `md` (768px).** That's where the showcase sidebar appears and multi-column grids open up. Below `md`, collapse to single column + horizontal tab nav.
- `xl` (1280px) is the designed-for sweet spot for dashboards.
- Max content width: `max-w-screen-xl` centered with comfortable padding. Wider viewports keep the gutter.

## 10. Dark Mode Strategy

- `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`.
- Default on first visit: system preference.
- User can override with the mode toggle in the showcase topbar — choice persists in localStorage.
- `<html>` gets `class="dark"` when dark is active. Tailwind config uses `darkMode: 'class'`.
- A minimal inline script in `<head>` sets the class before hydration to prevent the light-flash on reload.
- All tokens (§4.5, §8.2) resolve via CSS variables so mode changes never require JS-driven style swaps.

## 11. Showcase Page Structure

**Layout: sidebar navigation + route-per-foundation.** All six foundations ship as implemented pages in this phase.

### 11.1 Routes

| Route                              | Status          | Contents                              |
|------------------------------------|-----------------|---------------------------------------|
| `/`                                | redirect        | → `/design-system/colors`             |
| `/design-system`                   | redirect        | → `/design-system/colors`             |
| `/design-system/colors`            | **implemented** | Full palette (§11.3.1)                |
| `/design-system/typography`        | **implemented** | Font families + scale (§11.3.2)       |
| `/design-system/spacing`           | **implemented** | Spacing scale with visual ruler (§11.3.3) |
| `/design-system/radius`            | **implemented** | Radius scale on sample elements (§11.3.4) |
| `/design-system/elevation`         | **implemented** | Shadow scale on sample cards (§11.3.5) |
| `/design-system/breakpoints`       | **implemented** | Live viewport indicator + breakpoint table (§11.3.6) |
| `/design-system/components/*`      | deferred        | Sidebar entries disabled              |

### 11.2 Chrome (present on every showcase route)

- **Sidebar (≥ md, 240px wide):**
  - DCR wordmark at top.
  - Group **"Foundations"** → Colors, Typography, Spacing, Radius, Elevation, Breakpoints (all active).
  - Group **"Components"** → Buttons, Inputs, Cards, Badges (all disabled with placeholder state).
  - Active item styled with `bg-primary/10 text-primary`. Disabled items at ~40% opacity, italicized, no hover.
- **Topbar:**
  - Current page title on the left.
  - Light/dark mode toggle on the right (sun/moon icon; cycles light → dark → system).
- **Main area:**
  - Max-width `max-w-screen-xl` minus sidebar, centered, `px-6 md:px-10 py-10`.

### 11.3 Per-Foundation Page Content

Each page has a short intro paragraph, then sections rendered directly from `lib/tokens.ts` so tokens are the single source of truth.

#### 11.3.1 Colors

1. **Primary** — 11-step scale as labeled swatches. Each swatch: Tailwind token name (`brand-600`), hex, step. ★ on step 600, ◐ on step 400.
2. **Neutrals** — same treatment with zinc tokens.
3. **Semantic** — 2×2 grid (success, info, warning, error). Each card shows the strong hex + light-mode + dark-mode soft banner previews stacked (both visible regardless of active mode).
4. **In-context preview** — sample card in active mode: primary button, outlined button, muted body text, success chip.

#### 11.3.2 Typography

1. **Font families** — Geist sample ("The quick brown fox") at display size; Geist Mono sample with a shell command.
2. **Type scale** — one row per role (§5.2). Each row: role name + metadata (size/weight/line-height/letter-spacing) on the left, live-rendered sample sentence on the right.
3. **Weights** — "Regular · Medium · Semibold · Bold" each rendered at 20px.

#### 11.3.3 Spacing

1. **Scale visualization** — one row per spacing token. Each row: token name + px value + a horizontal bar at that exact width, all anchored to the same left edge.
2. **Application examples** — three mini-cards demonstrating component-internal (p-4, gap-2), layout (p-6, gap-8), and page-level (p-10) spacing, captioned with what's being illustrated.

#### 11.3.4 Radius

1. **Scale visualization** — one swatch per radius token (from `none` through `2xl` to `full`), each a 64×64 square with the radius applied. Token name + value below.
2. **Applied examples** — a button, an input, a card, and a chip rendered using the rules in §7 (buttons `md`, card `lg`, chip `full`, etc.).

#### 11.3.5 Elevation

1. **Scale visualization** — one card per shadow token, resting on a muted background, captioned with the token name and the shadow CSS.
2. **Dark-mode preview** — the same six cards rendered on a dark surface inline below, showing the border + subtle-shadow treatment.
3. **Applied examples** — a resting card (`shadow`), a dropdown menu (`shadow-lg`), a modal (`shadow-xl`) — stacked in a mini-scene.

#### 11.3.6 Breakpoints

1. **Live indicator** — a strip at the top of the page showing the current viewport width and the active breakpoint token, updating on resize.
2. **Table** — §9 rendered.
3. **Responsive demo** — a single "demo box" with 6 colored cells; below `sm` it's 1 column, `sm` → 2, `md` → 3, `lg` → 4, `xl` → 6. Active breakpoint highlighted in sync with the live indicator. Scales via Tailwind prefixes, so the example is also the implementation.

### 11.4 Responsive Behavior

- **≥ md (768px):** sidebar visible at 240px, main content to its right.
- **< md:** sidebar collapses into a horizontal-scrolling pill-tab row at the top (active pill uses `--primary`). DCR wordmark + mode toggle sit in a slim top bar above the tabs.
- Swatch / sample grids reflow 4 → 2 → 1 via Tailwind responsive prefixes.
- Primary/neutral scale rows stay single-row at all sizes (swatches shrink) — breaking the scale across rows obscures the lightness progression.

## 12. Project Structure

```
ai-playground/
├── app/
│   ├── layout.tsx                       # <html> + ThemeProvider + fonts + globals
│   ├── globals.css                      # CSS variables (light + .dark) + Tailwind directives
│   ├── page.tsx                         # redirect → /design-system/colors
│   └── design-system/
│       ├── layout.tsx                   # sidebar + topbar chrome
│       ├── page.tsx                     # redirect → /colors
│       ├── colors/page.tsx
│       ├── typography/page.tsx
│       ├── spacing/page.tsx
│       ├── radius/page.tsx
│       ├── elevation/page.tsx
│       └── breakpoints/page.tsx
├── components/
│   ├── design-system/
│   │   ├── sidebar.tsx                  # desktop sidebar + mobile tab row
│   │   ├── mode-toggle.tsx              # light/dark/system button
│   │   ├── page-section.tsx             # H2 + intro + slot wrapper used on every foundation page
│   │   ├── color-scale.tsx              # 11-step scale renderer
│   │   ├── semantic-card.tsx            # one semantic color card w/ dual-mode banners
│   │   ├── in-context-preview.tsx       # sample card preview on colors page
│   │   ├── type-row.tsx                 # one row of the type scale
│   │   ├── spacing-row.tsx              # one row of the spacing scale (bar viz)
│   │   ├── radius-swatch.tsx            # one 64x64 square showing a radius
│   │   ├── elevation-card.tsx           # one card rendered with a shadow token
│   │   └── breakpoint-indicator.tsx     # live viewport-width + active-bp badge
│   ├── theme-provider.tsx               # wraps next-themes
│   └── ui/                              # shadcn primitives (button, card)
├── lib/
│   ├── tokens.ts                        # single source of truth: colors, typography, spacing, radius, shadows, breakpoints
│   └── utils.ts                         # shadcn cn() helper
└── tailwind.config.ts                   # darkMode: 'class', extended colors/fontSize/spacing/radius/boxShadow referencing CSS vars where applicable
```

`lib/tokens.ts` is the one source of truth — every showcase component reads from it, and the Tailwind config re-exports the same values. Editing a token in `tokens.ts` updates the matching showcase page without JSX edits.

## 13. Future Extensibility

### 13.1 Adding a new foundation (e.g. motion, icons)

1. Add the foundation's tokens to `lib/tokens.ts`.
2. Add corresponding entries to `tailwind.config.ts` and/or `globals.css` as needed.
3. Create `app/design-system/<name>/page.tsx` with the showcase content.
4. Add the entry to the sidebar group.

### 13.2 Next stage — primitive components

After this spec lands, the next spec covers **primitive components** (Button, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Card, Avatar, Alert). Those components will:

- Consume tokens from `lib/tokens.ts` — never hardcode values.
- Get their own showcase pages under `/design-system/components/*` (Buttons, Inputs, etc.) — un-disabling the sidebar entries that are currently placeholders.
- Be built on shadcn/ui primitives where applicable, re-themed to these tokens.

## 14. Success Criteria

The spec is complete when the implementation ships where:

- Every foundation in §4–§9 is rendered at its own route under `/design-system/*`.
- Toggling light/dark via the topbar swaps all semantic tokens correctly with no flash on reload.
- Every foundation page is usable and legible at 375px (iPhone SE), 768px (iPad portrait), and 1440px (laptop).
- The live breakpoint indicator accurately reflects the active Tailwind breakpoint on resize.
- Adding a new foundation requires only the four steps in §13.1.
- The only tokens referenced by showcase components come from `lib/tokens.ts`. No hex strings, font sizes, spacing values, or shadow strings are hardcoded in JSX.
