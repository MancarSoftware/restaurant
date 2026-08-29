import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { handleApiError, ok } from "@/lib/http";

export async function GET() {
  try {
    await requireUser();
    return ok(
      await db.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 250,
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
