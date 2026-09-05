'use client';
import { useState, useTransition } from 'react';
import { MessageCircle, Send, Clock } from 'lucide-react';
import { submitComment } from '@/app/actions/comments';
import DOMPurify from 'isomorphic-dompurify';

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
  initialComments: Comment[];
}

const timeAgo = (dateStr: string) => {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch {
    return '';
  }
};

export default function CommentSection({
  postId,
  postType,
  postSlug,
  postTitle,
  initialComments,
}: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', comment: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.comment.trim()) {
      setError('All fields are required');
      return;
    }

    if (form.comment.length > 1000) {
      setError('Comment must be 1000 characters or less');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('comment', form.comment);
    formData.append('postId', postId);
    formData.append('postType', postType);
    formData.append('postSlug', postSlug);
    formData.append('postTitle', postTitle);

    startTransition(async () => {
      const result = await submitComment(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        const newComment: Comment = {
          _id: Date.now().toString(),
          name: form.name,
          comment: form.comment,
          createdAt: new Date().toISOString(),
        };
        setComments(prev => [newComment, ...prev]);
        setForm({ name: '', email: '', comment: '' });
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  const inputClass = `w-full border border-[#e5e0d8] rounded-sm px-4 py-2.5 text-sm
    text-[#0f172a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d97706]
    focus:ring-1 focus:ring-[#d97706] bg-white transition-all`;

  return (
    <div className="mt-16 pt-12 border-t border-[#e5e0d8]">
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

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="bg-[#f9f7f4] p-6 rounded-sm border border-[#e5e0d8] mb-10">
        <h3 className="font-display text-lg font-bold text-[#0f172a] mb-4">Leave a comment</h3>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-sm mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 p-3 rounded-sm mb-4 text-sm">✓ Comment posted!</div>}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            disabled={isPending}
            maxLength={100}
          />

          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            disabled={isPending}
          />

          <textarea
            placeholder="Your comment (max 1000 characters)..."
            value={form.comment}
            onChange={e => setForm({ ...form, comment: e.target.value })}
            className={`${inputClass} resize-none`}
            rows={4}
            disabled={isPending}
            maxLength={1000}
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6b7280]">
              {form.comment.length}/1000
            </span>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] disabled:bg-[#d1d5db] text-white px-6 py-2.5 rounded-sm font-medium transition-colors"
            >
              <Send size={16} />
              {isPending ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center py-8 text-[#6b7280]">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="bg-white border border-[#e5e0d8] rounded-sm p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-[#0f172a]">{comment.name}</h4>
                <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                  <Clock size={12} />
                  {timeAgo(comment.createdAt)}
                </div>
              </div>
              <div
                className="text-sm text-[#4b4540] leading-relaxed prose-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(comment.comment, {
                    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
                    ALLOWED_ATTR: ['href', 'title', 'target'],
                  }),
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
