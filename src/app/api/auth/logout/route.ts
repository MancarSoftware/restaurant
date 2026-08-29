import { destroySession } from "@/lib/auth";
import { assertSameOrigin, handleApiError, ok } from "@/lib/http";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await destroySession();
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
