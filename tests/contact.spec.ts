import { test, expect, type Page } from '@playwright/test';

const endpoint = '**/api/contact';
test.beforeEach(async ({ page }) => {
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({
    contentType: 'application/javascript',
    body: `
      let count = 0;
      window.turnstile = {
        render(container, options) {
          const id = String(++count);
          window.testTurnstileOptions = options;
          container.textContent = 'Verificación de prueba';
          queueMicrotask(() => options.callback('test-token-' + id));
          return id;
        },
        remove() {}
      };
    `,
  }));
});

const data = {
  interest: 'análisis de datos',
  name: 'Carlos Hernández',
  email: 'prueba@example.com',
  message: 'Me gustaría conversar sobre un panel de análisis de ventas.',
};

async function fillContact(page: Page) {
  await page.goto('/');
  await page.getByRole('radio', { name: data.interest, exact: true }).check();
  await page.getByLabel('Tu nombre', { exact: true }).fill(`  ${data.name}  `);
  await page.getByLabel('Tu correo', { exact: true }).fill(data.email);
  await page.getByLabel('Cuéntame un poco').fill(data.message);
}

test('envía el JSON exacto y bloquea envíos mientras espera la confirmación', async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  let count = 0;
  await page.route(endpoint, async route => {
    count++;
    expect(route.request().method()).toBe('POST');
    expect(route.request().headers()['content-type']).toBe('application/json');
    expect(route.request().postDataJSON()).toEqual({ ...data, turnstileToken: expect.stringMatching(/^test-token-/) });
    await pending;
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await fillContact(page);
  await page.getByRole('button', { name: 'enviar mensaje' }).click();
  await expect(page.getByRole('button', { name: 'enviando' })).toBeDisabled();
  await expect(page.getByLabel('Tu nombre', { exact: true })).toBeDisabled();
  await page.locator('.contact-form').evaluate(form => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  release();
  await expect(page.locator('.form-status')).toHaveText('Mensaje recibido. Gracias por contactarme.');
  expect(count).toBe(1);
  await expect(page.getByLabel('Tu nombre', { exact: true })).toHaveValue('');
  await expect(page.locator('input[name="interest"]:checked')).toHaveCount(0);
});

for (const failure of ['http', 'network', 'timeout']) {
  test(`conserva los datos ante fallo ${failure} y permite reintentar`, async ({ page }) => {
    await page.route(endpoint, async route => {
      if (failure === 'http') await route.fulfill({ status: 500 });
      else if (failure === 'network') await route.abort('failed');
      // The timeout case deliberately leaves the request pending.
    });
    await fillContact(page);
    if (failure === 'timeout') await page.clock.install();
    await page.getByRole('button', { name: 'enviar mensaje' }).click();
    if (failure === 'timeout') await page.clock.fastForward(21000);
    await expect(page.locator('.form-status')).toContainText('Tus datos siguen aquí');
    await expect(page.getByLabel('Cuéntame un poco')).toHaveValue(data.message);
    await expect(page.getByRole('button', { name: 'enviar mensaje' })).toBeEnabled();
    await page.route(endpoint, route => route.fulfill({ status: 200, json: { ok: true } }));
    await page.getByRole('button', { name: 'enviar mensaje' }).click();
    await expect(page.locator('.form-status')).toContainText('Mensaje recibido');
  });
}

test('exige elegir un interés aunque los demás campos y Turnstile estén completos', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, route => { requests++; return route.fulfill({ json: { ok: true } }); });
  await page.goto('/');
  const interest = page.getByRole('radio', { name: 'desarrollo web', exact: true });
  await expect(page.getByRole('radio')).toHaveCount(3);
  await expect(page.locator('input[name="interest"]:checked')).toHaveCount(0);
  await page.getByLabel('Tu nombre', { exact: true }).fill(data.name);
  await page.getByLabel('Tu correo', { exact: true }).fill(data.email);
  await page.getByLabel('Cuéntame un poco').fill(data.message);
  await page.getByRole('button', { name: 'enviar mensaje' }).click();
  expect(await interest.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await expect(interest).toBeFocused();
  expect(requests).toBe(0);
  await page.locator('.contact-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await expect(page.locator('.form-status')).toContainText('Selecciona una opción de interés');
  expect(requests).toBe(0);
  await page.getByRole('radio', { name: 'una oportunidad', exact: true }).check();
  await page.getByRole('button', { name: 'enviar mensaje' }).click();
  await expect(page.locator('.form-status')).toContainText('Mensaje recibido');
  expect(requests).toBe(1);
});

test('rechaza campos vacíos o compuestos solo por espacios sin enviar', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, route => { requests++; return route.fulfill({ status: 200 }); });
  await page.goto('/');
  await page.getByRole('button', { name: 'enviar mensaje' }).click();
  expect(await page.getByLabel('Tu nombre', { exact: true }).evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await fillContact(page);
  await page.getByLabel('Cuéntame un poco').fill('             ');
  await page.getByRole('button', { name: 'enviar mensaje' }).click();
  await expect(page.locator('.form-status')).toContainText('al menos 10 caracteres');
  expect(requests).toBe(0);
});

test('bloquea el envío al expirar el token y permite renovar la verificación', async ({ page }) => {
  await fillContact(page);
  const submit = page.getByRole('button', { name: 'enviar mensaje' });
  await expect(submit).toBeEnabled();
  await page.evaluate(() => {
    (window as unknown as { testTurnstileOptions: { 'expired-callback': () => void } }).testTurnstileOptions['expired-callback']();
  });
  await expect(submit).toBeDisabled();
  await page.locator('.contact-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await expect(page.locator('.form-status')).toContainText('Completa la verificación');
  await page.getByRole('button', { name: 'Reintentar verificación' }).click();
  await expect(submit).toBeEnabled();
});

test('si Cloudflare no carga, conserva el formulario y permite reintentar', async ({ page }) => {
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.abort());
  await fillContact(page);
  await expect(page.getByText('No se pudo cargar la verificación.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'enviar mensaje' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Reintentar verificación' })).toBeVisible();
});

test('renueva el token tras rechazo del servidor y nunca muestra éxito para HTML', async ({ page }) => {
  const tokens: string[] = [];
  await page.route(endpoint, route => {
    tokens.push(route.request().postDataJSON().turnstileToken);
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<html>Fallback</html>' });
  });
  await fillContact(page);
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'enviar mensaje' }).click();
    await expect(page.getByRole('button', { name: 'enviar mensaje' })).toBeEnabled();
    await expect(page.locator('.form-status')).toContainText('Tus datos siguen aquí');
  }
  expect(tokens).toHaveLength(2);
  expect(tokens[0]).not.toBe(tokens[1]);
});


