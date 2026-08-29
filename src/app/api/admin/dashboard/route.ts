import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/http";
import { toDateOnly } from "@/lib/utils";

export async function GET() {
  try {
    await requireUser();
    const today = toDateOnly(new Date().toISOString().slice(0, 10));
    const [
      todayReservations,
      pendingReservations,
      upcomingReservations,
      menuItems,
      activeEvents,
      unreadMessages,
    ] = await Promise.all([
      db.reservation.count({ where: { reservationDate: today } }),
      db.reservation.count({ where: { status: "PENDING" } }),
      db.reservation.count({
        where: {
          reservationDate: { gte: today },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      }),
      db.menuItem.count(),
      db.event.count({ where: { active: true, eventDate: { gte: today } } }),
      db.contactMessage.count({ where: { read: false } }),
    ]);
    return ok({
      todayReservations,
      pendingReservations,
      upcomingReservations,
      menuItems,
      activeEvents,
      unreadMessages,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
