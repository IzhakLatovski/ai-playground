// app/design-system/radius/page.tsx
import { tokens } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { RadiusSwatch } from '@/components/design-system/radius-swatch';
import { Button } from '@/components/ui/button';

export default function RadiusPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Radius</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Balanced radius scale. Default is <code className="font-mono text-body bg-muted px-1.5 py-0.5 rounded">md</code> (8px).
      </p>

      <PageSection title="Scale">
        <div className="flex flex-wrap gap-6 rounded-lg border border-border bg-card p-6">
          {Object.entries(tokens.radius).map(([token, value]) => (
            <RadiusSwatch key={token} token={token} value={value} />
          ))}
        </div>
      </PageSection>

      <PageSection title="Applied" description="Radii as they appear on real elements.">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-6">
          <Button>Button · md</Button>
          <input
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            placeholder="Input · md"
          />
          <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm">Card · lg</div>
          <span className="rounded-full bg-success-muted px-2.5 py-0.5 text-xs font-medium text-success-muted-foreground">
            Chip · full
          </span>
        </div>
      </PageSection>
    </>
  );
}
