import { reservationStatusSchema } from "@/features/reservations/schema";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const input = reservationStatusSchema.parse(await parseJson(request));
    const reservation = await db.reservation.update({
      where: { id },
      data: input,
    });
    await writeAudit({
      userId: user.id,
      action: `RESERVATION_${input.status}`,
      entity: "Reservation",
      entityId: id,
    });
    console.info("reservation.status_changed", {
      reservationId: id,
      status: input.status,
      userId: user.id,
    });
    return ok(reservation);
  } catch (error) {
    return handleApiError(error);
  }
}
