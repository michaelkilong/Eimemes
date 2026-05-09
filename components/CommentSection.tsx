'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageCircle, Send, Clock } from 'lucide-react';

interface Comment {
  _id: string;
  name: string;
  comment: string;
  createdAt: string;
}

interface Props {
  postId: string;
  postType: 'article' | 'blog';
  postSlug: string;
  postTitle: string;
}

const timeAgo = (dateStr: string) => {
  try {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return 'just now';
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch { return ''; }
};

export default function CommentSection({ postId, postType, postSlug, postTitle }: Props) {
  const [comments, setComments]     = useState<Comment[]>([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', comment: '' });

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then(r => r.json())
      .then(d => setComments(d.comments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.comment) {
      toast.error('All fields are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, postId, postType, postSlug, postTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post');
      setComments(prev => [data.comment, ...prev]);
      setForm({ name: '', email: '', comment: '' });
      toast.success('Comment posted!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `w-full border border-[#e5e0d8] rounded-sm px-4 py-2.5 text-sm
    text-[#0f172a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d97706]
    focus:ring-1 focus:ring-[#d97706] bg-white transition-all`;

  return (
    <div className="mt-16 pt-12 border-t border-[#e5e0d8]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle size={22} className="text-[#d97706]" />
        <h2 className="font-display text-2xl font-bold text-[#0f172a]">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-base font-normal text-[#6b7280]">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Form */}
      <div className="bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm p-6 mb-10">
        <h3 className="font-display text-lg font-bold text-[#0f172a] mb-5">Leave a comment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#6b7280] mb-1.5">
                Name *
              </label>
              <input
                className={inputClass}
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#6b7280] mb-1.5">
                Email * (not published)
              </label>
              <input
                type="email"
                className={inputClass}
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#6b7280] mb-1.5">
              Comment *
            </label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={4}
              placeholder="Share your thoughts..."
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              maxLength={1000}
              required
            />
            <p className="text-[10px] text-[#9ca3af] font-mono mt-1 text-right">
              {form.comment.length}/1000
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                Posting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={14} /> Post Comment
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-sm" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-[#f8f7f4] border border-[#e5e0d8] rounded-sm">
          <MessageCircle size={32} className="text-[#d4cfc7] mx-auto mb-3" />
          <p className="font-display text-lg text-[#0f172a] mb-1">No comments yet</p>
          <p className="text-sm text-[#6b7280]">Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c, i) => (
            <div
              key={c._id}
              className="bg-white border border-[#e5e0d8] rounded-sm p-5 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-sm bg-[#0f172a] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-display font-bold text-sm">
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{c.name}</p>
                  <p className="text-[11px] text-[#6b7280] font-mono flex items-center gap-1">
                    <Clock size={10} /> {timeAgo(c.createdAt)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#2d2926] leading-relaxed pl-12">{c.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
