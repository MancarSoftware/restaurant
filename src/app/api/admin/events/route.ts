import { eventSchema } from "@/features/events/schema";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";
import { toDateOnly } from "@/lib/utils";

export async function GET() {
  try {
    await requireUser();
    return ok(await db.event.findMany({ orderBy: { eventDate: "desc" } }));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = eventSchema.parse(await parseJson(request));
    const event = await db.event.create({
      data: {
        ...input,
        eventDate: toDateOnly(input.eventDate),
        imageUrl: input.imageUrl || null,
      },
    });
    await writeAudit({
      userId: user.id,
      action: "EVENT_CREATED",
      entity: "Event",
      entityId: event.id,
    });
    return ok(event, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
