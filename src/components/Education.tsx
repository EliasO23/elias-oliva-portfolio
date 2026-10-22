import { useLanguage } from '../i18n/Language';
import { profile } from '../data/content';
import { Reveal } from './Motion';

const education = [
  { title: 'Bootcamp Analista BI', institution: 'Kodigo', period: 'en curso', ongoing: true },
  { title: 'Formaciones Inteligencia Artificial y Cloud', institution: 'Alura', period: '2026' },
  { title: 'Preespecialización en Ciencia de Datos', institution: 'Universidad Doctor Andrés Bello', period: '2026' },
  { title: 'Certified OCI AI Foundations Associate', institution: 'Oracle', period: '2026' },
  { title: 'Ingeniería en Sistemas y Computación', institution: 'Universidad Doctor Andrés Bello', period: '2022 – 2025' },
  { title: 'Bootcamp FullStack Jr', institution: 'Kodigo', period: '2024 – 2025' },
];

export function Education() {
  const { t } = useLanguage();
  return (
    <section id="formacion" className="section-shell about-section education-section" aria-labelledby="education-heading">
      <Reveal>
        <div className="section-kicker"><span>{t("05 / Formación")}</span><span>{t("Conocimiento que sigue creciendo")}</span></div>
      </Reveal>
      <div className="about-grid">
        <Reveal className="about-visual">
          <div className="about-image">
            <img src={`${import.meta.env.BASE_URL}assets/workspace.png`} alt={t("mesa de estudio con portátil y libreta bajo luz natural")} width="1536" height="1024" loading="lazy" />
            <span className="about-image-label">{t("cada aprendizaje abre una posibilidad.")}</span>
            <span className="about-image-star" aria-hidden="true">✳</span>
          </div>
          <div className="about-image-footer"><span>{t("Ingeniería · Desarrollo · Datos")}</span><span>{t("formación continua")} </span></div>
        </Reveal>
        <Reveal className="about-copy">
          <h2 id="education-heading" className="display-title">{t("siempre")}<br /><span className="outline">{t("aprendiendo.")}</span></h2>
          <p className="about-lead">{t("Mi recorrido académico y profesional: de la ingeniería y el desarrollo a los datos, la inteligencia artificial y la nube.")}</p>
          <ol className="education-list" aria-label={t("formaciones de la más actual a la anterior")}>
            {education.map((item, index) => (
              <li key={item.title}>
                <span className="education-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <span className={`education-period${item.ongoing ? ' education-ongoing' : ''}`}>
                    {item.ongoing && <span className="education-status-dot" aria-hidden="true" />}{t(item.period)}
                  </span>
                  <h3>{t(item.title)}</h3>
                  <p>{item.institution}</p>
                </div>
              </li>
            ))}
          </ol>
          <a href={profile.linkedin} className="education-link" target="_blank" rel="noopener noreferrer">{t("ver formaciones")} <span aria-hidden="true">↗</span></a>
        </Reveal>
      </div>
    </section>
  );
}
