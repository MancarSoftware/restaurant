import { z } from "zod";
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
const schema = z.object({
  active: z.boolean().optional(),
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
});

export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const current = await requireUser(["ADMIN"]);
    const { id } = await params;
    const input = schema.parse(await parseJson(request));
    if (id === current.id && input.active === false) {
      throw new AppError(
        409,
        "No puedes desactivar tu propia cuenta.",
        "SELF_DEACTIVATION",
      );
    }
    const user = await db.user.update({
      where: { id },
      data: input,
      select: { id: true, name: true, email: true, role: true, active: true },
    });
    await writeAudit({
      userId: current.id,
      action: "USER_UPDATED",
      entity: "User",
      entityId: id,
    });
    return ok(user);
  } catch (error) {
    return handleApiError(error);
  }
}
