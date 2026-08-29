"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["/menu", "Carta"],
  ["/nosotros", "La casa"],
  ["/galeria", "Imágenes"],
  ["/eventos", "Experiencias"],
  ["/contacto", "Contacto"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Casa Bruma, inicio">
          <span className="brand-symbol" aria-hidden="true">
            CB
          </span>
          <span className="brand-name">
            Casa Bruma <small>Cocina abierta · GYE</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/reservar" className="header-reserve">
          Reservar <span aria-hidden="true">↗</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <div
          id="mobile-menu"
          className={`mobile-menu ${open ? "is-open" : ""}`}
          aria-hidden={!open}
        >
          <nav aria-label="Navegación móvil">
            {links.map(([href, label], index) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-meta">
            <a href="tel:+59346001842">+593 4 600 1842</a>
            <span>Mar — Sáb · Guayaquil</span>
          </div>
        </div>
      </header>
      <Link href="/reservar" className="mobile-booking-bar">
        Reservar una mesa <span>Mar — Sáb</span>
      </Link>
    </>
  );
}
