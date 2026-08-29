import { describe, expect, it } from "vitest";
import {
  reservationSchema,
  validateReservationDate,
} from "@/features/reservations/schema";

describe("reservation rules", () => {
  const valid = {
    customerName: "Ana Torres",
    email: "ANA@example.com",
    phone: "+593 99 000 0000",
    reservationDate: "2026-09-12",
    reservationTime: "20:00",
    guests: 2,
    specialRequests: "",
  };
  it("normalizes and validates a reservation", () =>
    expect(reservationSchema.parse(valid).email).toBe("ana@example.com"));
  it("rejects invalid guest counts", () =>
    expect(() => reservationSchema.parse({ ...valid, guests: 0 })).toThrow());
  it("rejects reservations before lead time", () =>
    expect(
      validateReservationDate(
        "2026-09-12",
        "20:00",
        2,
        new Date("2026-09-12T23:30:00Z"),
      ),
    ).toBe(false));
  it("accepts reservations after lead time", () =>
    expect(
      validateReservationDate(
        "2026-09-12",
        "20:00",
        2,
        new Date("2026-09-12T20:00:00Z"),
      ),
    ).toBe(true));
});
