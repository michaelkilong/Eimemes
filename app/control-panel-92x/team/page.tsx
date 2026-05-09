'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Plus, Trash2, Shield, PenLine, ToggleLeft, ToggleRight,
  X, Eye, EyeOff, Mail, Calendar,
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminMember {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'writer';
  bio: string;
  active: boolean;
  lastLogin: string | null;
  createdAt: string;
}

const EMPTY_FORM = {
  name: '', email: '', password: '', role: 'writer' as 'superadmin' | 'writer', bio: '',
};

const formatDate = (dateStr: any) => {
  try {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch {
    return 'Unknown';
  }
};

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers]     = useState<AdminMember[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [showPw, setShowPw]       = useState(false);
  const [saving, setSaving]       = useState(false);
  const [selfEmail, setSelfEmail] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const authRes = await fetch('/api/auth', { credentials: 'include' });
      if (!authRes.ok) { router.push('/control-panel-92x'); return; }
      const authData = await authRes.json();
      if (authData.user?.role !== 'superadmin') {
        router.push('/control-panel-92x/dashboard');
        return;
      }
      setSelfEmail(authData.user.email);

      const res = await fetch('/api/admins', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load team');
      const data = await res.json();
      setMembers(data.admins || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email and password are required');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      toast.success(`${form.name} added to the team!`);
      setShowForm(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (member: AdminMember) => {
    if (member.email === selfEmail) {
      toast.error("You can't deactivate yourself");
      return;
    }
    try {
      const res = await fetch(`/api/admins/${member._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !member.active }),
      });
      if (!res.ok) throw new Error('Update failed');
      setMembers(prev =>
        prev.map(m => m._id === member._id ? { ...m, active: !m.active } : m)
      );
      toast.success(member.active ? `${member.name} deactivated` : `${member.name} reactivated`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (member: AdminMember) => {
    if (member.email === selfEmail) {
      toast.error("You can't delete your own account");
      return;
    }
    if (!confirm(`Remove ${member.name} from the team?`)) return;
    try {
      const res = await fetch(`/api/admins/${member._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success(`${member.name} removed`);
      setMembers(prev => prev.filter(m => m._id !== member._id));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const inputClass = `w-full bg-[#0d0f14] border border-[#2a2f3d] rounded-sm px-4 py-2.5 text-sm text-white
    placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] transition-all font-mono`;
  const labelClass = 'block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5';

  const superAdmins = members.filter(m => m.role === 'superadmin');
  const writers     = members.filter(m => m.role === 'writer');

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">

        {/* Topbar */}
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Team</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{members.length} members</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> Add Member
          </button>
        </div>

        <div className="p-8 max-w-4xl">

          {/* Add Member Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-6">
              <div className="bg-[#13171f] border border-[#1e2433] rounded-sm p-7 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-display text-lg font-bold">Add Team Member</h2>
                  <button
                    onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                    className="text-slate-500 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input className={inputClass} placeholder="Priya Sharma"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Role *</label>
                      <select className={inputClass} value={form.role}
                        onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))}>
                        <option value="writer">Writer</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" className={inputClass} placeholder="priya@eimemes.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>

                  <div>
                    <label className={labelClass}>Password * (min 8 chars)</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'}
                        className={`${inputClass} pr-12`}
                        placeholder="They can change this later"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Bio (optional)</label>
                    <textarea className={`${inputClass} resize-none`} rows={2}
                      placeholder="Sports journalist covering Maharashtra football..."
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                  </div>

                  <div className={`rounded-sm border p-3 text-xs font-mono ${
                    form.role === 'superadmin'
                      ? 'border-amber-500/30 bg-amber-500/5 text-amber-400'
                      : 'border-[#2a2f3d] text-slate-500'
                  }`}>
                    {form.role === 'superadmin'
                      ? '⚠ Super Admin — full access including team management'
                      : 'Writer — can create and publish articles and blog posts only'}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                      className="btn-ghost border-[#2a2f3d] text-slate-400 text-sm py-2.5 flex-1">
                      Cancel
                    </button>
                    <button onClick={handleCreate} disabled={saving}
                      className="btn-primary text-sm py-2.5 flex-1 justify-center disabled:opacity-50">
                      {saving ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-sm" />
              ))}
            </div>
          ) : (
            <>
              {/* Super Admins */}
              <div className="mb-8">
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                  <Shield size={13} className="text-[#d97706]" />
                  Super Admins ({superAdmins.length})
                </h2>
                <div className="space-y-3">
                  {superAdmins.map(member => (
                    <div key={member._id}
                      className={`bg-[#13171f] border rounded-sm p-5 flex items-center gap-5 ${
                        !member.active ? 'border-[#1e2433] opacity-60' : 'border-[#1e2433]'
                      }`}>
                      <div className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0 font-display font-bold text-xl bg-[#d97706]/20 text-[#d97706]">
                        {member.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-white font-medium text-sm">{member.name}</span>
                          {member.email === selfEmail && (
                            <span className="text-[10px] font-mono bg-slate-700/40 text-slate-400 px-1.5 py-0.5 rounded-sm">You</span>
                          )}
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border font-bold bg-[#d97706]/15 text-[#d97706] border-[#d97706]/25">
                            ⚡ Super Admin
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono flex-wrap">
                          <span className="flex items-center gap-1"><Mail size={10} /> {member.email}</span>
                          {member.createdAt && (
                            <span className="flex items-center gap-1">
                              <Calendar size={10} /> Joined {formatDate(member.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      {member.email !== selfEmail && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => toggleActive(member)}
                            className={`p-2 rounded-sm transition-colors ${
                              member.active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-600 hover:text-slate-400'
                            }`}>
                            {member.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </button>
                          <button onClick={() => handleDelete(member)}
                            className="p-2 rounded-sm text-slate-600 hover:text-red-400 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Writers */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                  <PenLine size={13} className="text-blue-400" />
                  Writers ({writers.length})
                </h2>
                {writers.length === 0 ? (
                  <div className="bg-[#13171f] border border-dashed border-[#2a2f3d] rounded-sm p-10 text-center">
                    <PenLine size={32} className="text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 font-mono text-sm mb-4">No writers yet</p>
                    <button onClick={() => setShowForm(true)} className="btn-primary text-xs">
                      <Plus size={13} /> Add your first writer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {writers.map(member => (
                      <div key={member._id}
                        className={`bg-[#13171f] border rounded-sm p-5 flex items-center gap-5 ${
                          !member.active ? 'border-[#1e2433] opacity-60' : 'border-[#1e2433]'
                        }`}>
                        <div className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0 font-display font-bold text-xl bg-blue-500/15 text-blue-400">
                          {member.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-white font-medium text-sm">{member.name}</span>
                            {!member.active && (
                              <span className="text-[10px] font-mono bg-red-500/15 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-sm">
                                Deactivated
                              </span>
                            )}
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border font-bold bg-blue-500/10 text-blue-400 border-blue-500/20">
                              ✍ Writer
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono flex-wrap">
                            <span className="flex items-center gap-1"><Mail size={10} /> {member.email}</span>
                            {member.createdAt && (
                              <span className="flex items-center gap-1">
                                <Calendar size={10} /> Joined {formatDate(member.createdAt)}
                              </span>
                            )}
                            {member.bio && <span className="truncate max-w-xs text-slate-600">{member.bio}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => toggleActive(member)}
                            className={`p-2 rounded-sm transition-colors ${
                              member.active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-600 hover:text-slate-400'
                            }`}>
                            {member.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </button>
                          <button onClick={() => handleDelete(member)}
                            className="p-2 rounded-sm text-slate-600 hover:text-red-400 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Permissions table */}
              <div className="mt-10 bg-[#13171f] border border-[#1e2433] rounded-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-[#1e2433]">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500">Permissions</h3>
                </div>
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1e2433]">
                      <th className="text-left px-5 py-3 text-slate-600">Action</th>
                      <th className="px-5 py-3 text-[#d97706]">Super Admin</th>
                      <th className="px-5 py-3 text-blue-400">Writer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2433]">
                    {[
                      ['Create articles & blogs', true,  true],
                      ['Edit any content',        true,  true],
                      ['Publish / Unpublish',     true,  true],
                      ['Delete content',          true,  false],
                      ['Feature articles',        true,  false],
                      ['Manage gallery',          true,  false],
                      ['View messages inbox',     true,  false],
                      ['Manage team members',     true,  false],
                      ['Change own password',     true,  true],
                    ].map(([action, sa, writer]) => (
                      <tr key={String(action)} className="hover:bg-[#1a1f2b]">
                        <td className="px-5 py-3 text-slate-400">{String(action)}</td>
                        <td className="px-5 py-3 text-center">{sa ? '✅' : '—'}</td>
                        <td className="px-5 py-3 text-center">{writer ? '✅' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
