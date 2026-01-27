// src/lib/validations/style.js
import { z } from 'zod';

export const styleSchema = z.object({
  name: z
    .string()
    .min(1, 'Style name is required')
    .min(2, 'Style name must be at least 2 characters')
    .max(100, 'Style name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Style name can only contain letters, numbers, spaces, hyphens, and ampersands'),

  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),

  category: z
    .string()
    .min(1, 'Category is required')
    .refine((val) => ['MODERN', 'FUSION', 'CLASSIC', 'INDIAN'].includes(val), {
      message: 'Please select a valid category'
    }),

  popularity: z
    .number()
    .min(0, 'Popularity must be at least 0%')
    .max(100, 'Popularity cannot exceed 100%')
    .default(50),

  // status: z
  //   .string()
  //   .refine((val) => ['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(val), {
  //     message: 'Please select a valid status'
  //   })
  //   .default('DRAFT'),

  // featured: z.boolean().default(false),

  imageUrl: z
    .string()
    .min(1, 'Style image is required')
    .url('Please provide a valid image URL'),

  tags: z
    .array(z.string())
    .min(1, 'At least one tag is required')
    .max(10, 'Cannot exceed 10 tags')
    .refine(
      (tags) => tags.every(tag => tag.length >= 2 && tag.length <= 20),
      'Each tag must be between 2 and 20 characters'
    )
    .refine(
      (tags) => tags.every(tag => /^[a-zA-Z0-9\s\-]+$/.test(tag)),
      'Tags can only contain letters, numbers, spaces, and hyphens'
    ),

  characteristics: z
    .array(z.string())
    .min(1, 'At least one characteristic is required')
    .max(15, 'Cannot exceed 15 characteristics')
    .refine(
      (chars) => chars.every(char => char.length >= 5 && char.length <= 50),
      'Each characteristic must be between 5 and 50 characters'
    ),
});

export const styleCreateSchema = styleSchema;
export const styleUpdateSchema = styleSchema;

// Schema for file upload (if needed)
export const styleImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 20 * 1024 * 1024, 'File size must be less than 20MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    )
});