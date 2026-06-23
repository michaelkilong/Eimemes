import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Eimemes',
  description: 'How Eimemes collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-[#0f172a] py-16">
          <div className="container">
            <h1 className="font-display text-4xl font-bold text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-slate-400 font-mono text-sm">
              Last updated: {new Date().getFullYear()}-01-01
            </p>
          </div>
        </div>

        <div className="container py-12 max-w-3xl mx-auto">
          <div className="prose prose-slate max-w-none">
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">1. Information We Collect</h2>
              <p className="text-[#4b4540] leading-relaxed">
                We may collect personal information such as your name, email address, and browsing behaviour 
                when you voluntarily submit it or automatically through cookies.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">2. How We Use Information</h2>
              <ul className="list-disc pl-5 space-y-1 text-[#4b4540]">
                <li>To provide and improve our services.</li>
                <li>To communicate with you, including newsletters and updates.</li>
                <li>To personalise your experience on the site.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">3. Cookies</h2>
              <p className="text-[#4b4540] leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience. 
                You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">4. Third‑Party Services</h2>
              <p className="text-[#4b4540] leading-relaxed">
                We may use third‑party services (e.g., analytics, social media embeds) that collect 
                information independently. Please review their respective privacy policies.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">5. Data Security</h2>
              <p className="text-[#4b4540] leading-relaxed">
                We implement reasonable security measures to protect your data. However, no method of 
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">6. Your Rights</h2>
              <p className="text-[#4b4540] leading-relaxed">
                You may request access, correction, or deletion of your personal data at any time. 
                Contact us at{' '}
                <a href="mailto:eimemeschatai@gmail.com" className="text-[#d97706] hover:underline">
                  eimemeschatai@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
