import { galleryImageSchema } from "@/features/gallery/schema";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

export async function GET() {
  try {
    await requireUser();
    return ok(
      await db.galleryImage.findMany({ orderBy: { displayOrder: "asc" } }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const image = await db.galleryImage.create({
      data: galleryImageSchema.parse(await parseJson(request)),
    });
    await writeAudit({
      userId: user.id,
      action: "GALLERY_IMAGE_CREATED",
      entity: "GalleryImage",
      entityId: image.id,
    });
    return ok(image, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
