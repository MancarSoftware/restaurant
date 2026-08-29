import { z } from "zod";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

const schema = z
  .array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      openTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
        .nullable(),
      closeTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
        .nullable(),
      isClosed: z.boolean(),
    }),
  )
  .length(7);

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(["ADMIN"]);
    const restaurant = await db.restaurant.findFirst();
    if (!restaurant) throw new Error("Restaurant not configured");
    const hours = schema.parse(await parseJson(request));
    await db.$transaction(
      hours.map((hour) =>
        db.openingHour.upsert({
          where: {
            restaurantId_dayOfWeek: {
              restaurantId: restaurant.id,
              dayOfWeek: hour.dayOfWeek,
            },
          },
          update: hour,
          create: { restaurantId: restaurant.id, ...hour },
        }),
      ),
    );
    await writeAudit({
      userId: user.id,
      action: "OPENING_HOURS_UPDATED",
      entity: "Restaurant",
      entityId: restaurant.id,
    });
    return ok(hours);
  } catch (error) {
    return handleApiError(error);
  }
}
