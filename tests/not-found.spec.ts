import { test, expect } from '@playwright/test';

test('404: rutas desconocidas y regreso', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['/no-existe', '/proyectos/desconocido?origen=prueba', '/404.html']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('fuera deruta.');
    await expect(page).toHaveTitle(/404 · Página no encontrada/);
  }
  await page.getByRole('link', { name: 'volver al inicio' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.hero')).toBeVisible();
  await expect(page.locator('.not-found')).toHaveCount(0);
  await page.goto('/index.html');
  await expect(page.locator('.hero')).toBeVisible();
  expect(errors).toEqual([]);
});

test('404: responsive y movimiento reducido', async ({ page }) => {
  await page.goto('/ruta-inexistente');
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 700 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await expect(page.getByRole('link', { name: 'volver al inicio' })).toBeVisible();
  }
  await page.mouse.move(200, 300);
  await expect(page.locator('.not-found-star')).toHaveCSS('transform', 'none');
  await page.screenshot({ path: 'artifacts/not-found-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'artifacts/not-found-mobile.png', fullPage: true });
  await page.getByRole('link', { name: 'volver al inicio' }).click();
  await expect(page.locator('.hero')).toBeVisible();
});
