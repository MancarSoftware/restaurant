import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Carta",
  description:
    "La carta de Casa Bruma: cocina ecuatoriana contemporánea, fuego y producto de temporada.",
};

export default async function MenuPage() {
  const categories = await db.menuCategory.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
    include: {
      items: {
        where: { available: true },
        orderBy: { displayOrder: "asc" },
        include: { dietaryTags: true },
      },
    },
  });
  return (
    <>
      <header className="page-hero">
        <div>
          <p className="eyebrow">Carta de temporada</p>
          <h1>
            El territorio
            <br />
            en la mesa.
          </h1>
        </div>
        <p>
          La carta cambia con el mercado y la temporada. Pregunta a nuestro
          equipo por el recorrido de degustación y los maridajes disponibles.
        </p>
      </header>
      <nav className="menu-filter" aria-label="Categorías de la carta">
        {categories.map((category) => (
          <a key={category.id} href={`#${category.slug}`}>
            {category.name}
          </a>
        ))}
      </nav>
      <div className="menu-page">
        <div className="container">
          {categories.map((category) => (
            <section
              className="menu-category"
              id={category.slug}
              key={category.id}
            >
              <div>
                <h2>{category.name}</h2>
                <p className="category-description">{category.description}</p>
              </div>
              <div>
                {category.items.length === 0 ? (
                  <p>Esta sección volverá pronto.</p>
                ) : (
                  category.items.map((item) => (
                    <article className="full-menu-item" key={item.id}>
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                      </div>
                      <span className="price">
                        {formatCurrency(item.price.toString())}
                      </span>
                      <div className="menu-tags">
                        {item.chefRecommended && (
                          <span>Recomendación de la chef</span>
                        )}
                        {item.seasonal && <span>Temporada</span>}
                        {item.dietaryTags.map((tag) => (
                          <span key={tag.id}>{tag.name}</span>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
