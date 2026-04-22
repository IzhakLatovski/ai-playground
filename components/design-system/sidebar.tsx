// components/design-system/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Item = { href: string; label: string; disabled?: boolean };
type Group = { label: string; items: Item[] };

const groups: Group[] = [
  {
    label: 'Foundations',
    items: [
      { href: '/design-system/colors',      label: 'Colors' },
      { href: '/design-system/typography',  label: 'Typography' },
      { href: '/design-system/spacing',     label: 'Spacing' },
      { href: '/design-system/radius',      label: 'Radius' },
      { href: '/design-system/elevation',   label: 'Elevation' },
      { href: '/design-system/breakpoints', label: 'Breakpoints' },
    ],
  },
  {
    label: 'Components',
    items: [
      { href: '#', label: 'Buttons', disabled: true },
      { href: '#', label: 'Inputs',  disabled: true },
      { href: '#', label: 'Cards',   disabled: true },
      { href: '#', label: 'Badges',  disabled: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-border md:bg-card md:px-4 md:py-6">
        <Link href="/design-system/colors" className="mb-6 px-2 text-h3 font-semibold text-primary">
          DCR
        </Link>
        <nav className="flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <div className="px-2 text-xs text-muted-foreground">{group.label}</div>
              {group.items.map((item) => {
                const active = !item.disabled && pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.disabled ? '#' : item.href}
                    aria-disabled={item.disabled}
                    onClick={(e) => item.disabled && e.preventDefault()}
                    className={cn(
                      'rounded-md px-2 py-1.5 text-sm transition-colors',
                      active && 'bg-primary/10 text-primary font-medium',
                      !active && !item.disabled && 'text-foreground hover:bg-muted',
                      item.disabled && 'italic text-muted-foreground/60 cursor-not-allowed',
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile horizontal tab row */}
      <nav className="md:hidden overflow-x-auto border-b border-border bg-card">
        <div className="flex gap-2 px-4 py-3">
          {groups.flatMap((g) => g.items).map((item) => {
            const active = !item.disabled && pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.disabled ? '#' : item.href}
                aria-disabled={item.disabled}
                onClick={(e) => item.disabled && e.preventDefault()}
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-1 text-sm transition-colors',
                  active && 'bg-primary text-primary-foreground',
                  !active && !item.disabled && 'bg-muted text-foreground',
                  item.disabled && 'bg-muted italic text-muted-foreground/60',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
