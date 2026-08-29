import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .email()
    .max(160)
    .transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(24).optional().or(z.literal("")),
  subject: z.string().trim().min(3).max(140),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
