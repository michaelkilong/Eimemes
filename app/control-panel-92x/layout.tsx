// app/control-panel-92x/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Eimemes Admin' },
  robots: 'noindex, nofollow',
};

// Note: auth guard is handled client-side in each page.
// For production, use Next.js middleware for server-side protection.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
