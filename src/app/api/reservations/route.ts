import { db } from "@/lib/db";
import {
  reservationSchema,
  validateReservationDate,
} from "@/features/reservations/schema";
import {
  AppError,
  assertSameOrigin,
  handleApiError,
  ok,
  parseJson,
} from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { toDateOnly } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await rateLimit(request, "reservation", 6, 15 * 60 * 1000);
    const input = reservationSchema.parse(await parseJson(request));
    if (input.website)
      throw new AppError(422, "Solicitud no válida.", "SPAM_DETECTED");

    const restaurant = await db.restaurant.findFirst({
      select: { reservationLeadHours: true, maxPartySize: true },
    });
    if (!restaurant)
      throw new AppError(
        503,
        "Las reservas no están disponibles temporalmente.",
        "NOT_CONFIGURED",
      );
    if (input.guests > restaurant.maxPartySize) {
      throw new AppError(
        422,
        `Para grupos de más de ${restaurant.maxPartySize}, contáctanos directamente.`,
        "PARTY_TOO_LARGE",
      );
    }
    if (
      !validateReservationDate(
        input.reservationDate,
        input.reservationTime,
        restaurant.reservationLeadHours,
      )
    ) {
      throw new AppError(
        422,
        "La reserva debe hacerse con antelación y no puede estar en el pasado.",
        "INVALID_RESERVATION_DATE",
      );
    }

    const reservation = await db.reservation.create({
      data: {
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        reservationDate: toDateOnly(input.reservationDate),
        reservationTime: input.reservationTime,
        guests: input.guests,
        specialRequests: input.specialRequests || null,
      },
      select: {
        id: true,
        status: true,
        reservationDate: true,
        reservationTime: true,
      },
    });

    console.info("reservation.created", { reservationId: reservation.id });
    return ok(reservation, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
