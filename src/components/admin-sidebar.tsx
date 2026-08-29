"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Images,
  LayoutList,
  LogOut,
  Mail,
  Settings,
  Shapes,
  Sparkles,
  Users,
} from "lucide-react";

const links = [
  ["/admin", "Resumen", ChartNoAxesColumnIncreasing],
  ["/admin/menu", "Carta", LayoutList],
  ["/admin/categorias", "Categorías", Shapes],
  ["/admin/reservas", "Reservas", CalendarDays],
  ["/admin/galeria", "Galería", Images],
  ["/admin/eventos", "Experiencias", Sparkles],
  ["/admin/mensajes", "Mensajes", Mail],
  ["/admin/ajustes", "Ajustes", Settings],
  ["/admin/usuarios", "Usuarios", Users],
] as const;

export function AdminSidebar({
  user,
}: {
  user: { name: string; role: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand">
        <span className="brand-symbol">B</span>
        <span>Casa Bruma</span>
      </Link>
      <nav className="admin-nav" aria-label="Administración">
        {links.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="admin-user">
        <strong>{user.name}</strong>
        <br />
        <span>{user.role}</span>
        <br />
        <button
          className="admin-button secondary"
          style={{ marginTop: ".75rem" }}
          onClick={logout}
        >
          <LogOut size={14} />
          Salir
        </button>
      </div>
    </aside>
  );
}
