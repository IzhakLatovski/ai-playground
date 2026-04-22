// app/design-system/colors/page.tsx
import { tokens } from '@/lib/tokens';
import { PageSection } from '@/components/design-system/page-section';
import { ColorScale } from '@/components/design-system/color-scale';
import { SemanticCard } from '@/components/design-system/semantic-card';
import { InContextPreview } from '@/components/design-system/in-context-preview';

export default function ColorsPage() {
  return (
    <>
      <h1 className="text-h1 mb-2">Colors</h1>
      <p className="text-lg text-muted-foreground mb-10">
        The DCR palette — primary, neutrals, and semantic colors — in light and dark mode.
      </p>

      <PageSection title="Primary" description="Electric Indigo — the brand color scale.">
        <ColorScale
          tokenPrefix="brand"
          scale={tokens.colors.brand}
          markers={{ '600': '★', '400': '◐' }}
        />
        <p className="text-sm text-muted-foreground mt-3">
          ★ = light-mode primary (step 600). ◐ = dark-mode primary (step 400).
        </p>
      </PageSection>

      <PageSection title="Neutrals" description="Zinc — neutral undertone, stays out of the primary's way.">
        <ColorScale tokenPrefix="zinc" scale={tokens.colors.zinc} />
      </PageSection>

      <PageSection title="Semantic" description="Each color shows its strong value and soft banners in both modes.">
        <div className="grid gap-3 sm:grid-cols-2">
          <SemanticCard name="success" color={tokens.colors.semantic.success} sampleText="Task completed" />
          <SemanticCard name="info"    color={tokens.colors.semantic.info}    sampleText="New update available" />
          <SemanticCard name="warning" color={tokens.colors.semantic.warning} sampleText="Expires in 14 days" />
          <SemanticCard name="error"   color={tokens.colors.semantic.error}   sampleText="Action failed — retry" />
        </div>
      </PageSection>

      <PageSection title="In-context preview" description="Tokens rendered in a real UI block in the active mode.">
        <InContextPreview />
      </PageSection>
    </>
  );
}
