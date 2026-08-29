import { db } from "@/lib/db";
import { handleApiError, ok } from "@/lib/http";

export async function GET() {
  try {
    const events = await db.event.findMany({
      where: {
        active: true,
        eventDate: { gte: new Date(new Date().toISOString().slice(0, 10)) },
      },
      orderBy: { eventDate: "asc" },
    });
    return ok(events);
  } catch (error) {
    return handleApiError(error);
  }
}
