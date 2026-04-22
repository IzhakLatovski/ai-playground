// components/design-system/spacing-row.tsx
export function SpacingRow({ token, value }: { token: string; value: string }) {
  return (
    <div className="grid grid-cols-[100px_80px_1fr] items-center gap-4 py-2">
      <code className="font-mono text-sm text-foreground">{token}</code>
      <div className="font-mono text-sm text-muted-foreground">{value}</div>
      <div className="h-3 rounded bg-primary" style={{ width: value }} />
    </div>
  );
}
