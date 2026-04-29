// app/not-found.tsx
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container py-24 text-center">
        <p className="font-mono text-[#d97706] text-sm uppercase tracking-widest mb-4">404</p>
        <h1 className="font-display text-5xl font-bold text-[#0f172a] mb-4">Page not found</h1>
        <p className="text-[#4b4540] mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary">← Back to homepage</Link>
      </main>
      <Footer />
    </>
  );
}
