import { eventPatchSchema } from "@/features/events/schema";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";
import { toDateOnly } from "@/lib/utils";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const input = eventPatchSchema.parse(await parseJson(request));
    const event = await db.event.update({
      where: { id },
      data: {
        ...input,
        eventDate: input.eventDate ? toDateOnly(input.eventDate) : undefined,
        imageUrl: input.imageUrl === "" ? null : input.imageUrl,
      },
    });
    await writeAudit({
      userId: user.id,
      action: "EVENT_UPDATED",
      entity: "Event",
      entityId: id,
    });
    return ok(event);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(["ADMIN"]);
    const { id } = await params;
    await db.event.delete({ where: { id } });
    await writeAudit({
      userId: user.id,
      action: "EVENT_DELETED",
      entity: "Event",
      entityId: id,
    });
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
