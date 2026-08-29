import "server-only";

import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export async function writeAudit(input: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  await db.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      metadata: input.metadata,
    },
  });
}
