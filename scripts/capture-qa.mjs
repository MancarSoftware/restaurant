import { chromium } from "playwright";

const browser = await chromium.launch();
for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.screenshot({
    path: `artifacts/qa/home-${viewport.width}.png`,
  });
  for (const [name, selector] of [
    ["story", ".story"],
    ["menu", ".featured-menu"],
    ["atmosphere", ".atmosphere"],
  ]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(850);
    await page.screenshot({
      path: `artifacts/qa/${viewport.name}-${name}.png`,
    });
  }
  await page.goto("http://localhost:3000/menu", { waitUntil: "networkidle" });
  await page.screenshot({
    path: `artifacts/qa/menu-${viewport.width}.png`,
  });
  await page.goto("http://localhost:3000/reservar", {
    waitUntil: "networkidle",
  });
  await page.screenshot({
    path: `artifacts/qa/reserve-${viewport.width}.png`,
  });
  for (const route of ["nosotros", "galeria", "contacto", "eventos"]) {
    await page.goto(`http://localhost:3000/${route}`, {
      waitUntil: "networkidle",
    });
    await page.screenshot({
      path: `artifacts/qa/${route}-${viewport.width}.png`,
    });
  }
  await page.close();
}
await browser.close();
