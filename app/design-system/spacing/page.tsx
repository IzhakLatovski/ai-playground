// app/design-system/spacing/page.tsx
import { tokens } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { SpacingRow } from '@/components/design-system/spacing-row';

// Explicit order — JS object iteration lists integer-looking keys ("0", "1", …)
// before non-integer keys ("0.5", "1.5"), which sorts the half-steps to the end.
const spacingOrder: Array<keyof typeof tokens.spacing> = [
  '0', '0.5', '1', '1.5', '2', '3', '4', '5', '6', '8', '10', '12', '16', '24',
];

export default function SpacingPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Spacing</h1>
      <p className="text-lg text-muted-foreground mb-10">
        4px base unit. Tailwind default scale. Every value is a multiple of 4.
      </p>

      <PageSection title="Scale">
        <div className="rounded-lg border border-border bg-card p-5 overflow-x-auto">
          {spacingOrder.map((token) => (
            <SpacingRow key={token} token={token} value={tokens.spacing[token]} />
          ))}
        </div>
      </PageSection>

      <PageSection title="In context">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-h4 mb-2">Internal</h3>
            <p className="text-sm text-muted-foreground mb-3">Component internals — p-4, gap-2.</p>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded bg-primary/20" />
              <div className="h-8 w-8 rounded bg-primary/20" />
              <div className="h-8 w-8 rounded bg-primary/20" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-h4 mb-2">Layout</h3>
            <p className="text-sm text-muted-foreground mb-4">Between components — p-6, gap-6.</p>
            <div className="flex gap-6">
              <div className="h-10 w-10 rounded bg-primary/20" />
              <div className="h-10 w-10 rounded bg-primary/20" />
              <div className="h-10 w-10 rounded bg-primary/20" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-10">
            <h3 className="text-h4 mb-2">Page-level</h3>
            <p className="text-sm text-muted-foreground mb-4">Major sections — p-10, gap-10.</p>
            <div className="flex gap-10">
              <div className="h-10 w-10 rounded bg-primary/20" />
              <div className="h-10 w-10 rounded bg-primary/20" />
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
