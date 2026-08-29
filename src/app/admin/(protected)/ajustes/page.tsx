import { SettingsForm } from "@/features/admin/settings-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function SettingsPage() {
  const settings = await db.restaurant.findFirst({
    include: { openingHours: { orderBy: { dayOfWeek: "asc" } } },
  });
  if (!settings)
    return <p>Configura el restaurante mediante el seed inicial.</p>;
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Ajustes.</h1>
          <p>Información pública y reglas básicas de reserva.</p>
        </div>
      </header>
      <SettingsForm
        settings={{
          name: settings.name,
          tagline: settings.tagline,
          description: settings.description,
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          email: settings.email,
          address: settings.address,
          city: settings.city,
          country: settings.country,
          instagramUrl: settings.instagramUrl,
          facebookUrl: settings.facebookUrl,
          reservationLeadHours: settings.reservationLeadHours,
          maxPartySize: settings.maxPartySize,
          reservationDuration: settings.reservationDuration,
          openingHours: settings.openingHours.map((hour) => ({
            dayOfWeek: hour.dayOfWeek,
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            isClosed: hour.isClosed,
          })),
        }}
      />
    </>
  );
}
