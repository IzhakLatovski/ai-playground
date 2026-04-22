// components/design-system/type-row.tsx
import type { TypographyRole, Tokens } from '@/lib/tokens';

type Props = {
  role: TypographyRole;
  meta: Tokens['typography']['scale'][TypographyRole];
  sample: string;
  mono?: boolean;
};

export function TypeRow({ role, meta, sample, mono }: Props) {
  return (
    <div className="grid grid-cols-[150px_1fr] items-baseline gap-5 border-b border-border py-4 last:border-b-0">
      <div className="font-mono text-xs text-muted-foreground leading-snug">
        <div className="text-foreground font-medium">{role}</div>
        <div>{meta.fontSize} / {meta.fontWeight}</div>
        <div>lh {meta.lineHeight} · ls {meta.letterSpacing}</div>
      </div>
      <div className={mono ? 'font-mono text-foreground' : 'text-foreground'} style={{
        fontSize: meta.fontSize,
        fontWeight: meta.fontWeight,
        lineHeight: meta.lineHeight,
        letterSpacing: meta.letterSpacing,
        textTransform: role === 'xs' ? 'uppercase' : undefined,
      }}>
        {sample}
      </div>
    </div>
  );
}
