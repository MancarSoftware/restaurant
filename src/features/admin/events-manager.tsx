"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { slugify } from "@/lib/utils";

type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  startTime: string;
  imageUrl: string | null;
  location: string;
  capacity: number | null;
  active: boolean;
};

export function EventsManager({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const open = (event?: EventItem) => {
    setEditing(event ?? null);
    setImageUrl(event?.imageUrl ?? "");
    setError("");
    dialog.current?.showModal();
  };
  const upload = async (file?: File) => {
    if (!file) return;
    setSaving(true);
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body,
    });
    const result = (await response.json()) as {
      data?: { url?: string };
      error?: { message?: string };
    };
    setSaving(false);
    if (!response.ok) {
      setError(result.error?.message ?? "No se pudo subir.");
      return;
    }
    setImageUrl(result.data?.url ?? "");
  };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title"));
    const payload = {
      title,
      slug: String(form.get("slug") || slugify(title)),
      description: form.get("description"),
      eventDate: form.get("eventDate"),
      startTime: form.get("startTime"),
      imageUrl,
      location: form.get("location"),
      capacity: form.get("capacity") ? Number(form.get("capacity")) : null,
      active: form.has("active"),
    };
    const response = await fetch(
      editing ? `/api/admin/events/${editing.id}` : "/api/admin/events",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const result = (await response.json()) as { error?: { message?: string } };
    setSaving(false);
    if (!response.ok) {
      setError(result.error?.message ?? "No se pudo guardar.");
      return;
    }
    dialog.current?.close();
    router.refresh();
  };
  const remove = async (item: EventItem) => {
    if (!confirm(`¿Eliminar “${item.title}”?`)) return;
    const response = await fetch(`/api/admin/events/${item.id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const result = (await response.json()) as {
        error?: { message?: string };
      };
      alert(result.error?.message ?? "No se pudo eliminar.");
      return;
    }
    router.refresh();
  };
  return (
    <>
      <div className="admin-toolbar">
        <button className="admin-button" onClick={() => open()}>
          <Plus size={14} />
          Nueva experiencia
        </button>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Experiencia</th>
              <th>Lugar</th>
              <th>Cupo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.eventDate}
                  <br />
                  {item.startTime}
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <br />
                  <small>{item.description.slice(0, 90)}…</small>
                </td>
                <td>{item.location}</td>
                <td>{item.capacity ?? "—"}</td>
                <td>
                  <span
                    className={`status ${item.active ? "active" : "inactive"}`}
                  >
                    {item.active ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button
                      className="admin-button secondary"
                      onClick={() => open(item)}
                    >
                      <Pencil size={13} />
                      Editar
                    </button>
                    <button
                      className="admin-button danger"
                      onClick={() => remove(item)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog ref={dialog} className="modal">
        <div className="modal-header">
          <h2>{editing ? "Editar experiencia" : "Nueva experiencia"}</h2>
          <button
            className="icon-button"
            onClick={() => dialog.current?.close()}
          >
            <X />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
        <form className="admin-form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="event-title">Título</label>
            <input
              id="event-title"
              name="title"
              defaultValue={editing?.title}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="event-slug">Slug</label>
            <input id="event-slug" name="slug" defaultValue={editing?.slug} />
          </div>
          <div className="field full">
            <label htmlFor="event-description">Descripción</label>
            <textarea
              id="event-description"
              name="description"
              defaultValue={editing?.description}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="event-date">Fecha</label>
            <input
              id="event-date"
              type="date"
              name="eventDate"
              defaultValue={editing?.eventDate}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="event-time">Hora</label>
            <input
              id="event-time"
              type="time"
              name="startTime"
              defaultValue={editing?.startTime}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="event-location">Lugar</label>
            <input
              id="event-location"
              name="location"
              defaultValue={editing?.location}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="event-capacity">Cupo</label>
            <input
              id="event-capacity"
              name="capacity"
              type="number"
              min="1"
              defaultValue={editing?.capacity ?? ""}
            />
          </div>
          <div className="field full">
            <label htmlFor="event-image">Imagen</label>
            <input
              id="event-image"
              type="file"
              accept="image/*"
              onChange={(e) => upload(e.target.files?.[0])}
            />
            <small>{imageUrl || "Sin imagen"}</small>
          </div>
          <div className="check-row">
            <label>
              <input
                name="active"
                type="checkbox"
                defaultChecked={editing?.active ?? true}
              />{" "}
              Visible
            </label>
          </div>
          {error && <div className="admin-form-error">{error}</div>}
          <div className="form-actions">
            <button className="admin-button" disabled={saving}>
              {saving ? "Guardando…" : "Guardar experiencia"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
