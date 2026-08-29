export const runtime = "nodejs";

import { requireUser } from "@/lib/auth";
import { assertSameOrigin, handleApiError, ok, AppError } from "@/lib/http";
import { storeImage } from "@/lib/image-storage";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireUser();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File))
      throw new AppError(422, "Selecciona una imagen.", "FILE_REQUIRED");
    return ok({ url: await storeImage(file) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
