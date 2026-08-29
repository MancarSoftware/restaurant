import { CategoriesManager } from "@/features/admin/categories-manager";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function CategoriesPage() {
  const categories = await db.menuCategory.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { items: true } } },
  });
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Categorías.</h1>
          <p>Estructura y orden de la carta pública.</p>
        </div>
      </header>
      <CategoriesManager
        categories={categories.map((category) => ({
          ...category,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
        }))}
      />
    </>
  );
}
