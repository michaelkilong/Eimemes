// app/about/page.tsx
import { Metadata } from 'next';
import { Mail, Twitter, MapPin, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'About Eimemes',
  description: 'Independent digital publication owned by Eimeme Pvt Ltd, Mumbai.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div className="bg-[#0f172a] py-20 text-center">
          <div className="container">
            <p className="font-mono text-xs text-[#d97706] uppercase tracking-widest mb-4">Who we are</p>
            <h1 className="font-display text-5xl font-bold text-white mb-5">About Eimemes</h1>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              "EIMEMES - bringing all Eimi Youths closer"
              <br />
              Eimi te adim, Eimemes a um e!
            </p>
          </div>
        </div>

        <div className="container py-16 max-w-4xl">
          {/* Mission */}
          <div className="bg-white border border-[#e5e0d8] rounded-sm p-8 md:p-12 mb-8 animate-fade-up">
            <h2 className="font-display text-3xl font-bold text-[#0f172a] mb-6">Our Mission</h2>
            <p className="text-[#2d2926] leading-relaxed mb-5 text-lg">
              <strong>Eimemes</strong> is a digital platform built for and by Eimi youths. Founded in 2025 and wholly owned by{' '}
              <strong>Eimeme Pvt Ltd</strong>, we exist to entertain, uplift, and connect a generation that deserves its own space on the internet.
            </p>
            <p className="text-[#4b4540] leading-relaxed mb-5">
              From memes that hit too close to home to content that genuinely guides and inspires, we cover what matters to young Eimi people — with humour, heart, and zero filter.
            </p>
            <p className="text-[#4b4540] leading-relaxed">
              Every piece of content we put out is guided by one question: does this actually speak to our community? We believe great content doesn't need a big budget — it just needs to be real, relatable, and made with genuine love for the people it serves.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: 'Entertainment',
                body: 'Memes so good, your screen time report will need therapy. We curate the internet\'s finest nonsense so you don\'t have to. No clickbait, no cringe — just pure, unfiltered content that hits different every single time. Your feed will never be the same again.',
              },
              {
                title: 'Positivity — Guiding Youths Forward',
                body: 'We are committed to empowering the next generation with content that inspires, motivates, and builds character. From success stories to mental wellness, we champion young voices and help shape a brighter future.',
              },
              {
                title: 'Technology — Stay Ahead of the Curve',
                body: `From AI breakthroughs to the latest gadgets, we make trending technology easy to understand. Our mission is to keep you informed, aware, and ready for a world that's changing faster than ever.`,
              },
            ].map(({ title, body }, i) => (
              <div
                key={title}
                className="bg-[#fef9e6] border border-[#e5e0d8] rounded-sm p-6 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-1 h-8 bg-[#d97706] mb-4 rounded-full" />
                <h3 className="font-display text-lg font-bold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-sm text-[#4b4540] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="bg-[#0f172a] rounded-sm p-8 text-white animate-fade-up">
            <h2 className="font-display text-2xl font-bold mb-6">Get in touch</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { icon: <Mail size={16} />, label: 'eimemeschatai@gmail.com', href: 'mailto:eimemeschatai@gmail.com' },
                { icon: <Twitter size={16} />, label: '@eimemes', href: 'https://twitter.com/eimemes' },
                { icon: <Phone size={16} />, label: 'unavailable', href: 'tel:+912212345678' },
                { icon: <MapPin size={16} />, label: 'London, UK', href: null },
              ].map(({ icon, label, href }) => (
                <div key={label} className="flex items-center gap-3 text-slate-300">
                  <span className="text-[#d97706]">{icon}</span>
                  {href ? (
                    <a href={href} className="hover:text-[#d97706] transition-colors">{label}</a>
                  ) : (
                    <span>{label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
