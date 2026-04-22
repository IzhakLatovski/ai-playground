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
