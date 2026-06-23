import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Eimemes',
  description:
    'How Eimemes handles your information when you visit our website.',
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
              Last updated: 1 January {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <div className="container py-12 max-w-3xl mx-auto">
          <div className="prose prose-slate max-w-none space-y-10">
            <p className="text-[#4b4540] leading-relaxed">
              Thank you for visiting Eimemes (“we”, “us”, “our”). We are committed to
              protecting your personal information and your right to privacy. If you have
              any questions, please write to us at{' '}
              <a
                href="mailto:eimemeschatai@gmail.com"
                className="text-[#d97706] hover:underline"
              >
                eimemeschatai@gmail.com
              </a>
              .
            </p>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                1. Information Collected Automatically
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                When you visit our website, our web server automatically logs certain
                technical details that your browser sends. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#4b4540]">
                <li>Browser type and version (e.g. Chrome, Firefox)</li>
                <li>Operating system (e.g. Windows, Android, iOS)</li>
                <li>Your IP address</li>
                <li>Pages you view and the date/time of your visit</li>
              </ul>
              <p className="text-[#4b4540] leading-relaxed mt-2">
                This is standard practice for almost every website and helps us keep the
                site secure and running smoothly. This information does not identify you
                personally.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                2. Information You Provide Voluntarily
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                We only collect personal information when you choose to give it. For
                example:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#4b4540]">
                <li>Your name and email address when you leave a comment on an article</li>
                <li>Any details you share when you email us (e.g. about merchandise)</li>
              </ul>
              <p className="text-[#4b4540] leading-relaxed mt-2">
                We use this to display your comment and to respond to your messages.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                3. Cookies
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                We only use essential cookies that are necessary for the website to work.
                These cookies may remember your name and email address so you don’t have
                to re‑enter them when you write another comment. We do not use advertising
                or analytics cookies.
              </p>
              <p className="text-[#4b4540] leading-relaxed">
                You can disable cookies in your browser settings. If you do, the comment
                form will still work, but it may not remember your details.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                4. Third‑Party Links
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                Our website may contain links to other sites. We are not responsible for
                their privacy practices, and we encourage you to read their policies.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                5. Data Security and Retention
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                We take reasonable security measures to protect your information, as
                required under Indian law. No method of online transmission is completely
                secure. We keep comment data for as long as the relevant article exists, or
                until you ask us to remove it.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                6. Your Rights
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                You can request to access, correct, or delete your personal data at any
                time. To do so, or if you have any privacy‑related complaint, please
                contact our Grievance Officer (details below). We will respond within a
                reasonable time, not exceeding 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-[#0f172a] mb-4">
                7. Grievance Redressal
              </h2>
              <p className="text-[#4b4540] leading-relaxed">
                In accordance with the Information Technology Act, 2000, any complaints
                regarding your personal information should be sent to:
              </p>
              <p className="text-[#4b4540] leading-relaxed mt-2 font-mono text-sm">
                <strong>Name:</strong> [Grievance Officer Name]<br />
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:eimemeschatai@gmail.com"
                  className="text-[#d97706] hover:underline"
                >
                  eimemeschatai@gmail.com
                </a>
                <br />
                <strong>Address:</strong> [Insert your office address]
              </p>
            </section>

            <p className="text-[#4b4540] leading-relaxed italic border-l-4 border-[#d97706] pl-4">
              This privacy policy may be updated occasionally. Please check this page for
              the latest version.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
