// lib/tokens.ts
// Single source of truth for every design-system foundation.
// Consumed by app/globals.css (@theme inline), and by showcase components.

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
    // Light/dark values for semantic UI tokens (rendered as CSS variables in globals.css).
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
