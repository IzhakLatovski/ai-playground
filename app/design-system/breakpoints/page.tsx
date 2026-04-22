// app/design-system/breakpoints/page.tsx
import { tokens } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { BreakpointIndicator } from '@/components/design-system/breakpoint-indicator';

export default function BreakpointsPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Breakpoints</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Tailwind defaults, mobile-first. The structural break is <code className="font-mono bg-muted px-1.5 py-0.5 rounded">md</code> (768px).
      </p>

      <PageSection title="Live indicator" description="Resize the window — the active breakpoint updates instantly.">
        <BreakpointIndicator />
      </PageSection>

      <PageSection title="Scale">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Token</th>
                <th className="px-4 py-2 text-left font-medium">Min width</th>
              </tr>
            </thead>
            <tbody className="text-card-foreground">
              <tr className="border-t border-border">
                <td className="px-4 py-2"><code className="font-mono">(base)</code></td>
                <td className="px-4 py-2 font-mono">0px</td>
              </tr>
              {Object.entries(tokens.breakpoints).map(([token, value]) => (
                <tr key={token} className="border-t border-border">
                  <td className="px-4 py-2"><code className="font-mono">{token}</code></td>
                  <td className="px-4 py-2 font-mono">{value}px</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection title="Responsive demo" description="6 cells: 1 column at base, 2 at sm, 3 at md, 4 at lg, 6 at xl.">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex h-16 items-center justify-center rounded-lg bg-primary/20 font-mono text-sm text-primary">
              {i + 1}
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
