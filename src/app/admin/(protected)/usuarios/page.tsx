import { UsersManager } from "@/features/admin/users-manager";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function UsersPage() {
  const current = await requirePageUser();
  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      lastLoginAt: true,
    },
  });
  if (current.role !== "ADMIN")
    return <p>No tienes permiso para administrar usuarios.</p>;
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Usuarios.</h1>
          <p>Acceso administrativo y privilegios por rol.</p>
        </div>
      </header>
      <UsersManager
        currentUserId={current.id}
        users={users.map((user) => ({
          ...user,
          lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
        }))}
      />
    </>
  );
}
