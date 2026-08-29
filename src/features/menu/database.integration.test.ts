import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const slug = `vitest-${Date.now()}`;

describe("menu database integration", () => {
  afterAll(async () => {
    await prisma.menuItem.deleteMany({ where: { slug } });
    await prisma.menuCategory.deleteMany({ where: { slug } });
    await prisma.$disconnect();
  });
  it("creates, reads and updates a menu item with its category", async () => {
    const category = await prisma.menuCategory.create({
      data: { name: "Vitest", slug, displayOrder: 999 },
    });
    const item = await prisma.menuItem.create({
      data: {
        name: "Plato de prueba",
        slug,
        description: "Descripción real para probar persistencia.",
        price: 19.5,
        categoryId: category.id,
      },
    });
    const updated = await prisma.menuItem.update({
      where: { id: item.id },
      data: { featured: true },
      include: { category: true },
    });
    expect(updated.featured).toBe(true);
    expect(updated.category.slug).toBe(slug);
  });
});
