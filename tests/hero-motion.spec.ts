import { test, expect } from '@playwright/test';

test('hero: entrada sincronizada, cursor y movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const words = page.locator('h1.hero-title .word');
  await expect(words.first()).toHaveCSS('animation-name', 'hero-word-enter');
  for (let index = 0; index < 3; index++) {
    const solid = words.nth(index);
    const outline = page.locator('.title-outline .word').nth(index);
    expect(await solid.evaluate(el => getComputedStyle(el).animationDelay)).toBe(await outline.evaluate(el => getComputedStyle(el).animationDelay));
  }
  await expect(words.last()).toHaveCSS('opacity', '1');
  const stage = page.locator('.editorial-stage');
  await stage.hover({ position: { x: 40, y: 120 } });
  await expect.poll(() => stage.evaluate(el => el.style.getPropertyValue('--hero-x'))).toMatch(/^-\d/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(words.first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.portrait-layer')).toHaveCSS('transform', 'none');
  await expect.poll(() => stage.evaluate(el => el.style.getPropertyValue('--hero-x'))).toBe('0px');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});
