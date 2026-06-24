'use client';
import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if no prior choice is stored
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] bg-[#0f172a] border-t border-white/10 text-white p-4 md:p-6">
      <div className="container max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-slate-300 leading-relaxed">
          We use cookies to improve your experience and analyse site traffic. By clicking
          “Accept”, you consent to our use of cookies and similar technologies. Read our{' '}
          <a href="/privacy" className="text-[#d97706] hover:underline">
            Privacy Policy
          </a>{' '}
          for more details.
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm font-medium border border-slate-500 text-slate-300 rounded-sm hover:bg-slate-800 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-medium bg-[#d97706] text-white rounded-sm hover:bg-[#b45309] transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
