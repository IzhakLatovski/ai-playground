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
