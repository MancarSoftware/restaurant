import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-label">Visítanos</p>
          <address>
            Av. del Bombero 481
            <br />
            Los Ceibos, Guayaquil
          </address>
        </div>
        <div>
          <p className="footer-label">Horario</p>
          <p>
            Mar — Vie · 19:00 — 23:00
            <br />
            Sábado · 13:00 — 23:30
          </p>
        </div>
        <div>
          <p className="footer-label">Conversemos</p>
          <a href="tel:+59346001842">+593 4 600 1842</a>
          <br />
          <a href="mailto:mesa@casabruma.ec">mesa@casabruma.ec</a>
        </div>
        <div>
          <p className="footer-label">Sigue la bruma</p>
          <a
            href="https://instagram.com/casabruma"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <br />
          <a href="https://wa.me/593998401260" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Casa Bruma</span>
        <Link href="/privacidad">Privacidad</Link>
        <Link href="/admin/login">Administración</Link>
      </div>
    </footer>
  );
}
