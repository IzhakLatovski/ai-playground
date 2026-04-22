// app/design-system/typography/page.tsx
import { tokens, type TypographyRole } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { TypeRow } from '@/components/design-system/type-row';

const samples: Record<TypographyRole, string> = {
  display: 'Level up your skills',
  h1:      'Page heading',
  h2:      'Section heading',
  h3:      'Subsection heading',
  h4:      'Card title',
  lg:      'Lead paragraph — used sparingly for intros.',
  body:    'Default body text for paragraphs, form labels, and descriptive content.',
  sm:      'Small text — helper copy, metadata, table cells.',
  xs:      'Label · Eyebrow · Tag',
  code:    'kubectl get pods -n prod',
};

export default function TypographyPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Typography</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Geist Sans for UI, Geist Mono for code. Ten named roles cover every usage.
      </p>

      <PageSection title="Font families">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="font-mono text-xs text-muted-foreground mb-2">Geist Sans</div>
            <div className="text-display text-card-foreground">The quick brown fox</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="font-mono text-xs text-muted-foreground mb-2">Geist Mono</div>
            <div className="font-mono text-h3 text-card-foreground">docker compose up -d</div>
          </div>
        </div>
      </PageSection>

      <PageSection title="Type scale">
        <div className="rounded-lg border border-border bg-card px-5 py-2">
          {(Object.keys(tokens.typography.scale) as TypographyRole[]).map((role) => (
            <TypeRow
              key={role}
              role={role}
              meta={tokens.typography.scale[role]}
              sample={samples[role]}
              mono={role === 'code'}
            />
          ))}
        </div>
      </PageSection>

      <PageSection title="Weights">
        <div className="rounded-lg border border-border bg-card p-5 space-y-2">
          <div style={{ fontSize: '20px', fontWeight: 400 }}>Regular · 400</div>
          <div style={{ fontSize: '20px', fontWeight: 500 }}>Medium · 500</div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>Semibold · 600</div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>Bold · 700</div>
        </div>
      </PageSection>
    </>
  );
}
