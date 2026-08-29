import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    await requireUser();
    const { id } = await params;
    const input = z
      .object({ read: z.boolean() })
      .parse(await parseJson(request));
    return ok(await db.contactMessage.update({ where: { id }, data: input }));
  } catch (error) {
    return handleApiError(error);
  }
}
