import { describe, expect, it } from "vitest";
import { contactSchema } from "@/features/contact/schema";

describe("contact schema", () => {
  it("accepts a useful message", () =>
    expect(
      contactSchema.parse({
        name: "Luis Vega",
        email: "luis@example.com",
        subject: "Evento privado",
        message: "Quisiera consultar disponibilidad para una cena.",
      }).email,
    ).toBe("luis@example.com"));
  it("rejects honeypot content", () =>
    expect(() =>
      contactSchema.parse({
        name: "Bot",
        email: "bot@example.com",
        subject: "Spam",
        message: "Mensaje suficientemente largo",
        website: "https://spam.invalid",
      }),
    ).toThrow());
});
