import { AdminSidebar } from "@/components/admin-sidebar";
import { requirePageUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePageUser();
  return (
    <div className="admin-body">
      <div className="admin-shell">
        <AdminSidebar user={user} />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
