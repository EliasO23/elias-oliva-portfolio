import { test, expect } from '@playwright/test';
import { handleContact } from '../server/contact';

const env = {
  MAKE_WEBHOOK_URL: 'https://make-webhook.invalid/contact',
  TURNSTILE_SECRET_KEY: 'private-test-fixture',
  TURNSTILE_ALLOWED_HOSTNAMES: 'portfolio.example.com',
  NODE_ENV: 'production',
};
const data = { interest: 'desarrollo web', name: 'Carlos Hernández', email: 'test@example.com', message: 'Quiero desarrollar un sitio web.' };
const payload = { ...data, turnstileToken: 'valid-token' };
const request = (body: unknown = payload) => new Request('https://portfolio.example.com/api/contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

function transport(verification: unknown = { success: true, hostname: 'portfolio.example.com', action: 'contact' }, status = 200) {
  const calls: { url: string; body: unknown }[] = [];
  const send: typeof fetch = async (url, options) => {
    calls.push({ url: String(url), body: JSON.parse(String(options?.body)) });
    if (calls.length === 1) return Response.json(verification);
    return new Response('Accepted', { status });
  };
  return { calls, send };
}

test('API verifica primero el token y solo entrega los cuatro campos a Make', async () => {
  const { calls, send } = transport();
  const response = await handleContact(request({ ...payload, name: ` ${data.name} `, extra: 'ignored' }), env, send);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ ok: true });
  expect(calls).toEqual([
    { url: 'https://challenges.cloudflare.com/turnstile/v0/siteverify', body: { secret: env.TURNSTILE_SECRET_KEY, response: payload.turnstileToken } },
    { url: env.MAKE_WEBHOOK_URL, body: data },
  ]);
});

for (const [index, invalid] of [
  { ...payload, turnstileToken: '' },
  { ...payload, turnstileToken: 'x'.repeat(2049) },
  { ...payload, name: ' ' },
  { ...payload, email: 'invalid' },
  { ...payload, interest: 'invalid' },
  { ...payload, message: 'x'.repeat(3001) },
  { ...payload, name: { injected: true } },
  null,
].entries()) {
  test(`API rechaza datos inválidos ${index}`, async () => {
    const { calls, send } = transport();
    expect((await handleContact(request(invalid), env, send)).status).toBeGreaterThanOrEqual(400);
    expect(calls).toHaveLength(0);
  });
}

for (const [name, result] of Object.entries({
  expired: { success: false, 'error-codes': ['timeout-or-duplicate'] },
  forged: { success: false, 'error-codes': ['invalid-input-response'] },
  hostname: { success: true, hostname: 'attacker.example.com', action: 'contact' },
  action: { success: true, hostname: 'portfolio.example.com', action: 'login' },
})) {
  test(`API bloquea ${name} sin llamar a Make`, async () => {
    const { calls, send } = transport(result);
    expect((await handleContact(request(), env, send)).status).toBe(403);
    expect(calls).toHaveLength(1);
  });
}

test('API rechaza método, formato incorrecto, JSON roto y cuerpo excesivo', async () => {
  const { calls, send } = transport();
  const url = 'https://portfolio.example.com/api/contact';
  const cases: [Request, number][] = [
    [new Request(url), 405],
    [new Request(url, { method: 'POST', body: 'hello' }), 415],
    [new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }), 400],
    [request({ message: 'x'.repeat(17000) }), 413],
  ];
  for (const [input, status] of cases) expect((await handleContact(input, env, send)).status).toBe(status);
  expect(calls).toHaveLength(0);
});

