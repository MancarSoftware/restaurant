import type { Metadata } from "next";
import Image from "next/image";
import { ReservationForm } from "@/features/reservations/reservation-form";
import { db } from "@/lib/db";
import { getMinimumReservationDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Reservar",
  description: "Solicita una mesa en Casa Bruma, Guayaquil.",
};

export default async function ReservationPage() {
  const restaurant = await db.restaurant.findFirst({
    select: { maxPartySize: true },
  });
  const minDate = getMinimumReservationDate();
  return (
    <section className="form-shell">
      <aside className="form-aside">
        <Image
          src="/images/dining-room-v2.webp"
          alt="Mesa junto al fuego en Casa Bruma"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        <div className="form-aside-copy">
          <p className="eyebrow">Tu lugar en la casa</p>
          <h2>La noche empieza aquí.</h2>
        </div>
      </aside>
      <div className="form-panel">
        <p className="eyebrow">Reservas</p>
        <h1>Elegir mesa.</h1>
        <p>
          Recibimos reservas de martes a sábado. Para grupos de más de{" "}
          {restaurant?.maxPartySize ?? 12} personas o eventos privados,
          escríbenos por WhatsApp.
        </p>
        <ReservationForm
          maxPartySize={restaurant?.maxPartySize ?? 12}
          minDate={minDate}
        />
      </div>
    </section>
  );
}
