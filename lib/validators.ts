// lib/validators.ts

/**
 * Allowed fields for article updates (whitelist approach)
 */
const ALLOWED_ARTICLE_FIELDS = [
  'title',
  'slug',
  'summary',
  'content',
  'category',
  'author',
  'coverImage',
  'tags',
  'seoTitle',
  'seoDescription',
];

const ALLOWED_ARTICLE_ADMIN_FIELDS = [
  ...ALLOWED_ARTICLE_FIELDS,
  'status',
  'featured',
  'publishedAt',
];

/**
 * Filter user input to only allowed fields
 */
export function filterArticleInput(
  input: any,
  isAdmin: boolean = false
): Record<string, any> {
  const allowed = isAdmin ? ALLOWED_ARTICLE_ADMIN_FIELDS : ALLOWED_ARTICLE_FIELDS;
  const filtered: Record<string, any> = {};

  for (const field of allowed) {
    if (field in input) {
      filtered[field] = input[field];
    }
  }

  return filtered;
}

/**
 * Validate comment length and content
 */
export function validateComment(comment: string): { valid: boolean; error?: string } {
  if (!comment || typeof comment !== 'string') {
    return { valid: false, error: 'Comment is required' };
  }

  const trimmed = comment.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Comment cannot be empty' };
  }

  if (trimmed.length > 1000) {
    return { valid: false, error: 'Comment must be 1000 characters or less' };
  }

  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase().trim());
}

/**
 * Validate category against whitelist
 */
export function validateCategory(category: string): boolean {
  const validCategories = [
    'Culture',
    'Entertainment',
    'Football',
    'Sports',
    'News',
    'Opinion',
    'Lifestyle',
    'Technology',
  ];
  return validCategories.includes(category);
}
