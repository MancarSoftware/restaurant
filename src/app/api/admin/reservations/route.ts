import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, ok } from "@/lib/http";
import { toDateOnly } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    await requireUser();
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const date = url.searchParams.get("date");
    const search = url.searchParams.get("search")?.trim();
    const allowed = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
      "NO_SHOW",
    ] as const;

    const reservations = await db.reservation.findMany({
      where: {
        ...(status && allowed.includes(status as (typeof allowed)[number])
          ? { status: status as (typeof allowed)[number] }
          : {}),
        ...(date ? { reservationDate: toDateOnly(date) } : {}),
        ...(search
          ? {
              OR: [
                { customerName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: [{ reservationDate: "asc" }, { reservationTime: "asc" }],
      take: 250,
    });
    return ok(reservations);
  } catch (error) {
    return handleApiError(error);
  }
}
