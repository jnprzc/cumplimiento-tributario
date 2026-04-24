'use client';

import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="md:ml-60">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
