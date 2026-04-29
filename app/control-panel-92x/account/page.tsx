'use client';
// app/control-panel-92x/account/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (!d.authenticated) { router.push('/control-panel-92x'); return; }
        setUser(d.user);
      });
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm px-4 py-3 text-sm text-white
    placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] transition-all font-mono`;
  const labelClass = 'block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2';

  const PwToggle = ({ field }: { field: keyof typeof showPw }) => (
    <button type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
      onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}>
      {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">

        {/* Topbar */}
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4">
          <h1 className="text-white font-display text-xl font-bold">My Account</h1>
          <p className="text-slate-500 text-xs font-mono mt-0.5">Account settings and security</p>
        </div>

        <div className="p-8 max-w-2xl space-y-6">

          {/* Profile info card */}
          {user && (
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
                <User size={13} /> Profile
              </h2>
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-sm flex items-center justify-center font-display font-bold text-3xl flex-shrink-0 ${
                  user.role === 'superadmin' ? 'bg-[#d97706]/20 text-[#d97706]' : 'bg-blue-500/15 text-blue-400'
                }`}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{user.name}</p>
                  <p className="text-slate-400 font-mono text-sm">{user.email}</p>
                  <span className={`inline-flex items-center gap-1.5 mt-2 text-[10px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-sm border font-bold ${
                    user.role === 'superadmin'
                      ? 'bg-[#d97706]/15 text-[#d97706] border-[#d97706]/25'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    <Shield size={10} />
                    {user.role === 'superadmin' ? 'Super Admin' : 'Writer'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Change password */}
          <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
              <Lock size={13} /> Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className={labelClass}>Current Password</label>
                <div className="relative">
                  <input
                    type={showPw.current ? 'text' : 'password'}
                    className={`${inputClass} pr-12`}
                    placeholder="Enter current password"
                    required
                    value={form.currentPassword}
                    onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  />
                  <PwToggle field="current" />
                </div>
              </div>

              <div>
                <label className={labelClass}>New Password</label>
                <div className="relative">
                  <input
                    type={showPw.new ? 'text' : 'password'}
                    className={`${inputClass} pr-12`}
                    placeholder="Min. 8 characters"
                    required
                    value={form.newPassword}
                    onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  />
                  <PwToggle field="new" />
                </div>
                {/* Strength indicator */}
                {form.newPassword && (
                  <div className="mt-2 flex gap-1">
                    {[8, 12, 16].map((len, i) => (
                      <div key={len} className={`h-1 flex-1 rounded-full transition-colors ${
                        form.newPassword.length >= len
                          ? ['bg-red-500', 'bg-yellow-500', 'bg-emerald-500'][i]
                          : 'bg-[#2a2f3d]'
                      }`} />
                    ))}
                    <span className="text-[10px] font-mono text-slate-500 ml-2">
                      {form.newPassword.length < 8 ? 'Too short' :
                       form.newPassword.length < 12 ? 'Weak' :
                       form.newPassword.length < 16 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPw.confirm ? 'text' : 'password'}
                    className={`${inputClass} pr-12 ${
                      form.confirmPassword && form.newPassword !== form.confirmPassword
                        ? 'border-red-500/50'
                        : form.confirmPassword && form.newPassword === form.confirmPassword
                        ? 'border-emerald-500/50'
                        : ''
                    }`}
                    placeholder="Repeat new password"
                    required
                    value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  />
                  <PwToggle field="confirm" />
                </div>
                {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                  <p className="text-red-400 text-xs font-mono mt-1">Passwords don't match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving || (!!form.confirmPassword && form.newPassword !== form.confirmPassword)}
                className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Security tips */}
          <div className="bg-[#0d0f14] border border-[#1e2433] rounded-sm p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-3">Security Tips</p>
            <ul className="space-y-1.5 text-xs text-slate-600 font-mono">
              <li>→ Use a unique password not used on other sites</li>
              <li>→ Mix uppercase, lowercase, numbers and symbols</li>
              <li>→ Aim for at least 16 characters</li>
              <li>→ Never share your admin credentials</li>
              <li>→ Change your password every 90 days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
