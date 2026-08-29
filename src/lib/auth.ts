import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { AppError } from "@/lib/http";

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(
    Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000,
  );

  await db.authSession.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (token) {
    await db.authSession.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(env.SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.authSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date() || !session.user.active)
    return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
}

export async function requireUser(roles?: UserRole[]) {
  const user = await getCurrentUser();
  if (!user)
    throw new AppError(401, "Inicia sesión para continuar.", "UNAUTHORIZED");
  if (roles && !roles.includes(user.role)) {
    throw new AppError(403, "No tienes permiso para esta acción.", "FORBIDDEN");
  }
  return user;
}

export async function requirePageUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
