import "server-only";

import { createHmac } from "node:crypto";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { AppError } from "@/lib/http";

function clientFingerprint(request: Request) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const raw = forwarded ?? request.headers.get("x-real-ip") ?? "unknown";
  return createHmac("sha256", env.IP_HASH_SECRET).update(raw).digest("hex");
}

export async function rateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const key = `${scope}:${clientFingerprint(request)}`;
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  const bucket = await db.$transaction(async (tx) => {
    const current = await tx.rateLimitBucket.findUnique({ where: { key } });
    if (!current || current.resetAt <= now) {
      return tx.rateLimitBucket.upsert({
        where: { key },
        update: { hits: 1, resetAt },
        create: { key, hits: 1, resetAt },
      });
    }
    return tx.rateLimitBucket.update({
      where: { key },
      data: { hits: { increment: 1 } },
    });
  });

  if (bucket.hits > limit) {
    throw new AppError(
      429,
      "Demasiados intentos. Espera unos minutos.",
      "RATE_LIMITED",
    );
  }
}
