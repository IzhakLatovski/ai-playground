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
