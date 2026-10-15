import { useEffect, useState } from 'react';
import { profile } from '../data/content';
import { Reveal } from './Motion';
import './ProfileIntro.css';

export function ProfileIntro() {
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
          <span>01 / Sobre mí</span>
          <span>La persona detrás de las ideas</span>
        </div>
      </Reveal>

      <div className="profile-layout">
        <Reveal className="profile-visual">
          <figure className="profile-photo">
            <img
              src={`${import.meta.env.BASE_URL}assets/formal.png`}
              alt={`retrato formal de ${profile.name}`}
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
            <span>{profile.role}</span>
            <span aria-hidden="true">✳</span>
          </div>
        </Reveal>

        <Reveal className="profile-copy">
          {/*<p className="profile-eyebrow">desarrollo fullstack / análisis de datos</p>*/}
          <h2 id="profile-heading" className="display-title">
            hola,<br />
            <span className="outline">soy elias oliva.</span>
          </h2>
          <p className="profile-lead">Desarrollador Fullstack Jr y Analista de Datos.</p>
          <p>Me apasiona la tecnología y convertir ideas en experiencias digitales. Disfruto crear interfaces modernas e intuitivas, explorar datos, cuidar los detalles y conectar lo visual con la lógica que hace funcionar una aplicación.</p>
          <p>Me motiva construir soluciones eficientes, robustas y seguir aprendiendo con cada proyecto.</p>

          <dl className="profile-facts">
            <div><dt>Mi enfoque</dt><dd>construir y comprender</dd></div>
            <div><dt>Mi siguiente paso</dt><dd>aportar, aprender y crecer</dd></div>
          </dl>

          <div className="profile-actions">
            {cvAvailable ? (
              <a className="contact-button profile-cv" href={profile.cvUrl} download="cv-elias-oliva.pdf">
                descargar cv <span aria-hidden="true">↓</span>
              </a>
            ) : (
              <button className="contact-button profile-cv" type="button" disabled aria-describedby="cv-availability">
                descargar cv <span aria-hidden="true">↓</span>
              </button>
            )}
            <a className="text-link" href="#contacto">conversemos <span aria-hidden="true">↗</span></a>
          </div>
          {!cvAvailable && <p id="cv-availability" className="profile-cv-note">cv disponible próximamente.</p>}
        </Reveal>
      </div>
    </section>
  );
}
