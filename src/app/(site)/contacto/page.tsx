import type { Metadata } from "next";
import { ContactForm } from "@/features/contact/contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ubicación, horario y contacto de Casa Bruma en Guayaquil.",
};

export default function ContactPage() {
  return (
    <>
      <header className="page-hero">
        <div>
          <p className="eyebrow">Hablemos</p>
          <h1>
            Encontrar
            <br />
            la casa.
          </h1>
        </div>
        <p>
          Para reservas inmediatas, grupos o requerimientos especiales, nuestro
          equipo está disponible por teléfono y WhatsApp.
        </p>
      </header>
      <section className="contact-grid">
        <div className="contact-info">
          <p className="eyebrow">Casa Bruma · Guayaquil</p>
          <h2>Una mesa entre la ciudad y el fuego.</h2>
          <div className="contact-lines">
            <div className="contact-line">
              <span>Dirección</span>
              <span>
                Av. del Bombero 481, Los Ceibos
                <br />
                Guayaquil, Ecuador
              </span>
            </div>
            <div className="contact-line">
              <span>Teléfono</span>
              <a href="tel:+59346001842">+593 4 600 1842</a>
            </div>
            <div className="contact-line">
              <span>WhatsApp</span>
              <a
                href="https://wa.me/593998401260"
                target="_blank"
                rel="noreferrer"
              >
                +593 99 840 1260 ↗
              </a>
            </div>
            <div className="contact-line">
              <span>Horario</span>
              <span>
                Mar — Vie · 19:00 — 23:00
                <br />
                Sábado · 13:00 — 23:30
              </span>
            </div>
          </div>
        </div>
        <iframe
          className="map-frame"
          title="Mapa de Casa Bruma"
          loading="lazy"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-79.934%2C-2.18%2C-79.91%2C-2.155&layer=mapnik&marker=-2.168126%2C-79.921726"
        />
      </section>
      <section className="form-shell">
        <aside className="form-aside" style={{ background: "#11110f" }}>
          <div className="form-aside-copy">
            <p className="eyebrow">Consultas</p>
            <h2>Cuéntanos qué imaginas.</h2>
          </div>
        </aside>
        <div className="form-panel">
          <p className="eyebrow">Contacto directo</p>
          <h1>Escríbenos.</h1>
          <p>
            Eventos privados, alianzas, prensa o cualquier pregunta sobre la
            experiencia.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
