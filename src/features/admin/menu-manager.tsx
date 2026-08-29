"use client";

import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { formatCurrency, slugify } from "@/lib/utils";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };
type Item = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  featured: boolean;
  seasonal: boolean;
  chefRecommended: boolean;
  displayOrder: number;
  category: Category;
  dietaryTags: Tag[];
};

export function MenuManager({
  items,
  categories,
  tags,
}: {
  items: Item[];
  categories: Category[];
  tags: Tag[];
}) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
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
      setError(result.error?.message ?? "No se pudo subir la imagen.");
      return;
    }
    setImageUrl(result.data?.url ?? "");
  };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    const payload = {
      name,
      slug: String(form.get("slug") || slugify(name)),
      description: form.get("description"),
      price: Number(form.get("price")),
      categoryId: form.get("categoryId"),
      imageUrl,
      displayOrder: Number(form.get("displayOrder")),
      available: form.has("available"),
      featured: form.has("featured"),
      seasonal: form.has("seasonal"),
      chefRecommended: form.has("chefRecommended"),
      dietaryTagIds: form.getAll("dietaryTagIds"),
    };
    const response = await fetch(
      editing ? `/api/admin/menu/${editing.id}` : "/api/admin/menu",
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
    if (
      !window.confirm(
        `¿Eliminar “${item.name}”? Esta acción no se puede deshacer.`,
      )
    )
      return;
    const response = await fetch(`/api/admin/menu/${item.id}`, {
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
  const toggle = async (item: Item) => {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    router.refresh();
  };
  return (
    <>
      <div className="admin-toolbar">
        <button className="admin-button" onClick={() => open()}>
          <Plus size={15} />
          Nuevo plato
        </button>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Plato</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Etiquetas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                  <br />
                  <small>
                    {item.description.slice(0, 85)}
                    {item.description.length > 85 ? "…" : ""}
                  </small>
                </td>
                <td>{item.category.name}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>
                  <span
                    className={`status ${item.available ? "active" : "inactive"}`}
                  >
                    {item.available ? "Disponible" : "Oculto"}
                  </span>
                </td>
                <td>
                  {[
                    item.featured && "Destacado",
                    item.seasonal && "Temporada",
                    item.chefRecommended && "Chef",
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
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
                      className="admin-button secondary"
                      onClick={() => toggle(item)}
                    >
                      {item.available ? "Ocultar" : "Activar"}
                    </button>
                    <button
                      className="admin-button danger"
                      onClick={() => remove(item)}
                    >
                      <Trash2 size={13} />
                      <span className="sr-only">Eliminar {item.name}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog className="modal" ref={dialog}>
        <div className="modal-header">
          <h2>{editing ? "Editar plato" : "Nuevo plato"}</h2>
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
            <label htmlFor="menu-name">Nombre</label>
            <input
              id="menu-name"
              name="name"
              defaultValue={editing?.name}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="menu-slug">Slug</label>
            <input
              id="menu-slug"
              name="slug"
              defaultValue={editing?.slug}
              placeholder="Se genera desde el nombre"
            />
          </div>
          <div className="field full">
            <label htmlFor="menu-description">Descripción</label>
            <textarea
              id="menu-description"
              name="description"
              defaultValue={editing?.description}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="menu-price">Precio</label>
            <input
              id="menu-price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={editing?.price}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="menu-category">Categoría</label>
            <select
              id="menu-category"
              name="categoryId"
              defaultValue={editing?.category.id}
              required
            >
              <option value="">Elegir</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="menu-order">Orden</label>
            <input
              id="menu-order"
              name="displayOrder"
              type="number"
              min="0"
              defaultValue={editing?.displayOrder ?? 0}
            />
          </div>
          <div className="field">
            <label htmlFor="menu-image">Imagen</label>
            <input
              id="menu-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => upload(event.target.files?.[0])}
            />
            <small>{imageUrl || "Sin imagen"}</small>
          </div>
          <div className="check-row">
            <label>
              <input
                type="checkbox"
                name="available"
                defaultChecked={editing?.available ?? true}
              />{" "}
              Disponible
            </label>
            <label>
              <input
                type="checkbox"
                name="featured"
                defaultChecked={editing?.featured}
              />{" "}
              Destacado
            </label>
            <label>
              <input
                type="checkbox"
                name="seasonal"
                defaultChecked={editing?.seasonal}
              />{" "}
              Temporada
            </label>
            <label>
              <input
                type="checkbox"
                name="chefRecommended"
                defaultChecked={editing?.chefRecommended}
              />{" "}
              Recomendación chef
            </label>
          </div>
          <div className="field full">
            <label>Indicadores dietarios</label>
            <div className="check-row">
              {tags.map((tag) => (
                <label key={tag.id}>
                  <input
                    type="checkbox"
                    name="dietaryTagIds"
                    value={tag.id}
                    defaultChecked={editing?.dietaryTags.some(
                      (current) => current.id === tag.id,
                    )}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
          {error && (
            <div className="admin-form-error" role="alert">
              {error}
            </div>
          )}
          <div className="form-actions">
            <button className="admin-button" type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Guardar plato"}
            </button>
            {imageUrl && (
              <span>
                <ImagePlus size={14} /> Imagen lista
              </span>
            )}
          </div>
        </form>
      </dialog>
    </>
  );
}
