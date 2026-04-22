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
            )}
            style={{
              backgroundColor: hex,
              // Labels must stay legible regardless of theme mode — pick dark
              // text for light swatches and white text for dark swatches using
              // the swatch's own lightness, not the ambient theme.
              color: isLight ? 'rgba(9,9,11,0.8)' : 'rgba(255,255,255,0.95)',
            }}
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
