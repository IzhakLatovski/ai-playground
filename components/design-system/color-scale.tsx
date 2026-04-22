// components/design-system/color-scale.tsx
import { cn } from '@/lib/utils';

type ColorScaleProps = {
  tokenPrefix: string;       // e.g. "brand" or "zinc"
  scale: Record<string, string>;
  markers?: Record<string, string>; // e.g. { '600': '★', '400': '◐' }
};

export function ColorScale({ tokenPrefix, scale, markers = {} }: ColorScaleProps) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-border">
      {Object.entries(scale).map(([step, hex]) => {
        const isLight = parseInt(step) <= 400;
        return (
          <div
            key={step}
            className={cn(
              'flex min-h-24 flex-1 flex-col justify-end p-2 font-mono text-[10px] leading-tight',
              isLight ? 'text-foreground/80' : 'text-white/95',
            )}
            style={{ backgroundColor: hex }}
          >
            <div className="text-xs font-semibold">
              {step} {markers[step] && <span>{markers[step]}</span>}
            </div>
            <div>{hex.toUpperCase()}</div>
            <div className="opacity-70">{tokenPrefix}-{step}</div>
          </div>
        );
      })}
    </div>
  );
}
