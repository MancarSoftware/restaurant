import { compare } from "bcryptjs";
import { z } from "zod";

import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  AppError,
  assertSameOrigin,
  handleApiError,
  ok,
  parseJson,
} from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.email().max(160),
  password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await rateLimit(request, "login", 7, 15 * 60 * 1000);
    const input = schema.parse(await parseJson(request));
    const user = await db.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    const valid =
      user && user.active
        ? await compare(input.password, user.passwordHash)
        : false;
    if (!user || !valid) {
      console.warn("auth.login_failed");
      throw new AppError(
        401,
        "Correo o contraseña incorrectos.",
        "INVALID_CREDENTIALS",
      );
    }
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    await createSession(user.id);
    return ok({ id: user.id, name: user.name, role: user.role });
  } catch (error) {
    return handleApiError(error);
  }
}
