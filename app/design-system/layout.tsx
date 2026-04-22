// app/design-system/layout.tsx
import { Sidebar } from '@/components/design-system/sidebar';
import { ModeToggle } from '@/components/design-system/mode-toggle';

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3 md:px-10">
          <span className="text-h4">Design System</span>
          <ModeToggle />
        </header>
        <main className="flex-1 px-6 py-10 md:px-10 max-w-screen-xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
