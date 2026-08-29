import { ReservationsManager } from "@/features/admin/reservations-manager";
import { db } from "@/lib/db";
import { toDateOnly } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string; search?: string }>;
}) {
  const query = await searchParams;
  const allowed = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
    "NO_SHOW",
  ] as const;
  const status = allowed.includes(query.status as (typeof allowed)[number])
    ? (query.status as (typeof allowed)[number])
    : undefined;
  const reservations = await db.reservation.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(query.date ? { reservationDate: toDateOnly(query.date) } : {}),
      ...(query.search
        ? {
            OR: [
              { customerName: { contains: query.search, mode: "insensitive" } },
              { email: { contains: query.search, mode: "insensitive" } },
              { phone: { contains: query.search } },
            ],
          }
        : {}),
    },
    orderBy: [{ reservationDate: "asc" }, { reservationTime: "asc" }],
    take: 250,
  });
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Reservas.</h1>
          <p>Confirmación, atención y seguimiento de cada mesa.</p>
        </div>
      </header>
      <ReservationsManager
        reservations={reservations.map((reservation) => ({
          ...reservation,
          reservationDate: reservation.reservationDate
            .toISOString()
            .slice(0, 10),
          createdAt: reservation.createdAt.toISOString(),
          updatedAt: reservation.updatedAt.toISOString(),
        }))}
      />
    </>
  );
}
