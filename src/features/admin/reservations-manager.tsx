"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
type Reservation = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  specialRequests: string | null;
  internalNotes: string | null;
  status: Status;
};
const labels: Record<Status, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

export function ReservationsManager({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [saving, setSaving] = useState("");
  const filter = (form: FormData) => {
    const next = new URLSearchParams();
    for (const key of ["status", "date", "search"]) {
      const value = String(form.get(key) ?? "");
      if (value) next.set(key, value);
    }
    router.push(`/admin/reservas?${next}`);
  };
  const update = async (id: string, status: Status) => {
    setSaving(id);
    await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving("");
    router.refresh();
  };
  return (
    <>
      <form className="admin-toolbar" action={filter}>
        <input
          name="search"
          placeholder="Cliente, correo o teléfono"
          defaultValue={params.get("search") ?? ""}
        />
        <input
          type="date"
          name="date"
          defaultValue={params.get("date") ?? ""}
        />
        <select name="status" defaultValue={params.get("status") ?? ""}>
          <option value="">Todos los estados</option>
          {Object.entries(labels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button className="admin-button">Filtrar</button>
      </form>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Personas</th>
              <th>Notas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>
                  <strong>{reservation.reservationDate}</strong>
                  <br />
                  {reservation.reservationTime}
                </td>
                <td>{reservation.customerName}</td>
                <td>
                  <a href={`tel:${reservation.phone}`}>{reservation.phone}</a>
                  <br />
                  <a href={`mailto:${reservation.email}`}>
                    {reservation.email}
                  </a>
                </td>
                <td>{reservation.guests}</td>
                <td>{reservation.specialRequests || "—"}</td>
                <td>
                  <span
                    className={`status ${reservation.status.toLowerCase().replace("_", "-")}`}
                  >
                    {labels[reservation.status]}
                  </span>
                </td>
                <td>
                  <select
                    aria-label={`Cambiar estado de ${reservation.customerName}`}
                    disabled={saving === reservation.id}
                    value={reservation.status}
                    onChange={(event) =>
                      update(reservation.id, event.target.value as Status)
                    }
                  >
                    {Object.entries(labels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={7}>No hay reservas con estos filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
