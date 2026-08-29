import { db } from "@/lib/db";
import { handleApiError, ok } from "@/lib/http";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const featured = url.searchParams.get("featured") === "true";

    const categories = await db.menuCategory.findMany({
      where: { active: true, ...(category ? { slug: category } : {}) },
      orderBy: { displayOrder: "asc" },
      include: {
        items: {
          where: { available: true, ...(featured ? { featured: true } : {}) },
          orderBy: { displayOrder: "asc" },
          include: { dietaryTags: true },
        },
      },
    });

    return ok(categories);
  } catch (error) {
    return handleApiError(error);
  }
}
