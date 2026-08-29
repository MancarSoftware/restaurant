import { EventsManager } from "@/features/admin/events-manager";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function AdminEventsPage() {
  const events = await db.event.findMany({ orderBy: { eventDate: "desc" } });
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Experiencias.</h1>
          <p>Cenas de temporada, maridajes y encuentros especiales.</p>
        </div>
      </header>
      <EventsManager
        events={events.map((event) => ({
          ...event,
          eventDate: event.eventDate.toISOString().slice(0, 10),
          createdAt: event.createdAt.toISOString(),
          updatedAt: event.updatedAt.toISOString(),
        }))}
      />
    </>
  );
}
