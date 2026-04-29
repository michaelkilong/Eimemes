'use client';
// app/contact/page.tsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      toast.success('Message sent! We\'ll respond shortly.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const inputClass = 'w-full border border-[#e5e0d8] rounded-sm px-4 py-3 text-sm font-body text-[#0f172a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] bg-white transition-all';

  return (
    <>
      <Header />
      <main>
        <div className="bg-[#0f172a] py-20 text-center">
          <div className="container">
            <p className="font-mono text-xs text-[#d97706] uppercase tracking-widest mb-4">Reach out</p>
            <h1 className="font-display text-5xl font-bold text-white mb-4">Contact Eimemes</h1>
            <p className="text-slate-400 max-w-md mx-auto">
              For press inquiries, advertising, story tips, or general feedback.
            </p>
          </div>
        </div>

        <div className="container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Contact info */}
            <div className="lg:col-span-1">
              <h2 className="font-display text-xl font-bold text-[#0f172a] mb-6">Contact info</h2>
              <div className="space-y-5">
                {[
                  { icon: <Mail size={18} />, title: 'Email', body: 'editorial@eimemes.com', href: 'mailto:editorial@eimemes.com' },
                  { icon: <Phone size={18} />, title: 'Phone', body: '+91 22 1234 5678', href: 'tel:+912212345678' },
                  { icon: <MapPin size={18} />, title: 'Address', body: 'Eimeme Pvt Ltd\nAndheri East, Mumbai 400069', href: null },
                ].map(({ icon, title, body, href }) => (
                  <div key={title} className="flex gap-4">
                    <div className="mt-0.5 text-[#d97706] flex-shrink-0">{icon}</div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-[#6b7280] mb-1">{title}</p>
                      {href ? (
                        <a href={href} className="text-sm text-[#0f172a] hover:text-[#d97706] transition-colors whitespace-pre-line">{body}</a>
                      ) : (
                        <p className="text-sm text-[#0f172a] whitespace-pre-line">{body}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-[#fef9e6] border border-[#e5e0d8] rounded-sm">
                <p className="text-xs font-mono uppercase tracking-wider text-[#6b7280] mb-2">Response time</p>
                <p className="text-sm text-[#4b4540]">We typically respond to all inquiries within 2 business days.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#e5e0d8] rounded-sm p-8 animate-fade-up">
                <h2 className="font-display text-xl font-bold text-[#0f172a] mb-6">Send a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#6b7280] mb-1.5">Full name *</label>
                      <input className={inputClass} placeholder="Rohan Mehta" required {...field('name')} />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#6b7280] mb-1.5">Email address *</label>
                      <input type="email" className={inputClass} placeholder="rohan@example.com" required {...field('email')} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#6b7280] mb-1.5">Subject</label>
                    <input className={inputClass} placeholder="Press inquiry / Story tip / Feedback..." {...field('subject')} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#6b7280] mb-1.5">Message *</label>
                    <textarea
                      className={`${inputClass} resize-none`}
                      rows={6}
                      placeholder="Tell us what's on your mind..."
                      required
                      {...field('message')}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> Sending...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Send size={15} /> Send message</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
