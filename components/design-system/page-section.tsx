// components/design-system/page-section.tsx
import type { ReactNode } from 'react';

export function PageSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-h2 mb-1">{title}</h2>
      {description && <p className="text-body text-muted-foreground mb-5">{description}</p>}
      {children}
    </section>
  );
}
