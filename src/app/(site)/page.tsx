import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [restaurant, featured] = await Promise.all([
    db.restaurant.findFirst({
      include: { openingHours: { orderBy: { dayOfWeek: "asc" } } },
    }),
    db.menuItem.findMany({
      where: { featured: true, available: true },
      orderBy: { displayOrder: "asc" },
      take: 4,
      include: { category: true, dietaryTags: true },
    }),
  ]);

  const jsonLd = restaurant
    ? {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: restaurant.name,
        description: restaurant.description,
        image: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/images/hero-kitchen-v2.webp`,
        telephone: restaurant.phone,
        email: restaurant.email,
        priceRange: "$$$$",
        servesCuisine: ["Ecuadorian", "Contemporary"],
        address: {
          "@type": "PostalAddress",
          streetAddress: restaurant.address,
          addressLocality: restaurant.city,
          addressCountry: "EC",
        },
        geo:
          restaurant.latitude && restaurant.longitude
            ? {
                "@type": "GeoCoordinates",
                latitude: Number(restaurant.latitude),
                longitude: Number(restaurant.longitude),
              }
            : undefined,
        acceptsReservations: true,
        url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="hero-kicker">
            <span aria-hidden="true" /> Cocina ecuatoriana · Guayaquil
          </p>
          <h1 id="hero-title" className="hero-title">
            <span>Ecuador</span>
            <span>se sirve</span>
            <em>caliente.</em>
          </h1>
          <div className="hero-bottom">
            <p className="hero-copy">
              Producto cercano, fuego alto y una cocina abierta que convierte el
              territorio en una noche para compartir.
            </p>
            <div className="hero-actions">
              <Link href="/reservar" className="button">
                Buscar una mesa <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/menu" className="button secondary">
                Descubrir la carta
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-media">
          <Image
            src="/images/hero-kitchen-v2.webp"
            alt="Cocineros terminando una corvina con maduro en el pase de Casa Bruma"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 48vw"
          />
          <div className="hero-photo-label">
            <span>01 / El pase</span>
            <span>Servicio de noche</span>
          </div>
        </div>
        <div className="hero-meta">
          <div>
            <small>Esta noche</small>
            <span>19:00 — 23:00</span>
          </div>
          <div>
            <small>Contacto</small>
            <span>+593 4 600 1842</span>
          </div>
        </div>
      </section>

      <div className="service-ticker" aria-label="Información de servicio">
        <span>Producto ecuatoriano</span>
        <span aria-hidden="true">✦</span>
        <span>Cocina abierta</span>
        <span aria-hidden="true">✦</span>
        <span>Martes a sábado</span>
        <span aria-hidden="true">✦</span>
        <span>Los Ceibos · GYE</span>
      </div>

      <section className="manifesto">
        <div className="container manifesto-grid">
          <div className="manifesto-index">01 · Lo que manda</div>
          <Reveal>
            <h2>
              Producto.
              <br />
              Fuego.
              <br />
              <em>Tiempo.</em>
            </h2>
            <div className="manifesto-note">
              <p>
                Compramos cerca y cocinamos sin disfraz. Pescadores,
                agricultores y artesanos marcan el ritmo de una carta que se
                mueve con el mercado.
              </p>
              <p>
                La técnica está para sacar sabor, no para dar una conferencia.
                Primero llega el plato. Después, si quieres, te contamos todo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="story">
        <div className="container story-grid">
          <Reveal className="story-image">
            <Image
              src="/images/chef-service-v2.webp"
              alt="Chef Valentina Cedeño durante el servicio en Casa Bruma"
              fill
              sizes="(max-width: 768px) 100vw, 52vw"
            />
            <span className="story-image-note">
              Valentina · Chef y fundadora
            </span>
          </Reveal>
          <Reveal className="story-copy" delay={0.12}>
            <p className="eyebrow">02 · La cocina tiene cara</p>
            <h2>
              Serios con el sabor.<span>No con nosotros mismos.</span>
            </h2>
            <p>
              Valentina cocina desde el recuerdo: humo de patio, naranjilla
              recién cortada y sal húmeda del estero. El punto de partida es
              cercano; la curiosidad no tiene frontera.
            </p>
            <p>
              La cocina está abierta porque no tenemos nada que esconder y sí
              mucho que compartir.
            </p>
            <div className="story-signature">
              “Que el sabor llegue antes que la explicación.”
            </div>
            <Link href="/nosotros" className="text-link">
              Conocer la casa <ArrowDownRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="featured-menu">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">03 · En la mesa ahora</p>
              <h2>La carta no se queda quieta.</h2>
            </div>
            <p>
              Cuatro platos del servicio de hoy. El resto cambia con el mar, la
              cosecha y las ganas del equipo.
            </p>
          </Reveal>
          <div className="featured-menu-layout">
            <Reveal className="featured-menu-photo">
              <Image
                src="/images/dish-beef-v2.webp"
                alt="Plato de res, raíces asadas y encurtidos de Casa Bruma"
                fill
                sizes="(max-width: 768px) 100vw, 38vw"
              />
              <span>Fotografía de servicio · 20:47</span>
            </Reveal>
            <div className="menu-editorial">
              {featured.map((item, index) => (
                <Reveal key={item.id} className="menu-row" delay={index * 0.04}>
                  <span className="menu-number">0{index + 1}</span>
                  <h3>{item.name}</h3>
                  <div className="menu-row-copy">
                    {item.description}
                    <div className="menu-tags">
                      {item.dietaryTags.map((tag) => (
                        <span key={tag.id}>{tag.name}</span>
                      ))}
                    </div>
                  </div>
                  <span className="menu-row-price">
                    {formatCurrency(item.price.toString())}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="menu-action">
            <Link href="/menu" className="text-link">
              Ver carta completa <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="atmosphere">
        <Image
          src="/images/dining-room-v2.webp"
          alt="Comedor de Casa Bruma lleno durante el servicio de noche"
          fill
          sizes="100vw"
        />
        <Reveal className="atmosphere-copy">
          <p className="eyebrow">04 · Aquí se viene a estar</p>
          <h2>
            Mesa llena.
            <br />
            Cocina encendida.
          </h2>
          <Link href="/galeria" className="button secondary">
            Ver la casa
          </Link>
        </Reveal>
      </section>

      <section
        className="experience-strip"
        aria-label="Información del restaurante"
      >
        <article>
          <span>01 / Llegar</span>
          <h3>Los Ceibos</h3>
          <p>
            Av. del Bombero 481
            <br />
            Guayaquil, Ecuador
          </p>
          <Link href="/contacto" className="text-link">
            Cómo llegar
          </Link>
        </article>
        <article>
          <span>02 / Sentarse</span>
          <h3>Martes a sábado</h3>
          <p>
            Una experiencia de aproximadamente dos horas. Recomendamos reservar.
          </p>
          <Link href="/reservar" className="text-link">
            Elegir fecha
          </Link>
        </article>
        <article>
          <span>03 / Celebrar</span>
          <h3>Mesa del Fuego</h3>
          <p>Cenas privadas y experiencias para grupos de hasta 18 personas.</p>
          <Link href="/eventos" className="text-link">
            Ver experiencias
          </Link>
        </article>
      </section>
    </>
  );
}
