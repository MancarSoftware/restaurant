import { menuItemSchema } from "@/features/menu/schema";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

export async function GET() {
  try {
    await requireUser();
    return ok(
      await db.menuItem.findMany({
        orderBy: [
          { category: { displayOrder: "asc" } },
          { displayOrder: "asc" },
        ],
        include: { category: true, dietaryTags: true },
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
    const input = menuItemSchema.parse(await parseJson(request));
    const { dietaryTagIds, ...data } = input;
    const item = await db.menuItem.create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
        dietaryTags: { connect: dietaryTagIds.map((id) => ({ id })) },
      },
      include: { category: true, dietaryTags: true },
    });
    await writeAudit({
      userId: user.id,
      action: "MENU_ITEM_CREATED",
      entity: "MenuItem",
      entityId: item.id,
    });
    return ok(item, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
