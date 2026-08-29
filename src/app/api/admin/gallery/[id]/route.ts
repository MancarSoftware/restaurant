import { galleryImagePatchSchema } from "@/features/gallery/schema";
import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertSameOrigin, handleApiError, ok, parseJson } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const image = await db.galleryImage.update({
      where: { id },
      data: galleryImagePatchSchema.parse(await parseJson(request)),
    });
    await writeAudit({
      userId: user.id,
      action: "GALLERY_IMAGE_UPDATED",
      entity: "GalleryImage",
      entityId: id,
    });
    return ok(image);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(["ADMIN"]);
    const { id } = await params;
    await db.galleryImage.delete({ where: { id } });
    await writeAudit({
      userId: user.id,
      action: "GALLERY_IMAGE_DELETED",
      entity: "GalleryImage",
      entityId: id,
    });
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
