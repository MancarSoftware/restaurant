"use client";

import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  active: boolean;
  lastLoginAt: string | null;
};
export function UsersManager({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const create = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const result = (await response.json()) as { error?: { message?: string } };
    setSaving(false);
    if (!response.ok) {
      setError(result.error?.message ?? "No se pudo crear.");
      return;
    }
    dialog.current?.close();
    router.refresh();
  };
  const update = async (user: User, data: Partial<User>) => {
    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = (await response.json()) as { error?: { message?: string } };
    if (!response.ok) {
      alert(result.error?.message ?? "No se pudo actualizar.");
      return;
    }
    router.refresh();
  };
  return (
    <>
      <div className="admin-toolbar">
        <button
          className="admin-button"
          onClick={() => dialog.current?.showModal()}
        >
          <Plus size={14} />
          Nuevo usuario
        </button>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Último acceso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.name}</strong>
                  {user.id === currentUserId && <small> · tú</small>}
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      update(user, { role: e.target.value as User["role"] })
                    }
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="EDITOR">Editor</option>
                  </select>
                </td>
                <td>
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString("es-EC")
                    : "Nunca"}
                </td>
                <td>
                  <span
                    className={`status ${user.active ? "active" : "inactive"}`}
                  >
                    {user.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button
                    className="admin-button secondary"
                    disabled={user.id === currentUserId}
                    onClick={() => update(user, { active: !user.active })}
                  >
                    {user.active ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog ref={dialog} className="modal">
        <div className="modal-header">
          <h2>Nuevo usuario</h2>
          <button
            className="icon-button"
            onClick={() => dialog.current?.close()}
          >
            <X />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
        <form className="admin-form" onSubmit={create}>
          <div className="field">
            <label htmlFor="user-name">Nombre</label>
            <input id="user-name" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="user-email">Correo</label>
            <input id="user-email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="user-password">Contraseña temporal</label>
            <input
              id="user-password"
              name="password"
              type="password"
              minLength={12}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="user-role">Rol</label>
            <select id="user-role" name="role" defaultValue="EDITOR">
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          {error && <div className="admin-form-error">{error}</div>}
          <div className="form-actions">
            <button className="admin-button" disabled={saving}>
              {saving ? "Creando…" : "Crear usuario"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
