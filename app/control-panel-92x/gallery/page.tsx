'use client';
// app/control-panel-92x/gallery/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search, Image as ImgIcon } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function GalleryAdminPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    imageUrl: '',
    category: 'General',
    status: 'published',
    order: 0,
    branch: '', // NEW
  });

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (!d.authenticated) router.push('/control-panel-92x'); });

    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/gallery', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setItems(d.items || []))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setFormData({ title: '', caption: '', imageUrl: '', category: 'General', status: 'published', order: 0, branch: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title || '',
      caption: item.caption || '',
      imageUrl: item.imageUrl || '',
      category: item.category || 'General',
      status: item.status || 'published',
      order: item.order || 0,
      branch: item.branch || '',
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(editingId ? 'Updated' : 'Created');
        resetForm();
        fetchItems();
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      toast.success('Deleted');
      fetchItems();
    } else {
      toast.error('Failed');
    }
  };

  const filtered = items.filter((item: any) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.caption?.toLowerCase().includes(search.toLowerCase()) ||
    item.branch?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Gallery</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{items.length} items</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full bg-[#13171f] border border-[#2a2f3d] rounded-sm pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d97706] font-mono"
                placeholder="Search title, caption, branch..." value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 font-mono text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 font-mono text-sm mb-4">No items yet</p>
              <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs">
                <Plus size={13} /> Add first item
              </button>
            </div>
          ) : (
            <div className="bg-[#13171f] border border-[#1e2433] rounded-sm overflow-hidden">
              <div className="divide-y divide-[#1e2433]">
                {filtered.map(item => (
                  <div key={item._id} className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0f172a] rounded-sm overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <ImgIcon size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.title || 'Untitled'}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1">
                        <span>{item.category}</span>
                        {item.branch && (
                          <span className="text-[#d97706]">Branch: {item.branch}</span>
                        )}
                        <span className={item.status === 'published' ? 'text-emerald-400' : 'text-yellow-400'}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-slate-500 hover:text-[#d97706] transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#13171f] border border-[#2a2f3d] rounded-sm w-full max-w-lg p-6">
              <h2 className="text-white font-display text-lg font-bold mb-4">
                {editingId ? 'Edit Item' : 'Add Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Title</label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0f172a] border border-[#2a2f3d] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d97706] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Caption</label>
                  <input
                    value={formData.caption}
                    onChange={e => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full bg-[#0f172a] border border-[#2a2f3d] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d97706] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Image URL</label>
                  <input
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-[#0f172a] border border-[#2a2f3d] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d97706] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                  <input
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#0f172a] border border-[#2a2f3d] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d97706] font-mono"
                  />
                </div>
                {/* NEW: Branch slug */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Branch slug <span className="text-slate-600">(e.g. mumbai-seniors)</span>
                  </label>
                  <input
                    value={formData.branch}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-[#0f172a] border border-[#2a2f3d] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d97706] font-mono"
                    placeholder="Leave empty for general gallery"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                      className="w-full bg-[#0f172a] border border-[#2a2f3d] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d97706] font-mono"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="w-full bg-[#0f172a] border border-[#2a2f3d] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d97706] font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary px-4 py-2 text-sm">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
