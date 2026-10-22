import { useLanguage } from '../i18n/Language';
import { useEffect, useState } from 'react';
import { profile } from '../data/content';
import { Reveal } from './Motion';
import './ProfileIntro.css';

export function ProfileIntro() {
  const { t } = useLanguage();
  const [cvAvailable, setCvAvailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    // Vite devuelve HTML para rutas inexistentes: comprobar también el tipo
    // evita descargar por error la página como si fuera el currículum.
    fetch(profile.cvUrl, { method: 'HEAD', cache: 'no-store', signal: controller.signal })
      .then(response => {
        if (!controller.signal.aborted) {
          setCvAvailable(response.ok && Boolean(response.headers.get('content-type')?.toLowerCase().includes('application/pdf')));
        }
      })
      .catch(() => { if (!controller.signal.aborted) setCvAvailable(false); });
    return () => controller.abort();
  }, []);

  return (
    <section id="perfil" className="section-shell profile-intro" aria-labelledby="profile-heading">
      <Reveal>
        <div className="section-kicker">
          <span>{t("01 / Sobre mí")}</span>
          <span>{t("La persona detrás de las ideas")}</span>
        </div>
      </Reveal>

      <div className="profile-layout">
        <Reveal className="profile-visual">
          <figure className="profile-photo">
            <img
              src={`${import.meta.env.BASE_URL}assets/formal.png`}
              alt={`${t('retrato formal de')} ${profile.name}`}
              width="1086"
              height="1448"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>{profile.name}</span>
              <span aria-hidden="true">↗</span>
            </figcaption>
          </figure>
          <div className="profile-photo-caption">
            <span>{t(profile.role)}</span>
            <span aria-hidden="true">✳</span>
          </div>
        </Reveal>

        <Reveal className="profile-copy">
          {/*<p className="profile-eyebrow">desarrollo fullstack / análisis de datos</p>*/}
          <h2 id="profile-heading" className="display-title">{t("hola,")}<br />
            <span className="outline">{t("soy elias oliva.")}</span>
          </h2>
          <p className="profile-lead">{t("Desarrollador Fullstack Jr y Analista de Datos.")}</p>
          <p>{t("Me apasiona la tecnología y convertir ideas en experiencias digitales. Disfruto crear interfaces modernas e intuitivas, explorar datos, cuidar los detalles y conectar lo visual con la lógica que hace funcionar una aplicación.")}</p>
          <p>{t("Me motiva construir soluciones eficientes, robustas y seguir aprendiendo con cada proyecto.")}</p>

          <dl className="profile-facts">
            <div><dt>{t("Mi enfoque")}</dt><dd>{t("construir y comprender")}</dd></div>
            <div><dt>{t("Mi siguiente paso")}</dt><dd>{t("aportar, aprender y crecer")}</dd></div>
          </dl>

          <div className="profile-actions">
            {cvAvailable ? (
              <a className="contact-button profile-cv" href={profile.cvUrl} download="cv-elias-oliva.pdf">{t("descargar cv")}<span aria-hidden="true">↓</span>
              </a>
            ) : (
              <button className="contact-button profile-cv" type="button" disabled aria-describedby="cv-availability">{t("descargar cv")}<span aria-hidden="true">↓</span>
              </button>
            )}
            <a className="text-link" href="#contacto">{t("conversemos")} <span aria-hidden="true">↗</span></a>
          </div>
          {!cvAvailable && <p id="cv-availability" className="profile-cv-note">{t("cv disponible próximamente.")}</p>}
        </Reveal>
      </div>
    </section>
  );
}
