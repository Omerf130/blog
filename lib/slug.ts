import type { Model } from 'mongoose';

/**
 * Slugify Hebrew text
 * Keeps Hebrew letters, numbers, and replaces spaces with hyphens
 */
export function slugifyHebrew(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\u0590-\u05FF\u0621-\u064Aa-zA-Z0-9\-]/g, '') // Keep Hebrew, Arabic, English, numbers, hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .toLowerCase();
}

/**
 * Ensure slug is unique by appending numbers if needed
 * @param model Mongoose model to check against
 * @param baseSlug Base slug to make unique
 * @param field Field name to check (default: 'slugHe')
 * @param excludeId Optional ID to exclude from check (for updates)
 */
export async function ensureUniqueSlug(
  model: Model<any>,
  baseSlug: string,
  field: string = 'slugHe',
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    // Build query
    const query: any = { [field]: slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    // Check if slug exists
    const existing = await model.findOne(query);
    
    if (!existing) {
      return slug;
    }

    // Try next variation
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

/**
 * Generate a unique Hebrew slug from text
 * Convenience function that combines slugifyHebrew and ensureUniqueSlug
 */
export async function generateUniqueSlug(
  model: Model<any>,
  text: string,
  field: string = 'slugHe',
  excludeId?: string
): Promise<string> {
  const baseSlug = slugifyHebrew(text);
  return ensureUniqueSlug(model, baseSlug, field, excludeId);
}

