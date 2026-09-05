'use server';
import { connectDB } from '@/lib/mongodb';
import { Comment } from '@/lib/models/index';
import { revalidatePath } from 'next/cache';
import { sanitizeEmail } from '@/lib/sanitizer';
import { validateComment, validateEmail } from '@/lib/validators';

export async function submitComment(formData: FormData) {
  try {
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const comment = formData.get('comment')?.toString().trim();
    const postId = formData.get('postId')?.toString();
    const postType = formData.get('postType')?.toString();
    const postSlug = formData.get('postSlug')?.toString();
    const postTitle = formData.get('postTitle')?.toString();

    // Validate all required fields
    if (!name || !email || !comment) {
      return { error: 'Name, email and comment are required' };
    }

    if (name.length < 2 || name.length > 100) {
      return { error: 'Name must be between 2 and 100 characters' };
    }

    // Validate email format
    if (!validateEmail(email)) {
      return { error: 'Invalid email address' };
    }

    // Validate comment length and content
    const commentValidation = validateComment(comment);
    if (!commentValidation.valid) {
      return { error: commentValidation.error };
    }

    // Sanitize email
    const sanitized = sanitizeEmail(email);
    if (!sanitized) {
      return { error: 'Invalid email address' };
    }

    await connectDB();

    // Store comment as-is - sanitize on client-side when displaying
    await Comment.create({
      name: name.substring(0, 100),
      email: sanitized,
      comment: comment,  // Store raw comment, sanitize on client
      postId,
      postType,
      postSlug,
      postTitle,
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
