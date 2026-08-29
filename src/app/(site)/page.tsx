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
        image: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/images/hero-fish.webp`,
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
        <div className="hero-media">
          <Image
            src="/images/hero-fish.webp"
            alt="Corvina costrada con cacao y maduro en cerámica negra"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-content">
          <p className="hero-kicker">Cocina ecuatoriana de autor · Guayaquil</p>
          <h1 id="hero-title" className="hero-title">
            Ecuador, <em>a fuego lento.</em>
          </h1>
          <div className="hero-bottom">
            <p className="hero-copy">
              Un recorrido íntimo por manglares, montañas y memorias, traducido
              en una mesa contemporánea por la chef Valentina Cedeño.
            </p>
            <div className="hero-actions">
              <Link href="/reservar" className="button">
                Reservar mesa
              </Link>
              <Link href="/menu" className="button secondary">
                Descubrir la carta
              </Link>
            </div>
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

      <section className="manifesto">
        <div className="container manifesto-grid">
          <div className="manifesto-index">01 · La mirada</div>
          <Reveal>
            <h2>
              No cocinamos un país. <em>Escuchamos sus paisajes.</em>
            </h2>
            <div className="manifesto-note">
              <p>
                Cada plato nace de una relación directa con productores,
                pescadores y artesanos. El territorio no es una consigna: es la
                materia prima.
              </p>
              <p>
                La carta cambia con la estación, el mar y el mercado. La técnica
                acompaña; el ingrediente conserva la voz principal.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="story">
        <div className="container story-grid">
          <Reveal className="story-image">
            <Image
              src="/images/chef-valentina.webp"
              alt="Chef Valentina Cedeño terminando un plato en el pase"
              fill
              sizes="(max-width: 768px) 100vw, 52vw"
            />
          </Reveal>
          <Reveal className="story-copy" delay={0.12}>
            <p className="eyebrow">La chef · Valentina Cedeño</p>
            <h2>
              Precisión <span>sin perder raíz.</span>
            </h2>
            <p>
              Valentina cocina desde el recuerdo: el humo del patio, la acidez
              de una naranjilla recién cortada, la sal húmeda del estero. Su
              lenguaje es contemporáneo, pero su punto de partida siempre es
              cercano.
            </p>
            <p>
              En Casa Bruma, la cocina abierta convierte cada servicio en un
              diálogo entre oficio, producto y tiempo.
            </p>
            <div className="story-signature">
              “Queremos que el sabor llegue antes que la explicación.”
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
              <p className="eyebrow">02 · Platos de la casa</p>
              <h2>El menú como paisaje.</h2>
            </div>
            <p>
              Una carta breve y en movimiento. Cocciones al fuego, fermentos
              vivos y productos ecuatorianos en su mejor momento.
            </p>
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
          <div className="menu-action">
            <Link href="/menu" className="text-link">
              Ver carta completa <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="atmosphere">
        <Image
          src="/images/restaurant-interior.webp"
          alt="Comedor íntimo de Casa Bruma iluminado por una chimenea"
          fill
          sizes="100vw"
        />
        <Reveal className="atmosphere-copy">
          <p className="eyebrow">03 · La atmósfera</p>
          <h2>Una casa hecha para quedarse.</h2>
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
