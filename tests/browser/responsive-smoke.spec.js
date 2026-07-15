const { test, expect } = require('@playwright/test');

const pages = [
  './',
  './services.html',
  './calculators.html',
  './contact.html',
  './services/residential.html',
  './calculators/solar-panel-cost-calculator.html',
  './calculators/solar-number-of-panels-calculator.html'
];

const viewports = [
  { width: 320, height: 900 },
  { width: 375, height: 900 },
  { width: 425, height: 900 },
  { width: 576, height: 900 },
  { width: 768, height: 1000 },
  { width: 992, height: 1000 },
  { width: 1200, height: 1000 },
  { width: 1400, height: 1000 }
];

for (const viewport of viewports) {
  for (const pagePath of pages) {
    test(`${pagePath} has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(pagePath, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await expect(page.locator('#main-content')).toBeVisible();

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });

      expect(overflow).toBe(false);
    });
  }
}
