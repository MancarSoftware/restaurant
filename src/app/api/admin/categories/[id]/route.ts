import { categoryPatchSchema } from "@/features/menu/schema";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  AppError,
  assertSameOrigin,
  handleApiError,
  ok,
  parseJson,
} from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const category = await db.menuCategory.update({
      where: { id },
      data: categoryPatchSchema.parse(await parseJson(request)),
    });
    await writeAudit({
      userId: user.id,
      action: "CATEGORY_UPDATED",
      entity: "MenuCategory",
      entityId: id,
    });
    return ok(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(["ADMIN"]);
    const { id } = await params;
    const count = await db.menuItem.count({ where: { categoryId: id } });
    if (count > 0)
      throw new AppError(
        409,
        "Reasigna o elimina los platos antes de borrar esta categoría.",
        "CATEGORY_NOT_EMPTY",
      );
    await db.menuCategory.delete({ where: { id } });
    await writeAudit({
      userId: user.id,
      action: "CATEGORY_DELETED",
      entity: "MenuCategory",
      entityId: id,
    });
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
