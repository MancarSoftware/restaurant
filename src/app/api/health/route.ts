import { db } from "@/lib/db";
import { handleApiError, ok } from "@/lib/http";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return ok({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
