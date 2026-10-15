import { chromium, request, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const baseURL = process.argv[2];
assert(baseURL?.startsWith('https://'), 'Indica la URL HTTPS del despliegue.');
const client = await request.newContext({ baseURL });
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const home = await page.goto(baseURL);
  assert.equal(home?.status(), 200, 'La portada debe responder 200.');
  assert.equal(await page.locator('#contacto').count(), 1, 'Debe existir el formulario.');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator('#contacto').scrollIntoViewIfNeeded();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Desbordamiento horizontal.');
  }
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/vercel-contact-mobile.png' });
  assert.deepEqual(errors, [], 'No debe haber errores JavaScript.');
  if (process.argv.includes('--turnstile')) {
    // Turnstile may keep its iframe in a closed shadow root.
    await expect.poll(() => page.frames().some(frame => frame.url().startsWith('https://challenges.cloudflare.com/')), { timeout: 20000 }).toBe(true);
    await expect(page.locator('.contact-verification [role="status"]')).toHaveCount(0);
    const invalidToken = await client.post('/api/contact', { data: {
      interest: 'desarrollo web', name: 'Verificación de despliegue',
      email: 'test@example.com', message: 'Solicitud con token inválido; debe ser rechazada.',
      turnstileToken: 'invalid-deployment-test-token',
    } });
    assert.equal(invalidToken.status(), 403, `Token inválido: ${invalidToken.status()} ${await invalidToken.text()}`);
    console.log('OK: frame Turnstile cargado y token inválido rechazado por la API configurada.');
  }

  const get = await client.get('/api/contact');
  assert.equal(get.status(), 405, `GET /api/contact: ${get.status()} ${await get.text()}`);
  const noToken = await client.post('/api/contact', { data: {
    interest: 'desarrollo web', name: 'Verificación de despliegue',
    email: 'test@example.com', message: 'Solicitud de prueba sin token; debe ser rechazada.',
  } });
  assert.equal(noToken.status(), 403, `POST sin token: ${noToken.status()} ${await noToken.text()}`);
  console.log('OK: portada, formulario, escritorio/móvil, JavaScript y rechazo de solicitudes sin token. No se enviaron datos a Make.');
} finally {
  await client.dispose();
  await browser.close();
}
