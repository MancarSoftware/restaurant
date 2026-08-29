import { db } from "@/lib/db";
import { toDateOnly } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function AdminDashboard() {
  const today = toDateOnly(new Date().toISOString().slice(0, 10));
  const [
    todayReservations,
    pendingReservations,
    upcomingReservations,
    menuItems,
    activeEvents,
    unreadMessages,
    upcoming,
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
    db.reservation.findMany({
      where: {
        reservationDate: { gte: today },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      orderBy: [{ reservationDate: "asc" }, { reservationTime: "asc" }],
      take: 8,
    }),
  ]);
  const stats = [
    [todayReservations, "Reservas hoy"],
    [pendingReservations, "Pendientes"],
    [upcomingReservations, "Próximas"],
    [menuItems, "Platos"],
    [activeEvents, "Eventos activos"],
    [unreadMessages, "Mensajes sin leer"],
  ] as const;
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Operación de hoy.</h1>
          <p>Lo importante para preparar el próximo servicio.</p>
        </div>
      </header>
      <section className="stats-grid">
        {stats.map(([value, label]) => (
          <div className="admin-card stat" key={label}>
            <strong className="stat-value">{value}</strong>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </section>
      <section style={{ marginTop: "2rem" }}>
        <div className="admin-header">
          <div>
            <h1 style={{ fontSize: "2.6rem" }}>Próximas mesas</h1>
          </div>
        </div>
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Personas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    {reservation.reservationDate.toISOString().slice(0, 10)}
                  </td>
                  <td>{reservation.reservationTime}</td>
                  <td>{reservation.customerName}</td>
                  <td>{reservation.guests}</td>
                  <td>
                    <span
                      className={`status ${reservation.status.toLowerCase().replace("_", "-")}`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
              {upcoming.length === 0 && (
                <tr>
                  <td colSpan={5}>No hay reservas próximas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
