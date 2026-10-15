import { test, expect } from '@playwright/test';

test('habilidades: ubicación, filtros, selección y teclado', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const section = page.locator('#habilidades');
  await expect(page.locator('#especialidades + #habilidades')).toHaveCount(1);
  await expect(section.locator('.skill-tool')).toHaveCount(10);
  const filters = section.getByRole('group', { name: 'filtrar habilidades por área' });
  await expect(filters.getByRole('button')).toHaveCount(4);
  await expect(filters.getByRole('button', { name: /Desarrollo/ })).toHaveAttribute('aria-pressed', 'true');
  await filters.getByRole('button', { name: /Datos/ }).click();
  await expect(section.locator('.skill-tool')).toHaveCount(8);
  await expect(section.getByRole('heading', { level: 3 })).toHaveText('Python.');
  await section.getByRole('button', { name: 'Power BI', exact: true }).click();
  await expect(section.getByRole('heading', { level: 3 })).toHaveText('Power BI.');
  await expect(section.locator('.skill-headline')).toHaveText('Datos que se entienden.');
  await filters.getByRole('button', { name: /Automatización/ }).click();
  await expect(section.locator('.skill-tool')).toHaveCount(4);
  await section.getByRole('button', { name: 'LangChain', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(section.getByRole('button', { name: 'LangChain', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(section.getByRole('heading', { level: 3 })).toHaveText('LangChain.');
  await filters.getByRole('button', { name: /Infraestructura/ }).click();
  await expect(section.locator('.skill-tool')).toHaveCount(4);
  await filters.getByRole('button', { name: /Desarrollo/ }).click();
  await expect(section.locator('.skill-tool')).toHaveCount(10);
  expect(errors).toEqual([]);
});

test('habilidades: responsive y movimiento reducido', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator('#habilidades');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await section.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    const overflowing = await section.locator('.skill-tool').evaluateAll(buttons => buttons
      .filter(button => button.scrollWidth > button.clientWidth)
      .map(button => button.textContent?.trim()));
    expect(overflowing, `Herramientas que desbordan a ${width}px`).toEqual([]);
  }
  expect(await section.locator('.skill-tool').first().evaluate(button => getComputedStyle(button).animationName)).toBe('none');
  await section.screenshot({ path: 'artifacts/skills-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await section.screenshot({ path: 'artifacts/skills-mobile.png' });
  await section.getByRole('button', { name: /Infraestructura/ }).click();
  await section.getByRole('button', { name: 'Docker', exact: true }).click();
  await expect(section.getByRole('heading', { name: 'Docker.', exact: true })).toBeInViewport();
});
