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
