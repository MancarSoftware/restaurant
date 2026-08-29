"use client";

import { MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};
export function MessagesManager({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const mark = async (id: string, read: boolean) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    router.refresh();
  };
  return (
    <div className="admin-card admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Remitente</th>
            <th>Asunto y mensaje</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((item) => (
            <tr
              key={item.id}
              style={{ background: item.read ? undefined : "#fffaf0" }}
            >
              <td>{new Date(item.createdAt).toLocaleDateString("es-EC")}</td>
              <td>
                <strong>{item.name}</strong>
                <br />
                <a href={`mailto:${item.email}`}>{item.email}</a>
                {item.phone && (
                  <>
                    <br />
                    <a href={`tel:${item.phone}`}>{item.phone}</a>
                  </>
                )}
              </td>
              <td>
                <strong>{item.subject}</strong>
                <p style={{ maxWidth: 540, margin: ".4rem 0 0" }}>
                  {item.message}
                </p>
              </td>
              <td>
                <span
                  className={`status ${item.read ? "completed" : "pending"}`}
                >
                  {item.read ? "Leído" : "Nuevo"}
                </span>
              </td>
              <td>
                <button
                  className="admin-button secondary"
                  onClick={() => mark(item.id, !item.read)}
                >
                  <MailCheck size={13} />
                  {item.read ? "Marcar nuevo" : "Marcar leído"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
