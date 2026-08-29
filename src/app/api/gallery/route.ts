import { db } from "@/lib/db";
import { handleApiError, ok } from "@/lib/http";

export async function GET() {
  try {
    return ok(
      await db.galleryImage.findMany({
        where: { visible: true },
        orderBy: { displayOrder: "asc" },
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
