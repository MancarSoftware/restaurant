import { MessagesManager } from "@/features/admin/messages-manager";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function MessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 250,
  });
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Mensajes.</h1>
          <p>Consultas del formulario público y seguimiento.</p>
        </div>
      </header>
      <MessagesManager
        messages={messages.map((message) => ({
          ...message,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString(),
        }))}
      />
    </>
  );
}
