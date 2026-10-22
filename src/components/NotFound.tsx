import { LanguageSelector, useLanguage } from '../i18n/Language';
import { useEffect, type PointerEvent } from 'react';
import './NotFound.css';

export function NotFound() {
  const { t } = useLanguage();
  const home = import.meta.env.BASE_URL;

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => { robots.remove(); };
  }, []);

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--shift-x', `${((event.clientX - box.left) / box.width - .5) * 24}px`);
    event.currentTarget.style.setProperty('--shift-y', `${((event.clientY - box.top) / box.height - .5) * 24}px`);
  }

  return (
    <div className="not-found">
      <div className="not-found-language"><LanguageSelector /></div>
      <main className="not-found-main" id="contenido">
        <div className="not-found-art" onPointerMove={followPointer} onPointerLeave={event => {
          event.currentTarget.style.setProperty('--shift-x', '0px');
          event.currentTarget.style.setProperty('--shift-y', '0px');
        }}>
          <div className="not-found-number" aria-hidden="true"><span>4</span><span className="not-found-zero">0<span className="not-found-orbit" /><span className="not-found-star">✳</span></span><span className="outline">4</span></div>
        </div>
        <div className="not-found-copy">
          <p className="not-found-label">{t("404 / página no encontrada")}</p>
          <h1 className="display-title">{t("fuera de")}<br /><span className="outline">{t("ruta.")}</span></h1>
          <p>{t("Esta página no existe o cambió de lugar. Las buenas ideas siguen por aquí: encontremos un nuevo punto de partida.")}</p>
          <a className="contact-button not-found-home" href={home}>{t("volver al inicio")} <span aria-hidden="true">↗</span></a>
        </div>
      </main>
    </div>
  );
}
