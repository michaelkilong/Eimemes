'use client';
// app/control-panel-92x/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      toast.success(`Welcome back, ${data.user.name}!`);
      window.location.href = '/control-panel-92x/dashboard';
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm px-4 py-3 text-sm text-white
    placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]
    transition-all font-mono`;

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#d97706] rounded-sm flex items-center justify-center">
              <Lock size={18} className="text-white" />
            </div>
            <span className="font-display text-white text-2xl font-bold">Eimemes CMS</span>
          </div>
          <p className="text-slate-500 text-sm font-mono">Admin access only</p>
        </div>

        <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-8">
          <h1 className="text-white font-display text-xl font-bold mb-6">Sign in</h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Email</label>
              <input
                type="email" required
                className={inputClass}
                placeholder="admin@eimemes.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required
                  className={`${inputClass} pr-12`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-semibold py-3 rounded-sm
                         font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> Authenticating...</>
              ) : 'Sign in →'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-700 text-xs font-mono mt-6">
          Eimeme Pvt Ltd · Restricted access
        </p>
      </div>
    </div>
  );
}
