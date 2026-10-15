export type ContactEnvironment = Record<string, string | undefined>;

const reply = (status: number, error?: string) => Response.json(
  error ? { error } : { ok: true },
  { status, headers: { 'Cache-Control': 'no-store', ...(status === 405 ? { Allow: 'POST' } : {}) } },
);

export async function handleContact(
  request: Request,
  env: ContactEnvironment,
  send: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== 'POST') return reply(405, 'Método no permitido.');
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return reply(415, 'Envía los datos en formato JSON.');
  }

  // Limit the stream itself, not only the caller-controlled Content-Length header.
  let input: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, 'Faltan los datos del formulario.');
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        return reply(413, 'El mensaje es demasiado grande.');
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return reply(400, 'Datos inválidos.');
    input = parsed as Record<string, unknown>;
  } catch {
    return reply(400, 'Datos inválidos.');
  }

  const read = (key: string) => typeof input[key] === 'string' ? input[key].trim() : '';
  const data = { interest: read('interest'), name: read('name'), email: read('email'), message: read('message') };
  const token = read('turnstileToken');
  if (!['desarrollo web', 'análisis de datos', 'una oportunidad'].includes(data.interest)
    || !data.name || data.name.length > 100 || data.email.length > 180
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    || data.message.length < 10 || data.message.length > 3000) {
    return reply(400, 'Revisa tu nombre, correo y mensaje.');
  }
  if (!token || token.length > 2048) return reply(403, 'Completa la verificación de seguridad.');

  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  const webhook = env.MAKE_WEBHOOK_URL?.trim();
  const hosts = (env.TURNSTILE_ALLOWED_HOSTNAMES ?? '').split(',').map(host => host.trim()).filter(Boolean);
  const testMode = env.TURNSTILE_TEST_MODE === 'true';
  const deployed = env.NODE_ENV === 'production' || ['production', 'preview'].includes(env.VERCEL_ENV ?? '');
  const testSecret = [
    '1x0000000000000000000000000000000AA',
    '2x0000000000000000000000000000000AA',
    '3x0000000000000000000000000000000AA',
  ].includes(secret ?? '');
  if (!secret || !webhook || !hosts.length || (testMode && deployed) || (testSecret && !testMode)) {
    return reply(503, 'El formulario no está disponible en este momento.');
  }
  try {
    if (new URL(webhook).protocol !== 'https:') return reply(503, 'El formulario no está disponible en este momento.');
  } catch { return reply(503, 'El formulario no está disponible en este momento.'); }

  try {
    const validation = await send('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(7000),
    });
    if (!validation.ok) return reply(502, 'No se pudo verificar el formulario. Intenta de nuevo.');
    const result = await validation.json() as {
      success?: boolean; hostname?: string; action?: string;
      metadata?: { result_with_testing_key?: boolean };
    };
    const localTest = testMode && testSecret && !deployed;
    // Siteverify's dummy response can use example.com and omit action. Only
    // trust its testing marker with an official dummy secret in local test mode.
    const validContext = localTest && result.metadata?.result_with_testing_key === true
      || hosts.includes(result.hostname ?? '') && result.action === (localTest ? 'test' : 'contact');
    if (result.success !== true || !validContext) {
      return reply(403, 'La verificación no es válida o expiró. Intenta de nuevo.');
    }
    const response = await send(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(7000),
      redirect: 'error',
    });
    if (!response.ok) return reply(502, 'No pudimos confirmar la recepción. Intenta de nuevo.');
    return reply(200);
  } catch {
    return reply(502, 'No pudimos confirmar la recepción. Intenta de nuevo.');
  }
}
