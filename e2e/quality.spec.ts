import { expect, test } from "@playwright/test";

test("key pages have no horizontal overflow across required widths", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "single browser matrix",
  );
  const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    for (const path of ["/", "/menu", "/reservar", "/contacto"]) {
      await page.goto(path);
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        metrics.scrollWidth,
        `${path} overflows at ${width}px`,
      ).toBeLessThanOrEqual(metrics.clientWidth + 1);
    }
  }
});

test("public pages do not emit browser errors", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "single browser audit",
  );
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/",
    "/menu",
    "/reservar",
    "/nosotros",
    "/galeria",
    "/eventos",
    "/contacto",
  ])
    await page.goto(path);
  expect(errors).toEqual([]);
});
