import { menuItemPatchSchema } from "@/features/menu/schema";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const input = menuItemPatchSchema.parse(await parseJson(request));
    const { dietaryTagIds, ...data } = input;
    const item = await db.menuItem.update({
      where: { id },
      data: {
        ...data,
        imageUrl: data.imageUrl === "" ? null : data.imageUrl,
        ...(dietaryTagIds
          ? {
              dietaryTags: {
                set: dietaryTagIds.map((tagId) => ({ id: tagId })),
              },
            }
          : {}),
      },
      include: { category: true, dietaryTags: true },
    });
    await writeAudit({
      userId: user.id,
      action: "MENU_ITEM_UPDATED",
      entity: "MenuItem",
      entityId: id,
    });
    return ok(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(["ADMIN"]);
    const { id } = await params;
    await db.menuItem.delete({ where: { id } });
    await writeAudit({
      userId: user.id,
      action: "MENU_ITEM_DELETED",
      entity: "MenuItem",
      entityId: id,
    });
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
