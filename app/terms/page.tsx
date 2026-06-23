import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — Eimemes',
  description: 'Terms and conditions for using Eimemes services.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="bg-[#0f172a] py-16">
          <div className="container">
            <h1 className="font-display text-4xl font-bold text-white mb-2">
              Terms of Service
            </h1>
            <p className="text-slate-400 font-mono text-sm">
              Effective date: {new Date().getFullYear()}-01-01
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12 max-w-3xl mx-auto">
          <div className="prose prose-slate max-w-none">
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">1. Acceptance of Terms</h2>
              <p className="text-[#4b4540] leading-relaxed">
                By accessing or using Eimemes (“the Service”), you agree to be bound by these Terms. 
                If you do not agree, please do not use our website or services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">2. Changes to Terms</h2>
              <p className="text-[#4b4540] leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately 
                upon posting. Continued use of the Service constitutes acceptance of the revised terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1 text-[#4b4540]">
                <li>You must provide accurate information when interacting with the Service.</li>
                <li>You may not use the Service for any unlawful or prohibited activities.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">4. Intellectual Property</h2>
              <p className="text-[#4b4540] leading-relaxed">
                All content, trademarks, and intellectual property on this site are owned by Eimemes 
                unless otherwise stated. You may not reproduce or distribute any content without our written consent.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">5. Limitation of Liability</h2>
              <p className="text-[#4b4540] leading-relaxed">
                Eimemes shall not be liable for any indirect, incidental, or consequential damages arising 
                out of your use of the Service. We provide the Service “as is” without warranties of any kind.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">6. Contact Us</h2>
              <p className="text-[#4b4540] leading-relaxed">
                If you have questions about these Terms, please contact us at{' '}
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
