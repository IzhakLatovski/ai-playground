// components/design-system/radius-swatch.tsx
export function RadiusSwatch({ token, value }: { token: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-16 w-16 bg-primary/20 border border-primary/40"
        style={{ borderRadius: value }}
      />
      <div className="text-center">
        <code className="font-mono text-sm text-foreground">{token}</code>
        <div className="font-mono text-xs text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}
