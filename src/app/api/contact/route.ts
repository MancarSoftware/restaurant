import { contactSchema } from "@/features/contact/schema";
import { db } from "@/lib/db";
import {
  AppError,
  assertSameOrigin,
  handleApiError,
  ok,
  parseJson,
} from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await rateLimit(request, "contact", 5, 30 * 60 * 1000);
    const input = contactSchema.parse(await parseJson(request));
    if (input.website)
      throw new AppError(422, "Solicitud no válida.", "SPAM_DETECTED");
    const message = await db.contactMessage.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
      },
      select: { id: true, createdAt: true },
    });
    return ok(message, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
