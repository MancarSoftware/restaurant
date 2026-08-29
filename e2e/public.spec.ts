import { expect, test } from "@playwright/test";

test("visitor explores the restaurant and menu", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Ecuador/ })).toBeVisible();
  await page.getByRole("link", { name: /Descubrir la carta/i }).click();
  await expect(page).toHaveURL(/\/menu/);
  await expect(
    page.getByRole("heading", { name: /Mar y manglar/i }),
  ).toBeVisible();
});

test("visitor creates a reservation request", async ({ page }) => {
  await page.goto("/reservar");
  const future = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  await page.getByLabel("Nombre completo").fill("Prueba Playwright");
  await page.getByLabel("Correo").fill(`e2e-${Date.now()}@example.com`);
  await page.getByLabel("Teléfono").fill("+593 99 555 0101");
  await page.getByLabel("Fecha").fill(future);
  await page.getByLabel("Hora").selectOption("20:00");
  await page.getByRole("button", { name: "Solicitar reserva" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Recibimos tu solicitud",
  );
});

test("mobile navigation exposes primary destinations", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await expect(
    page.getByRole("link", { name: /Reservar una mesa/ }),
  ).toBeVisible();
});
