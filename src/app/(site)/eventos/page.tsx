import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Experiencias",
  description:
    "Cenas especiales, maridajes y experiencias privadas en Casa Bruma.",
};

export default async function EventsPage() {
  const events = await db.event.findMany({
    where: {
      active: true,
      eventDate: { gte: new Date(new Date().toISOString().slice(0, 10)) },
    },
    orderBy: { eventDate: "asc" },
  });
  return (
    <>
      <header className="page-hero">
        <div>
          <p className="eyebrow">Calendario de la casa</p>
          <h1>
            Noches que
            <br />
            sólo ocurren una vez.
          </h1>
        </div>
        <p>
          Encuentros de temporada, menús de una sola noche y conversaciones con
          quienes cultivan lo que servimos.
        </p>
      </header>
      <section className="page-section">
        <div className="container event-list">
          {events.length === 0 ? (
            <p>Estamos preparando las próximas experiencias.</p>
          ) : (
            events.map((event) => (
              <article className="event-row" key={event.id}>
                <time
                  className="event-date"
                  dateTime={event.eventDate.toISOString()}
                >
                  {formatDate(event.eventDate, {
                    day: "2-digit",
                    month: "short",
                  })}
                </time>
                <div>
                  <h2>{event.title}</h2>
                  <p>{event.description}</p>
                </div>
                <div>
                  <p className="event-meta">
                    {event.startTime} · {event.location}
                    {event.capacity ? ` · ${event.capacity} lugares` : ""}
                  </p>
                  <Link
                    href={`/reservar?event=${event.slug}`}
                    className="text-link"
                  >
                    Solicitar lugar <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
