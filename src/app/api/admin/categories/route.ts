import { categorySchema } from "@/features/menu/schema";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

export async function GET() {
  try {
    await requireUser();
    return ok(
      await db.menuCategory.findMany({
        orderBy: { displayOrder: "asc" },
        include: { _count: { select: { items: true } } },
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const category = await db.menuCategory.create({
      data: categorySchema.parse(await parseJson(request)),
    });
    await writeAudit({
      userId: user.id,
      action: "CATEGORY_CREATED",
      entity: "MenuCategory",
      entityId: category.id,
    });
    return ok(category, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
