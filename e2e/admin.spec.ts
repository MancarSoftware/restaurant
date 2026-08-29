import { expect, test } from "@playwright/test";

test("admin logs in and manages a menu item", async ({ page }) => {
  await page.goto("/admin/login");
  await page
    .getByLabel("Correo")
    .fill(process.env.SEED_ADMIN_EMAIL ?? "admin@casabruma.local");
  await page
    .getByLabel("Contraseña")
    .fill(process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe-Local-2026!");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "Operación de hoy." }),
  ).toBeVisible();
  await page.goto("/admin/menu");
  await page.getByRole("button", { name: "Nuevo plato" }).click();
  const name = `Plato E2E ${Date.now()}`;
  await page.getByLabel("Nombre").fill(name);
  await page
    .getByLabel("Descripción")
    .fill(
      "Plato creado por la prueba end-to-end para validar el CRUD completo.",
    );
  await page.getByLabel("Precio").fill("21");
  await page.getByLabel("Categoría").selectOption({ index: 1 });
  await page.getByRole("button", { name: "Guardar plato" }).click();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
  const row = page.getByRole("row").filter({ hasText: name });
  await row.getByRole("button", { name: /Editar/ }).click();
  await page.getByLabel("Precio").fill("23");
  await page.getByRole("button", { name: "Guardar plato" }).click();
  await expect(row).toContainText("$23");
  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button", { name: `Eliminar ${name}` }).click();
});