test('API no permite claves de prueba en producción ni configuración incompleta', async () => {
  const { calls, send } = transport();
  for (const config of [
    { ...env, TURNSTILE_SECRET_KEY: '' },
    { ...env, MAKE_WEBHOOK_URL: '' },
    { ...env, TURNSTILE_ALLOWED_HOSTNAMES: '' },
    { ...env, TURNSTILE_TEST_MODE: 'true' },
    { ...env, TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' },
    { ...env, MAKE_WEBHOOK_URL: 'http://example.com' },
  ]) expect((await handleContact(request(), config, send)).status).toBe(503);
  expect(calls).toHaveLength(0);
});

test('API permite las claves de prueba locales con verificación de Cloudflare', async () => {
  const { calls, send } = transport({ success: true, hostname: 'localhost', action: 'test' });
  const response = await handleContact(request(), {
    ...env, NODE_ENV: 'development', TURNSTILE_TEST_MODE: 'true',
    TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA', TURNSTILE_ALLOWED_HOSTNAMES: 'localhost,127.0.0.1',
  }, send);
  expect(response.status).toBe(200);
  expect(calls).toHaveLength(2);
});

const localEnv = {
  ...env, NODE_ENV: 'development', TURNSTILE_TEST_MODE: 'true',
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  TURNSTILE_ALLOWED_HOSTNAMES: 'localhost,127.0.0.1',
};
// Actual Siteverify response observed with Cloudflare's public dummy credentials.
const dummyVerification = {
  success: true, hostname: 'example.com', 'error-codes': [],
  metadata: { result_with_testing_key: true },
};

test('API acepta la respuesta real de prueba sin action y con hostname sintético', async () => {
  const { calls, send } = transport(dummyVerification);
  expect((await handleContact(request(), localEnv, send)).status).toBe(200);
  expect(calls).toHaveLength(2);
});

test('el marcador de pruebas no omite verificaciones con claves reales ni tokens rechazados', async () => {
  for (const config of [env, { ...env, NODE_ENV: 'development', TURNSTILE_TEST_MODE: 'true' }]) {
    const { calls, send } = transport(dummyVerification);
    expect((await handleContact(request(), config, send)).status).toBe(403);
    expect(calls).toHaveLength(1);
  }
  const { calls, send } = transport({ ...dummyVerification, success: false });
  expect((await handleContact(request(), localEnv, send)).status).toBe(403);
  expect(calls).toHaveLength(1);
});

test('la configuración local de pruebas no funciona en Production ni Preview', async () => {
  const { calls, send } = transport(dummyVerification);
  for (const overrides of [{ NODE_ENV: 'production' }, { VERCEL_ENV: 'production' }, { VERCEL_ENV: 'preview' }]) {
    expect((await handleContact(request(), { ...localEnv, ...overrides }, send)).status).toBe(503);
  }
  expect(calls).toHaveLength(0);
});

test('verificación real opcional contra Cloudflare sin enviar a Make', async () => {
  test.skip(process.env.RUN_LIVE_TURNSTILE !== '1', 'Requiere acceso de red explícito.');
  let delivered = false;
  const send: typeof fetch = async (url, options) => {
    if (String(url) === env.MAKE_WEBHOOK_URL) {
      delivered = true;
      return new Response('Accepted');
    }
    return fetch(url, options);
  };
  const response = await handleContact(request({ ...payload, turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX' }), localEnv, send);
  expect(await response.json()).toEqual({ ok: true });
  expect(response.status).toBe(200);
  expect(delivered).toBe(true);
});

test('API trata errores de Cloudflare y Make sin confirmar recepción ni filtrar secretos', async () => {
  for (const provider of ['cloudflare', 'make']) {
    const { send } = transport(undefined, 500);
    const response = await handleContact(request(), env, provider === 'make' ? send : async () => { throw new Error(env.TURNSTILE_SECRET_KEY); });
    expect(response.status).toBe(502);
    const text = await response.text();
    expect(text).not.toContain(env.TURNSTILE_SECRET_KEY);
    expect(text).not.toContain(env.MAKE_WEBHOOK_URL);
  }
});

test('el adaptador local sirve la API y rechaza solicitudes sin token', async ({ request: client }) => {
  const response = await client.post('/api/contact', { data });
  expect(response.status()).toBe(403);
  expect(await response.json()).toEqual({ error: 'Completa la verificación de seguridad.' });
});

