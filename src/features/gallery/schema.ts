import { z } from "zod";

export const galleryImageSchema = z.object({
  title: z.string().trim().min(2).max(120),
  caption: z.string().trim().max(500).optional().or(z.literal("")),
  category: z.string().trim().min(2).max(80),
  imageUrl: z.string().trim().min(1).max(500),
  altText: z.string().trim().min(5).max(250),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
  visible: z.boolean().default(true),
});

export const galleryImagePatchSchema = galleryImageSchema.partial();
