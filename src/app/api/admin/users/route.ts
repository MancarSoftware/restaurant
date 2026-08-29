import { hash } from "bcryptjs";
import { z } from "zod";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z
    .email()
    .max(160)
    .transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(200),
  role: z.enum(["ADMIN", "EDITOR"]),
});

export async function GET() {
  try {
    await requireUser(["ADMIN"]);
    return ok(
      await db.user.findMany({
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const current = await requireUser(["ADMIN"]);
    const input = schema.parse(await parseJson(request));
    const user = await db.user.create({
      data: {
        name: input.name,
        email: input.email,
        role: input.role,
        passwordHash: await hash(input.password, 12),
      },
      select: { id: true, name: true, email: true, role: true, active: true },
    });
    await writeAudit({
      userId: current.id,
      action: "USER_CREATED",
      entity: "User",
      entityId: user.id,
    });
    return ok(user, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
