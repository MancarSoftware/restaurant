import { z } from "zod";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(4).max(180),
  description: z.string().trim().min(20).max(2000),
  phone: z.string().trim().min(7).max(30),
  whatsapp: z.string().trim().min(7).max(30),
  email: z.email().max(160),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(100),
  country: z.string().trim().min(2).max(100),
  instagramUrl: z.url().optional().or(z.literal("")),
  facebookUrl: z.url().optional().or(z.literal("")),
  reservationLeadHours: z.coerce.number().int().min(0).max(168),
  maxPartySize: z.coerce.number().int().min(1).max(100),
  reservationDuration: z.coerce.number().int().min(30).max(480),
});

export async function GET() {
  try {
    await requireUser();
    return ok(
      await db.restaurant.findFirst({
        include: { openingHours: { orderBy: { dayOfWeek: "asc" } } },
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(["ADMIN"]);
    const current = await db.restaurant.findFirst();
    if (!current) throw new Error("Restaurant not configured");
    const input = schema.parse(await parseJson(request));
    const restaurant = await db.restaurant.update({
      where: { id: current.id },
      data: {
        ...input,
        instagramUrl: input.instagramUrl || null,
        facebookUrl: input.facebookUrl || null,
      },
    });
    await writeAudit({
      userId: user.id,
      action: "RESTAURANT_SETTINGS_UPDATED",
      entity: "Restaurant",
      entityId: current.id,
    });
    return ok(restaurant);
  } catch (error) {
    return handleApiError(error);
  }
}
