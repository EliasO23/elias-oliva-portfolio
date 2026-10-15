import { test, expect } from '@playwright/test';

test('navegación, imágenes y composición en escritorio y móvil', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('código con criterio.códigoconcriterio.');
  await expect(page.locator('.portrait-layer img')).toBeVisible();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    for (const section of ['#perfil', '#especialidades', '#habilidades', '#proyectos', '#formacion', '#contacto']) {
      await page.locator(section).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    }
  }
  await expect.poll(() => page.locator('main img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.getByRole('link', { name: 'volver al inicio', exact: true }).click();
  await expect(page).toHaveURL(/#inicio$/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'artifacts/mobile.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('filtra los proyectos publicados por categoría', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#proyectos');
  const cases = [
    { filter: 'FullStack', names: ['Sistema de seguimiento de becados', 'importadora g&b'] },
    { filter: 'Datos', names: ['Sistema de seguimiento de becados', 'Predicción de riesgo académico'] },
    { filter: 'Inteligencia Artificial', names: ['unab agent'] },
    { filter: 'Todos', names: ['Sistema de seguimiento de becados', 'unab agent', 'importadora g&b', 'Predicción de riesgo académico'] },
  ];
  for (const { filter, names } of cases) {
    const button = section.getByRole('button', { name: new RegExp(`^${filter}`) });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(section.locator('.project-trigger')).toHaveCount(names.length);
    for (const name of names) {
      await expect(section.getByRole('button', { name: `explorar ${name}`, exact: true })).toBeVisible();
    }
    await expect(section.getByRole('status')).toHaveText(`${names.length} ${names.length === 1 ? 'proyecto en esta selección' : 'proyectos en esta selección'}.`);
  }
});

test('abre las fichas, verifica enlaces y devuelve el foco al cerrar', async ({ page }) => {
  await page.goto('/');
  const cases = [
    { name: 'Sistema de seguimiento de becados', href: 'https://github.com/EliasO23/sistema_seguimiento_becas.git' },
    { name: 'unab agent', href: 'https://github.com/EliasO23/unab_agent.git' },
    { name: 'importadora g&b', href: 'https://importadoragyb.ec/' },
    { name: 'Predicción de riesgo académico', href: null },
  ];
  for (const [index, project] of cases.entries()) {
    const trigger = page.getByRole('button', { name: `explorar ${project.name}`, exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(`${project.name}.`);
    for (const name of ['Reto', 'Propuesta', 'Objetivo', 'Tecnologías utilizadas']) {
      await expect(dialog.getByRole('heading', { name, exact: true })).toBeVisible();
    }
    const image = dialog.locator('.case-gallery img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    if (project.href) {
      await expect(dialog.locator('.project-dialog-actions a')).toHaveAttribute('href', project.href);
      await expect(dialog.locator('.project-dialog-actions a')).toHaveAttribute('target', '_blank');
    } else {
      await expect(dialog.getByRole('button', { name: `repositorio de ${project.name} próximamente` })).toBeDisabled();
    }
    if (index % 2 === 0) await page.keyboard.press('Escape');
    else await dialog.getByRole('button', { name: 'cerrar proyecto' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test('el proceso de trabajo permite expandir y cerrar etapas con teclado', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('.process-section');
  const understand = section.getByRole('button', { name: /Entender/ });
  const connect = section.getByRole('button', { name: /Conectar/ });
  await expect(understand).toHaveAttribute('aria-expanded', 'true');
  await connect.focus();
  await page.keyboard.press('Enter');
  await expect(connect).toHaveAttribute('aria-expanded', 'true');
  await expect(understand).toHaveAttribute('aria-expanded', 'false');
  await expect(section.getByRole('region', { name: /Conectar/ })).toContainText('Ordenar los datos');
  await page.keyboard.press('Space');
  await expect(connect).toHaveAttribute('aria-expanded', 'false');
  await expect(section.getByRole('region')).toHaveCount(0);
});
test('el cursor contextual y las apariciones respetan movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const project = page.getByRole('button', { name: 'explorar Sistema de seguimiento de becados', exact: true });
  await project.hover();
  await expect(page.locator('.project-cursor')).toHaveClass(/cursor-visible/);
  await page.locator('#especialidades').scrollIntoViewIfNeeded();
  await expect(page.locator('#especialidades > .reveal').first()).toHaveClass(/is-visible/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.project-cursor')).not.toBeVisible();
  expect(await page.locator('.discipline-strip > div').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});

