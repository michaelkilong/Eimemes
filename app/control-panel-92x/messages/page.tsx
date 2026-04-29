'use client';
// app/control-panel-92x/messages/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, MailOpen, ChevronDown, ChevronUp } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  _id: string; name: string; email: string;
  subject: string; message: string; read: boolean; createdAt: string;
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterUnread, setFilterUnread] = useState(false);

  const load = async () => {
    setLoading(true);
    const params = filterUnread ? '?read=false' : '';
    const res = await fetch(`/api/contact${params}`, { credentials: 'include' });
    if (!res.ok) { router.push('/control-panel-92x'); return; }
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterUnread]);

  const markRead = async (id: string) => {
    await fetch('/api/contact', {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
  };

  const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
    const msg = messages.find(m => m._id === id);
    if (msg && !msg.read) markRead(id);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="border-b border-[#1e2433] bg-[#13171f] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-display text-xl font-bold">
              Messages
              {unreadCount > 0 && (
                <span className="ml-3 bg-[#d97706] text-white text-xs font-mono px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-xs font-mono mt-0.5">{messages.length} total</p>
          </div>
          <button
            onClick={() => setFilterUnread(!filterUnread)}
            className={`text-xs font-mono px-4 py-2 rounded-sm border transition-all ${
              filterUnread ? 'bg-[#d97706] text-white border-[#d97706]' : 'border-[#2a2f3d] text-slate-400 hover:border-[#d97706]'
            }`}
          >
            {filterUnread ? 'All messages' : 'Unread only'}
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-sm" />)}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <Mail size={40} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-mono text-sm">
                {filterUnread ? 'No unread messages' : 'No messages yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className={`bg-[#13171f] border rounded-sm overflow-hidden transition-colors ${
                    msg.read ? 'border-[#1e2433]' : 'border-[#d97706]/30 bg-[#d97706]/5'
                  }`}
                >
                  {/* Header row */}
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#1a1f2b] transition-colors"
                    onClick={() => handleExpand(msg._id)}
                  >
                    <div className="flex-shrink-0">
                      {msg.read
                        ? <MailOpen size={16} className="text-slate-600" />
                        : <Mail size={16} className="text-[#d97706]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium truncate ${msg.read ? 'text-slate-300' : 'text-white'}`}>{msg.name}</span>
                        <span className="text-xs text-slate-500 font-mono truncate">{msg.email}</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className={`text-sm truncate ${msg.read ? 'text-slate-400' : 'text-slate-200'}`}>{msg.subject}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <span className="text-xs text-slate-600 font-mono hidden sm:block">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                      {expanded === msg._id ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                    </div>
                  </button>

                  {/* Expanded message body */}
                  {expanded === msg._id && (
                    <div className="px-5 pb-5 border-t border-[#1e2433]">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mb-4 text-xs font-mono">
                        <div>
                          <span className="text-slate-500 uppercase tracking-widest block mb-1">From</span>
                          <span className="text-slate-200">{msg.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase tracking-widest block mb-1">Email</span>
                          <a href={`mailto:${msg.email}`} className="text-[#d97706] hover:text-amber-400">{msg.email}</a>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase tracking-widest block mb-1">Received</span>
                          <span className="text-slate-200">
                            {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="bg-[#0d0f14] border border-[#1e2433] rounded-sm p-4">
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="btn-primary text-xs py-2 px-4"
                        >
                          Reply via email
                        </a>
                        {!msg.read && (
                          <button onClick={() => markRead(msg._id)} className="btn-ghost border-[#2a2f3d] text-slate-400 text-xs py-2 px-4">
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
