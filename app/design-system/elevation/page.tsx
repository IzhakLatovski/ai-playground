// app/design-system/elevation/page.tsx
import { PageSection } from '@/components/design-system/page-section';
import { ElevationCard } from '@/components/design-system/elevation-card';

const steps: Array<{ token: string; cls: string }> = [
  { token: 'shadow-sm',  cls: 'shadow-sm' },
  { token: 'shadow',     cls: 'shadow' },
  { token: 'shadow-md',  cls: 'shadow-md' },
  { token: 'shadow-lg',  cls: 'shadow-lg' },
  { token: 'shadow-xl',  cls: 'shadow-xl' },
  { token: 'shadow-2xl', cls: 'shadow-2xl' },
];

export default function ElevationPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Elevation</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Subtle shadow scale, tinted toward the primary color family. In dark mode, shadows are replaced by
        borders and a minimal dark shadow.
      </p>

      <PageSection title="Scale — light">
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-zinc-50 p-6 sm:grid-cols-2 md:grid-cols-3">
          {steps.map((s) => (
            <ElevationCard key={s.token} token={s.token} shadowClass={s.cls} mode="light" />
          ))}
        </div>
      </PageSection>

      <PageSection title="Scale — dark" description="Same tokens; borders do the work on near-black surfaces.">
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-zinc-950 p-6 sm:grid-cols-2 md:grid-cols-3">
          {steps.map((s) => (
            <ElevationCard key={s.token} token={s.token} shadowClass={s.cls} mode="dark" />
          ))}
        </div>
      </PageSection>

      <PageSection title="Applied" description="A resting card, a floating menu, and a modal stacked in order.">
        <div className="relative rounded-lg bg-muted p-10">
          <div className="rounded-lg border border-border bg-card p-4 shadow">
            <div className="text-h4 text-card-foreground">Resting card</div>
            <div className="text-sm text-muted-foreground">shadow</div>
          </div>
          <div className="absolute right-16 top-20 w-48 rounded-lg border border-border bg-card p-2 shadow-lg">
            <div className="rounded-md px-2 py-1 text-sm text-card-foreground hover:bg-muted">Menu item</div>
            <div className="rounded-md px-2 py-1 text-sm text-card-foreground hover:bg-muted">Menu item</div>
            <div className="font-mono text-xs text-muted-foreground px-2 pt-1">shadow-lg</div>
          </div>
          <div className="mx-auto mt-20 max-w-sm rounded-lg border border-border bg-card p-5 shadow-xl">
            <div className="text-h4 text-card-foreground mb-1">Modal</div>
            <div className="text-sm text-muted-foreground">shadow-xl — deepest elevation.</div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
