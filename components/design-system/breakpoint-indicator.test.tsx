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
