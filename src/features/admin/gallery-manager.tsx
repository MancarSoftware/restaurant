"use client";

import Image from "next/image";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Item = {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  visible: boolean;
};
export function GalleryManager({ images }: { images: Item[] }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const open = (item?: Item) => {
    setEditing(item ?? null);
    setImageUrl(item?.imageUrl ?? "");
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
    const payload = {
      title: form.get("title"),
      caption: form.get("caption"),
      category: form.get("category"),
      imageUrl,
      altText: form.get("altText"),
      displayOrder: Number(form.get("displayOrder")),
      visible: form.has("visible"),
    };
    const response = await fetch(
      editing ? `/api/admin/gallery/${editing.id}` : "/api/admin/gallery",
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
  const remove = async (item: Item) => {
    if (!confirm(`¿Eliminar “${item.title}” de la galería?`)) return;
    await fetch(`/api/admin/gallery/${item.id}`, { method: "DELETE" });
    router.refresh();
  };
  return (
    <>
      <div className="admin-toolbar">
        <button className="admin-button" onClick={() => open()}>
          <Plus size={14} />
          Nueva imagen
        </button>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Orden</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {images.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ position: "relative", width: 80, height: 55 }}>
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="80px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <br />
                  <small>{item.altText}</small>
                </td>
                <td>{item.category}</td>
                <td>{item.displayOrder}</td>
                <td>
                  <span
                    className={`status ${item.visible ? "active" : "inactive"}`}
                  >
                    {item.visible ? "Visible" : "Oculta"}
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
          <h2>{editing ? "Editar imagen" : "Nueva imagen"}</h2>
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
            <label htmlFor="gallery-title">Título</label>
            <input
              id="gallery-title"
              name="title"
              defaultValue={editing?.title}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="gallery-category">Categoría</label>
            <input
              id="gallery-category"
              name="category"
              defaultValue={editing?.category}
              required
            />
          </div>
          <div className="field full">
            <label htmlFor="gallery-alt">Texto alternativo</label>
            <input
              id="gallery-alt"
              name="altText"
              defaultValue={editing?.altText}
              required
            />
          </div>
          <div className="field full">
            <label htmlFor="gallery-caption">Pie de foto</label>
            <textarea
              id="gallery-caption"
              name="caption"
              defaultValue={editing?.caption ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="gallery-order">Orden</label>
            <input
              id="gallery-order"
              name="displayOrder"
              type="number"
              min="0"
              defaultValue={editing?.displayOrder ?? 0}
            />
          </div>
          <div className="field">
            <label htmlFor="gallery-file">Archivo</label>
            <input
              id="gallery-file"
              type="file"
              accept="image/*"
              onChange={(e) => upload(e.target.files?.[0])}
              required={!editing}
            />
            <small>{imageUrl || "Selecciona una imagen"}</small>
          </div>
          <div className="check-row">
            <label>
              <input
                type="checkbox"
                name="visible"
                defaultChecked={editing?.visible ?? true}
              />{" "}
              Visible
            </label>
          </div>
          {error && <div className="admin-form-error">{error}</div>}
          <div className="form-actions">
            <button className="admin-button" disabled={saving || !imageUrl}>
              {saving ? "Guardando…" : "Guardar imagen"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
