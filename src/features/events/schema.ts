import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(140),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().trim().min(10).max(3000),
  eventDate: z.iso.date(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
  location: z.string().trim().min(2).max(200),
  capacity: z.coerce.number().int().positive().max(1000).optional().nullable(),
  active: z.boolean().default(true),
});

export const eventPatchSchema = eventSchema.partial();
