// components/design-system/in-context-preview.tsx
import { Button } from '@/components/ui/button';

export function InContextPreview() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow">
      <h3 className="text-h4 text-card-foreground mb-1">Foundations preview</h3>
      <p className="text-sm text-muted-foreground mb-4">
        A neutral card demonstrating the current mode&apos;s tokens in a real UI.
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
