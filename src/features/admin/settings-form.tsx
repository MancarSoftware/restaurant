"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type OpeningHour = {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
};
type Settings = {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  reservationLeadHours: number;
  maxPartySize: number;
  reservationDuration: number;
  openingHours: OpeningHour[];
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const result = (await response.json()) as { error?: { message?: string } };
    setSaving(false);
    if (!response.ok) {
      setStatus(result.error?.message ?? "No se pudo guardar.");
      return;
    }
    setStatus("Ajustes guardados.");
    router.refresh();
  };
  const saveHours = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const hours = dayNames.map((_, dayOfWeek) => {
      const isClosed = form.has(`closed-${dayOfWeek}`);
      return {
        dayOfWeek,
        isClosed,
        openTime: isClosed ? null : String(form.get(`open-${dayOfWeek}`)),
        closeTime: isClosed ? null : String(form.get(`close-${dayOfWeek}`)),
      };
    });
    const response = await fetch("/api/admin/opening-hours", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hours),
    });
    setSaving(false);
    setStatus(
      response.ok
        ? "Horarios guardados."
        : "No se pudieron guardar los horarios.",
    );
    router.refresh();
  };
  return (
    <>
      <form className="admin-card admin-form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="settings-name">Nombre</label>
          <input
            id="settings-name"
            name="name"
            defaultValue={settings.name}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="settings-tagline">Frase de marca</label>
          <input
            id="settings-tagline"
            name="tagline"
            defaultValue={settings.tagline}
            required
          />
        </div>
        <div className="field full">
          <label htmlFor="settings-description">Descripción</label>
          <textarea
            id="settings-description"
            name="description"
            defaultValue={settings.description}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="settings-phone">Teléfono</label>
          <input
            id="settings-phone"
            name="phone"
            defaultValue={settings.phone}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="settings-whatsapp">WhatsApp</label>
          <input
            id="settings-whatsapp"
            name="whatsapp"
            defaultValue={settings.whatsapp}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="settings-email">Correo</label>
          <input
            id="settings-email"
            name="email"
            type="email"
            defaultValue={settings.email}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="settings-address">Dirección</label>
          <input
            id="settings-address"
            name="address"
            defaultValue={settings.address}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="settings-city">Ciudad</label>
          <input
            id="settings-city"
            name="city"
            defaultValue={settings.city}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="settings-country">País</label>
          <input
            id="settings-country"
            name="country"
            defaultValue={settings.country}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="settings-instagram">Instagram URL</label>
          <input
            id="settings-instagram"
            name="instagramUrl"
            type="url"
            defaultValue={settings.instagramUrl ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="settings-facebook">Facebook URL</label>
          <input
            id="settings-facebook"
            name="facebookUrl"
            type="url"
            defaultValue={settings.facebookUrl ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="settings-lead">Antelación mínima (horas)</label>
          <input
            id="settings-lead"
            name="reservationLeadHours"
            type="number"
            min="0"
            defaultValue={settings.reservationLeadHours}
          />
        </div>
        <div className="field">
          <label htmlFor="settings-party">Tamaño máximo de grupo</label>
          <input
            id="settings-party"
            name="maxPartySize"
            type="number"
            min="1"
            defaultValue={settings.maxPartySize}
          />
        </div>
        <div className="field">
          <label htmlFor="settings-duration">Duración estimada (min)</label>
          <input
            id="settings-duration"
            name="reservationDuration"
            type="number"
            min="30"
            defaultValue={settings.reservationDuration}
          />
        </div>
        {status && (
          <div className="admin-form-error" role="status">
            {status}
          </div>
        )}
        <div className="form-actions">
          <button className="admin-button" disabled={saving}>
            {saving ? "Guardando…" : "Guardar ajustes"}
          </button>
        </div>
      </form>
      <form
        className="admin-card admin-form"
        onSubmit={saveHours}
        style={{ marginTop: "1.5rem" }}
      >
        <div className="field full">
          <h2>Horarios de atención</h2>
        </div>
        {dayNames.map((day, index) => {
          const hour = settings.openingHours.find(
            (item) => item.dayOfWeek === index,
          );
          return (
            <div
              className="field full"
              key={day}
              style={{
                gridTemplateColumns: "8rem 1fr 1fr auto",
                alignItems: "center",
                display: "grid",
                gap: "1rem",
              }}
            >
              <strong>{day}</strong>
              <input
                aria-label={`Apertura ${day}`}
                type="time"
                name={`open-${index}`}
                defaultValue={hour?.openTime ?? "19:00"}
              />
              <input
                aria-label={`Cierre ${day}`}
                type="time"
                name={`close-${index}`}
                defaultValue={hour?.closeTime ?? "23:00"}
              />
              <label>
                <input
                  type="checkbox"
                  name={`closed-${index}`}
                  defaultChecked={hour?.isClosed}
                />{" "}
                Cerrado
              </label>
            </div>
          );
        })}
        <div className="form-actions">
          <button className="admin-button" disabled={saving}>
            {saving ? "Guardando…" : "Guardar horarios"}
          </button>
        </div>
      </form>
    </>
  );
}
