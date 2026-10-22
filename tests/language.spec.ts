import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({
    contentType: 'application/javascript',
    body: `window.turnstile = {
      render(container, options) { container.dataset.language = options.language; queueMicrotask(() => options.callback('test-token')); return '1'; },
      remove() {}
    };`,
  }));
});

test('switches all content, keeps form and filter state, and remembers the language', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.getByLabel('Tu nombre', { exact: true }).fill('Prueba');
  await page.getByLabel('Cuéntame un poco').fill('Un mensaje que debe conservarse.');
  await page.getByRole('radio', { name: 'análisis de datos', exact: true }).check();
  await page.locator('.skills-filters').getByRole('button', { name: /Datos/ }).click();
  await page.locator('.skill-tool').filter({ hasText: 'Power BI' }).click();
  await page.getByRole('button', { name: 'Cambiar a inglés', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.language-selector')).toHaveCount(1);
  await expect(page.locator('.language-selector')).toHaveText('ES');
  await expect(page.locator('.hero-title').first()).toContainText('code with purpose.');
  await expect(page.locator('#profile-heading')).toContainText('I’m elias oliva.');
  await expect(page.locator('.skill-headline')).toHaveText('Data you can understand.');
  await expect(page.locator('#formacion')).toContainText('Systems & Computer Engineering');
  await expect(page.getByLabel('Your name', { exact: true })).toHaveValue('Prueba');
  await expect(page.getByLabel('Tell me a little more')).toHaveValue('Un mensaje que debe conservarse.');
  await expect(page.getByRole('radio', { name: 'data analytics', exact: true })).toBeChecked();
  await expect(page.locator('.contact-verification [data-language]')).toHaveAttribute('data-language', 'en');
  await page.getByRole('button', { name: 'explore Scholarship tracking system', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('A desktop application that centralizes');
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Technologies used' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Switch to Spanish', exact: true }).click();
  await expect(page.locator('#projects-heading')).toContainText('del concepto');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('English contact translates server errors and success while keeping API values stable', async ({ page }) => {
  let succeed = false;
  await page.route('**/api/contact', route => {
    expect(route.request().postDataJSON().interest).toBe('desarrollo web');
    return route.fulfill(succeed ? { json: { ok: true } } : { status: 503, json: { error: 'El formulario no está disponible en este momento.' } });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Cambiar a inglés', exact: true }).click();
  await page.getByRole('radio', { name: 'web development', exact: true }).check();
  await page.getByLabel('Your name', { exact: true }).fill('Test');
  await page.getByLabel('Your email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Tell me a little more').fill('A test message for the form.');
  await page.getByRole('button', { name: 'send message' }).click();
  await expect(page.locator('.form-status')).toHaveText('The form is currently unavailable. Your details are still here.');
  await page.getByRole('button', { name: 'Switch to Spanish', exact: true }).click();
  await expect(page.locator('.form-status')).toContainText('El formulario no está disponible');
  await page.getByRole('button', { name: 'Cambiar a inglés', exact: true }).click();
  succeed = true;
  await page.getByRole('button', { name: 'send message' }).click();
  await expect(page.locator('.form-status')).toHaveText('Message received. Thank you for reaching out.');
});

test('404 supports both languages and blocked storage does not prevent switching', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
  });
  await page.goto('/missing-page');
  await page.getByRole('button', { name: 'Cambiar a inglés', exact: true }).click();
  await expect(page).toHaveTitle('404 · Page not found | elias oliva');
  await expect(page.getByRole('link', { name: 'back to home' })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to Spanish', exact: true }).click();
  await expect(page).toHaveTitle('404 · Página no encontrada | elias oliva');
});

for (const language of ['es', 'en'] as const) {
  test(`${language}: text fits at mobile, tablet and desktop sizes`, async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    if (language === 'en') await page.getByRole('button', { name: 'Cambiar a inglés', exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      const overflow = await page.locator('h1, h2, h3, .word, .section-aside, .project-badge, .skill-headline, .skill-description, .interest-options, .hero-header').evaluateAll(elements => elements.flatMap(element => {
        if (!(element instanceof HTMLElement) || !element.getClientRects().length) return [];
        const box = element.getBoundingClientRect();
        const range = document.createRange(); range.selectNodeContents(element);
        const text = range.getBoundingClientRect();
        const outside = box.left < -2 || box.right > innerWidth + 2;
        const clipped = !element.classList.contains('hero-title') && (element.scrollWidth > element.clientWidth + 2 || text.right > box.right + 3 || text.left < box.left - 3);
        return outside || clipped ? [{ text: element.textContent?.slice(0, 70), width: innerWidth, box: { left: box.left, right: box.right }, scroll: element.scrollWidth, client: element.clientWidth }] : [];
      }));
      expect(overflow, JSON.stringify(overflow)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if ([390, 1440].includes(width)) {
        for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
        await expect.poll(() => page.locator('main img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
        // Capture from the top so offscreen fixed controls do not appear in the full-page image.
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: `artifacts/language-${language}-${width}.png`, fullPage: true });
      }
      await page.locator('.project-trigger').first().click();
      const dialog = page.getByRole('dialog');
      expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
      await page.keyboard.press('Escape');
    }
  });
}
