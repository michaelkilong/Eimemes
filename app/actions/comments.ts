'use server';
import { connectDB } from '@/lib/mongodb';
import { Comment } from '@/lib/models/index';
import { revalidatePath } from 'next/cache';

export async function submitComment(formData: FormData) {
  try {
    const name      = formData.get('name')?.toString().trim();
    const email     = formData.get('email')?.toString().trim();
    const comment   = formData.get('comment')?.toString().trim();
    const postId    = formData.get('postId')?.toString();
    const postType  = formData.get('postType')?.toString();
    const postSlug  = formData.get('postSlug')?.toString();
    const postTitle = formData.get('postTitle')?.toString();

    if (!name || !email || !comment) {
      return { error: 'Name, email and comment are required' };
    }

    if (comment.length > 1000) {
      return { error: 'Comment too long (max 1000 characters)' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: 'Invalid email address' };
    }

    await connectDB();

    await Comment.create({
      name, email, comment,
      postId, postType, postSlug, postTitle,
    });

    revalidatePath(`/article/${postSlug}`);
    revalidatePath(`/blog/${postSlug}`);

    return { success: true };
  } catch (err) {
    console.error('[SUBMIT COMMENT]', err);
    return { error: 'Failed to post comment. Please try again.' };
  }
}

export async function getComments(postId: string) {
  try {
    await connectDB();
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return JSON.parse(JSON.stringify(comments));
  } catch {
    return [];
  }
}
  
