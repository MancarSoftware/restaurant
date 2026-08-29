import { MenuManager } from "@/features/admin/menu-manager";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function AdminMenuPage() {
  const [rawItems, categories, tags] = await Promise.all([
    db.menuItem.findMany({
      orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }],
      include: { category: true, dietaryTags: true },
    }),
    db.menuCategory.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
    db.dietaryTag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  const items = rawItems.map((item) => ({
    ...item,
    price: Number(item.price),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Carta.</h1>
          <p>Platos, precios, disponibilidad e indicadores dietarios.</p>
        </div>
      </header>
      <MenuManager items={items} categories={categories} tags={tags} />
    </>
  );
}
