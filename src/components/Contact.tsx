import { useLanguage } from '../i18n/Language';
import { useRef, useState, type FormEvent } from 'react';
import { profile } from '../data/content';
import { siGithub } from 'simple-icons';
import { Reveal } from './Motion';
import { Turnstile } from './Turnstile';

export function Contact() {
  const { t } = useLanguage();
  const [interest, setInterest] = useState('');
  const [status, setStatus] = useState('');
  const [retained, setRetained] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const sending = useRef(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [verificationKey, setVerificationKey] = useState(0);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current) return;
    setRetained(false);
    const form = event.currentTarget;
    const values = new FormData(form);
    const data = {
      interest,
      name: String(values.get('name') ?? '').trim(),
      email: String(values.get('email') ?? '').trim(),
      message: String(values.get('message') ?? '').trim(),
    };
    if (!['desarrollo web', 'análisis de datos', 'una oportunidad'].includes(data.interest)) {
      setStatus('Selecciona una opción de interés antes de enviar.');
      return;
    }
    if (!data.name || !data.email || data.message.length < 10) {
      setStatus('Completa tu nombre, correo y un mensaje de al menos 10 caracteres.');
      return;
    }
    if (!turnstileToken) {
      setStatus('Completa la verificación de seguridad antes de enviar.');
      return;
    }

    sending.current = true;
    setIsSending(true);
    setStatus('Enviando tu mensaje…');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setStatus(typeof result.error === 'string' ? result.error : 'No pudimos confirmar la recepción.');
        setRetained(true);
        return;
      }
      form.reset();
      setInterest('');
      setStatus('Mensaje recibido. Gracias por contactarme.');
    } catch {
      setStatus(controller.signal.aborted
        ? 'La respuesta tardó demasiado. No pudimos confirmar la recepción. Tus datos siguen aquí.'
        : 'No pudimos confirmar la recepción del mensaje. Tus datos siguen aquí; puedes intentar de nuevo.');
    } finally {
      window.clearTimeout(timeout);
      setTurnstileToken('');
      setVerificationKey(value => value + 1);
      sending.current = false;
      setIsSending(false);
    }
  };

  return <section id="contacto" className="section-shell contact-section" aria-labelledby="contact-heading">
    <Reveal><div className="section-kicker"><span>{t("07 / Contacto")}</span><span>{t("Todo empieza con una conversación")}</span></div><h2 id="contact-heading" className="contact-title">{t("hagamos")}<br /><span className="outline">{t("que suceda.")}</span><span className="contact-arrow" aria-hidden="true">↗</span></h2></Reveal>
    <div className="contact-grid"><div className="contact-copy"><span className="mono-label">{t("una idea, un equipo, un nuevo reto.")}</span><p>{t("Código, datos y soluciones con propósito. Si tienes una idea en mente, hablemos.")}</p><div className="contact-availability"><span className="status-dot" />{profile.availableForWork ? t("Abierto a oportunidades y colaboraciones") : t("conversemos sobre tu próximo proyecto")}</div>{profile.email && <a className="text-link" href={`mailto:${profile.email}`}>{profile.email} ↗</a>}<div className="social-links">{profile.github && <a href={profile.github} target="_blank" rel="noreferrer" aria-label={t("GitHub (abre en una nueva pestaña)")} title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d={siGithub.path} /></svg></a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label={t("LinkedIn (abre en una nueva pestaña)")} title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg></a>}</div></div>
      <form className="contact-form" onSubmit={submit} aria-busy={isSending}>
        <fieldset disabled={isSending}>
          <legend>{t("Me interesa…")}</legend>
          <div className="interest-options">
            {['desarrollo web', 'análisis de datos', 'una oportunidad'].map(option => <label key={t(option)} className={interest === option ? 'selected' : ''}>
              <input type="radio" name="interest" value={t(option)} checked={interest === option} onChange={() => setInterest(option)} required />
              {t(option)}
            </label>)}
          </div>
        </fieldset>
        <div className="form-row">
          <label>{t("Tu nombre")}<input name="name" autoComplete="name" placeholder={t("¿cómo te llamas?")} required maxLength={100} disabled={isSending} /></label>
          <label>{t("Tu correo")}<input name="email" type="email" autoComplete="email" placeholder={t("hola@ejemplo.com")} required maxLength={180} disabled={isSending} /></label>
        </div>
        <label>{t("Cuéntame un poco")}<textarea name="message" placeholder={t("la idea, el reto o lo que tienes en mente…")} required minLength={10} maxLength={3000} rows={3} disabled={isSending} /></label>
        <Turnstile onToken={setTurnstileToken} resetKey={verificationKey} />
        <div className="form-bottom"><p>{t("Cuéntame tu idea y conversemos.")}</p><button className="contact-button" type="submit" disabled={isSending || !turnstileToken}>{isSending ? t("enviando…") : t("enviar mensaje")} <span aria-hidden="true">↗</span></button></div>
        <p className="form-status" role="status" aria-atomic="true">{t(status)}{retained && ` ${t('Tus datos siguen aquí.')}`}</p>
      </form></div>
    <footer className="site-footer"><a href="#inicio" className="footer-name">{profile.name}<span className="outline">.</span></a><p>{t("Ingeniería, código y datos.")}<br />{t("Hecho con intención.")}</p><div><span>© {new Date().getFullYear()} {profile.name}</span></div></footer>
  </section>;
}
