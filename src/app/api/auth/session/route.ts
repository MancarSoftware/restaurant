import { getCurrentUser } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/http";

export async function GET() {
  try {
    return ok(await getCurrentUser());
  } catch (error) {
    return handleApiError(error);
  }
}
