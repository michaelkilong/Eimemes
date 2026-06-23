import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — Eimemes',
  description:
    'Terms and conditions for using the Eimemes website.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-[#0f172a] py-16">
          <div className="container">
            <h1 className="font-display text-4xl font-bold text-white mb-2">
              Terms of Service
            </h1>
            <p className="text-slate-400 font-mono text-sm">
              Effective from: 1 January {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <div className="container py-12 max-w-3xl mx-auto">
          <div className="prose prose-slate max-w-none space-y-10">
            <p className="text-[#4b4540] leading-relaxed">
              Welcome to Eimemes. By using this website, you agree to these Terms of
              Service. If you do not agree, please stop using the site. These Terms are
              governed by Indian law, and any disputes will be subject to the courts in
              Kangpokpi, India.
            </p>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                1. Using the Site
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                You may use this site only for lawful purposes. You must not post or
                share content that is defamatory, obscene, hateful, or otherwise illegal
                under Indian law. We reserve the right to remove any such content without
                prior notice.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                2. Comments
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                By posting a comment, you grant us permission to display it publicly on
                the site. You confirm that your comment does not violate anyone else’s
                rights. The views expressed in comments belong to the individual
                commenter, not to Eimemes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                3. Shop &amp; Merchandise
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                Our shop section displays products for informational purposes only. We do
                not accept online payments on this website. To purchase an item, you need
                to contact us directly. All product information and prices may change
                without notice.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                4. Intellectual Property
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                All articles, images, logos, and other content on this site are owned by
                or licensed to Eimemes. You may share small excerpts with proper credit
                and a link back, but you may not reproduce full articles without our
                permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                5. Limitation of Liability
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                We provide the website “as is”. We try to keep the content accurate, but
                we give no guarantees. Eimemes will not be liable for any loss or damage
                arising from your use of the site, to the fullest extent allowed by law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                6. Changes to These Terms
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                We may update these Terms from time to time. Changes will be posted on
                this page. By continuing to use the site after changes are posted, you
                accept the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                7. Contact
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                For any questions about these Terms, you can email us at{' '}
                <a
                  href="mailto:eimemeschatai@gmail.com"
                  className="text-[#d97706] hover:underline"
                >
                  eimemeschatai@gmail.com
                </a>
                .
              </p>
              <p className="text-[#4b4540] leading-relaxed">
                For privacy‑related complaints, please refer to the Grievance Officer
                details in our Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
