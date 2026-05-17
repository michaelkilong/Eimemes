'use client';
// app/control-panel-92x/kuki-fc/shop/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, ToggleRight, ToggleLeft } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function ShopAdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.json())
      .then(d => { if (!d.authenticated) router.push('/control-panel-92x'); });
    fetch('/api/kuki-fc/products', { credentials: 'include' })
      .then(r => r.json()).then(d => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/kuki-fc/products/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { toast.success('Deleted'); setProducts(p => p.filter(pr => pr._id !== id)); }
    else toast.error('Failed');
  };

  const toggleStock = async (product: any) => {
    const res = await fetch(`/api/kuki-fc/products/${product._id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !product.inStock }),
    });
    if (res.ok) setProducts(p => p.map(pr => pr._id === product._id ? { ...pr, inStock: !pr.inStock } : pr));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">Shop</h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{products.length} products</p>
          </div>
          <Link href="/control-panel-92x/kuki-fc/shop/new" className="btn-primary text-xs py-2 px-4">
            <Plus size={14} /> Add Product
          </Link>
        </div>

        <div className="p-6">
          <div className="bg-[#13171f] border border-[#1e2433] rounded-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-mono text-sm">Loading...</div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-500 font-mono text-sm mb-4">No products yet</p>
                <Link href="/control-panel-92x/kuki-fc/shop/new" className="btn-primary text-xs">
                  <Plus size={13} /> Add first product
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#1e2433]">
                {products.map(product => (
                  <div key={product._id} className="p-4 flex items-center gap-4">
                    {product.images?.[0] && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={product.images[0]} alt="" className="w-12 h-12 object-cover rounded-sm flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-white text-sm font-medium">{product.name}</span>
                        <span className="text-[#d97706] font-mono text-xs font-bold">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.featured && (
                          <span className="text-[10px] font-mono bg-[#d97706]/15 text-[#d97706] px-1.5 py-0.5 rounded-sm">Featured</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                        <span>{product.category}</span>
                        <span className={product.inStock ? 'text-emerald-400' : 'text-red-400'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.sizes?.length > 0 && <span>{product.sizes.join(', ')}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleStock(product)}
                        className={`p-2 transition-colors ${product.inStock ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {product.inStock ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <a href={`/kuki-fc/shop/${product.slug}`} target="_blank"
                        className="p-2 text-slate-500 hover:text-white transition-colors"><Eye size={14} /></a>
                      <Link href={`/control-panel-92x/kuki-fc/shop/${product._id}`}
                        className="p-2 text-slate-500 hover:text-[#d97706] transition-colors"><Edit2 size={14} /></Link>
                      <button onClick={() => handleDelete(product._id, product.name)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
            
