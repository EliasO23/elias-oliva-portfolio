import { useEffect, useRef, useState } from 'react';

type WidgetOptions = {
  sitekey: string;
  action: string;
  theme: 'dark';
  size: 'flexible' | 'compact';
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
  'timeout-callback': () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: WidgetOptions) => string;
      remove: (id: string) => void;
    };
  }
}

let loading: Promise<void> | undefined;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => {
        window.clearTimeout(timer);
        script.remove();
        loading = undefined;
        reject(new Error('Turnstile unavailable'));
      };
      const timer = window.setTimeout(fail, 15000);
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => {
        if (!window.turnstile) return fail();
        window.clearTimeout(timer);
        resolve();
      };
      script.onerror = fail;
      document.head.appendChild(script);
    });
  }
  return loading;
}

export function Turnstile({ onToken, resetKey }: { onToken: (token: string) => void; resetKey: number }) {
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 400px)').matches);
  const sitekey = import.meta.env.TURNSTILE_SITE_KEY?.trim();

  useEffect(() => {
    const media = window.matchMedia('(max-width: 400px)');
    const change = () => setCompact(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    let active = true;
    let widget: string | undefined;
    onToken('');
    setError('');
    if (!sitekey) {
      setError('La verificación no está disponible. Puedes contactarme por correo.');
      return;
    }
    const invalidate = (message: string) => {
      if (!active) return;
      onToken('');
      setError(message);
    };
    loadTurnstile().then(() => {
      if (!active || !container.current) return;
      widget = window.turnstile!.render(container.current, {
        sitekey, action: 'contact', theme: 'dark', size: compact ? 'compact' : 'flexible',
        callback: token => { if (active) { onToken(token); setError(''); } },
        'expired-callback': () => invalidate('La verificación expiró. Vuelve a verificar.'),
        'error-callback': () => invalidate('No se pudo completar la verificación. Intenta de nuevo.'),
        'timeout-callback': () => invalidate('La verificación tardó demasiado. Intenta de nuevo.'),
      });
    }).catch(() => invalidate('No se pudo cargar la verificación. Revisa tu conexión e intenta de nuevo.'));
    return () => {
      active = false;
      if (widget !== undefined) window.turnstile?.remove(widget);
    };
  }, [sitekey, resetKey, attempt, onToken, compact]);

  return <div className="contact-verification">
    <div ref={container} />
    {error && <div><p role="status">{error}</p>{sitekey && <button type="button" onClick={() => setAttempt(value => value + 1)}>Reintentar verificación</button>}</div>}
  </div>;
}
