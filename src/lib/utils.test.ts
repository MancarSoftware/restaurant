import { describe, expect, it } from "vitest";
import { formatCurrency, slugify, toDateOnly } from "@/lib/utils";

describe("utils", () => {
  it("normalizes accents and punctuation in slugs", () =>
    expect(slugify("  Cacao, Sal & Limón  ")).toBe("cacao-sal-limon"));
  it("formats Ecuadorian USD values", () =>
    expect(formatCurrency(32)).toContain("32"));
  it("creates UTC date-only values", () =>
    expect(toDateOnly("2026-09-10").toISOString()).toBe(
      "2026-09-10T00:00:00.000Z",
    ));
});
