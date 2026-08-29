import "server-only";

import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  SESSION_COOKIE_NAME: z.string().min(1).default("bruma_session"),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(168).default(12),
  IP_HASH_SECRET: z.string().min(32),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export const env = schema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
  SESSION_TTL_HOURS: process.env.SESSION_TTL_HOURS,
  IP_HASH_SECRET: process.env.IP_HASH_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});
