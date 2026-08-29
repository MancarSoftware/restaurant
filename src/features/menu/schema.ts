import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().trim().min(10).max(1200),
  price: z.coerce.number().positive().max(9999),
  categoryId: z.uuid(),
  imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  seasonal: z.boolean().default(false),
  chefRecommended: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
  dietaryTagIds: z.array(z.uuid()).default([]),
});

export const menuItemPatchSchema = menuItemSchema.partial();

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
  active: z.boolean().default(true),
});

export const categoryPatchSchema = categorySchema.partial();
