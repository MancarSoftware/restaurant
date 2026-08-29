import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(7, "Ingresa un teléfono válido.")
  .max(24)
  .regex(/^[+\d\s()-]+$/, "Ingresa un teléfono válido.");

export const reservationSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  email: z
    .email()
    .max(160)
    .transform((value) => value.toLowerCase()),
  phone,
  reservationDate: z.iso.date(),
  reservationTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  guests: z.coerce.number().int().min(1).max(20),
  specialRequests: z.string().trim().max(1000).optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const reservationStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
  internalNotes: z.string().trim().max(2000).optional(),
});

export function validateReservationDate(
  date: string,
  time: string,
  leadHours: number,
  now = new Date(),
) {
  const requested = new Date(`${date}T${time}:00-05:00`);
  if (Number.isNaN(requested.getTime())) return false;
  return requested.getTime() >= now.getTime() + leadHours * 60 * 60 * 1000;
}
