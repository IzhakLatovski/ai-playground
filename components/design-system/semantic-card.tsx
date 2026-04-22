// components/design-system/semantic-card.tsx
import type { SemanticName, Tokens } from '@/lib/tokens';

type Props = {
  name: SemanticName;
  color: Tokens['colors']['semantic'][SemanticName];
  sampleText: string;
};

export function SemanticCard({ name, color, sampleText }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div
        className="flex items-center justify-between px-3 py-2 font-semibold text-white"
        style={{ backgroundColor: color.strong.light }}
      >
        <span className="capitalize">{name}</span>
        <span className="font-mono text-xs opacity-90">{color.strong.light}</span>
      </div>
      <div className="grid grid-cols-2">
        <Banner label="Light" color={color} mode="light" text={sampleText} surface="#FFFFFF" />
        <Banner label="Dark"  color={color} mode="dark"  text={sampleText} surface="#09090B" />
      </div>
    </div>
  );
}

function Banner({
  label,
  color,
  mode,
  text,
  surface,
}: {
  label: string;
  color: Props['color'];
  mode: 'light' | 'dark';
  text: string;
  surface: string;
}) {
  return (
    <div className="p-3" style={{ backgroundColor: surface }}>
      <div className={mode === 'light' ? 'text-xs text-zinc-500 mb-2' : 'text-xs text-zinc-400 mb-2'}>
        {label}
      </div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs"
        style={{ backgroundColor: color.mutedBg[mode], color: color.mutedFg[mode] }}
      >
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color.strong[mode] }}
        />
        {text}
      </div>
    </div>
  );
}
