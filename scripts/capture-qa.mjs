import { chromium } from "playwright";

const browser = await chromium.launch();
for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
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
  await page.close();
}
await browser.close();
