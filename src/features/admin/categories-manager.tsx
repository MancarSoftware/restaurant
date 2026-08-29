"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { slugify } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  active: boolean;
  _count: { items: number };
};

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const open = (category?: Category) => {
    setEditing(category ?? null);
    setError("");
    dialog.current?.showModal();
  };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    const payload = {
      name,
      slug: String(form.get("slug") || slugify(name)),
      description: form.get("description"),
      displayOrder: Number(form.get("displayOrder")),
      active: form.has("active"),
    };
    const response = await fetch(
      editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories",
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
  const remove = async (category: Category) => {
    if (!confirm(`¿Eliminar “${category.name}”?`)) return;
    const response = await fetch(`/api/admin/categories/${category.id}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as { error?: { message?: string } };
    if (!response.ok) {
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
          Nueva categoría
        </button>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Categoría</th>
              <th>Platos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.displayOrder}</td>
                <td>
                  <strong>{category.name}</strong>
                  <br />
                  <small>{category.description}</small>
                </td>
                <td>{category._count.items}</td>
                <td>
                  <span
                    className={`status ${category.active ? "active" : "inactive"}`}
                  >
                    {category.active ? "Activa" : "Oculta"}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button
                      className="admin-button secondary"
                      onClick={() => open(category)}
                    >
                      <Pencil size={13} />
                      Editar
                    </button>
                    <button
                      className="admin-button danger"
                      disabled={category._count.items > 0}
                      title={
                        category._count.items > 0
                          ? "Reasigna sus platos primero"
                          : "Eliminar"
                      }
                      onClick={() => remove(category)}
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
          <h2>{editing ? "Editar categoría" : "Nueva categoría"}</h2>
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
            <label htmlFor="category-name">Nombre</label>
            <input
              id="category-name"
              name="name"
              defaultValue={editing?.name}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="category-slug">Slug</label>
            <input
              id="category-slug"
              name="slug"
              defaultValue={editing?.slug}
            />
          </div>
          <div className="field full">
            <label htmlFor="category-description">Descripción</label>
            <textarea
              id="category-description"
              name="description"
              defaultValue={editing?.description ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="category-order">Orden</label>
            <input
              id="category-order"
              name="displayOrder"
              type="number"
              min="0"
              defaultValue={editing?.displayOrder ?? 0}
            />
          </div>
          <div className="check-row">
            <label>
              <input
                type="checkbox"
                name="active"
                defaultChecked={editing?.active ?? true}
              />{" "}
              Categoría visible
            </label>
          </div>
          {error && <div className="admin-form-error">{error}</div>}
          <div className="form-actions">
            <button className="admin-button" disabled={saving}>
              {saving ? "Guardando…" : "Guardar categoría"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
