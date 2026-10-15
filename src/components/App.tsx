import { useState } from 'react';
import { Hero } from './Hero';
import { profile } from '../data/content';
import { MotionEffects, Reveal } from './Motion';
import { Projects } from './Projects';
import { DataDemo, TaskDemo } from './Demos';
import { Contact } from './Contact';
import { ProfileIntro } from './ProfileIntro';
import { Skills } from './Skills';
import { Education } from './Education';

const portrait = `${import.meta.env.BASE_URL}assets/retrato.png`;

const process = [
  ['Entender', 'primero, las preguntas correctas.', 'Definir el problema, conocer a las personas que lo van a usar y acordar qué significa que la solución funcione.'],
  ['Conectar', 'dar estructura a la complejidad.', 'Ordenar los datos, diseñar el flujo y elegir una arquitectura que tenga sentido para el alcance del proyecto.'],
  ['Construir', 'hacerlo tangible, paso a paso.', 'Llevar la propuesta a código o a una visualización, probar con casos concretos y trabajar en iteraciones pequeñas.'],
  ['Mejorar', 'el detalle también es parte del sistema.', 'Revisar accesibilidad, comportamiento y claridad. documentar las decisiones y encontrar la siguiente mejora.'],
];

export default function App() {
  const [lab, setLab] = useState<'datos' | 'fullstack'>('datos');
  const [openProcess, setOpenProcess] = useState<number | null>(0);
  return <>
    <a className="skip-link" href="#especialidades">saltar al contenido</a>
    <MotionEffects />
    <main id="inicio">
      <Hero name={profile.name} location={profile.location} portraitSrc={portrait} portraitAlt="retrato de elias oliva" availableForWork={profile.availableForWork} links={{ projects: '#proyectos', about: '#perfil', contact: '#contacto' }} />
      <div className="discipline-strip" aria-label="desarrollo fullstack y análisis de datos"><div aria-hidden="true">{[0, 1].map(n => <span key={n}>Desarrollo FullStack <i>✳</i> Análisis de Datos <i>✳</i> Inteligencia Artificial <i>✳</i> Machine Learning <i>✳</i> Bussines Inteligence <i>✳</i> Automatización <i>✳</i></span>)}</div></div>

      <ProfileIntro />

      <section id="especialidades" className="section-shell expertise-section" aria-labelledby="expertise-heading">
        <Reveal><div className="section-kicker"><span>02 / Lo que hago</span><span>lógica + sensibilidad</span></div><div className="section-heading-row"><h2 id="expertise-heading" className="display-title">dos disciplinas.<br /><span className="outline">una visión.</span></h2><p className="section-aside">Construir lo que imaginas.<br />Entender lo que los datos cuentan.</p></div></Reveal>
        <div className="expertise-grid"><Reveal><article className="expertise-item"><div className="expertise-top"><span className="mono-label">01 / construir</span><svg viewBox="0 0 80 64" aria-hidden="true"><path d="m25 10-22 22 22 22m30-44 22 22-22 22M47 2 33 62" /></svg></div><h3>desarrollo<br /><span className="outline">fullstack.</span></h3><p>Del primer clic a la lógica detrás de la pantalla. Interfaces claras, sistemas conectados y una base pensada para seguir creciendo.</p><div className="expertise-bottom"><span>interfaces / lógica / integración</span><a href="#proyectos" aria-label="ver proyectos de desarrollo">↗</a></div></article></Reveal><Reveal><article className="expertise-item"><div className="expertise-top"><span className="mono-label">02 / comprender</span><svg viewBox="0 0 80 64" aria-hidden="true"><path d="M8 58V38m16 20V24m16 34V7m16 51V30m16 28V15" /></svg></div><h3>análisis<br /><span className="outline">de datos.</span></h3><p>Encontrar las preguntas detrás de los números. Explorar, ordenar y visualizar información para convertirla en decisiones con contexto.</p><div className="expertise-bottom"><span>exploración / métricas / visualización</span><a href="#proyectos" aria-label="explorar el laboratorio de datos">↗</a></div></article></Reveal></div>
      </section>

      <Skills />

      <Projects />

      {/*<section id="laboratorio" className="section-shell lab-section" aria-labelledby="lab-heading"><Reveal><div className="section-kicker"><span>03 / laboratorio</span><span>menos promesas. más interacción.</span></div></Reveal><div className="lab-layout"><Reveal className="lab-intro"><span className="tiny-star" aria-hidden="true">✳</span><h2 id="lab-heading" className="display-title">prueba.<br />explora.<br /><span className="outline">descubre.</span></h2><p>un pequeño espacio para ver cómo pienso: interacción que responde y datos que cuentan algo.</p><div className="lab-switch" aria-label="elegir demostración"><button aria-pressed={lab === 'datos'} onClick={() => setLab('datos')}>01 / datos</button><button aria-pressed={lab === 'fullstack'} onClick={() => setLab('fullstack')}>02 / aplicación</button></div><span className="lab-instruction">{lab === 'datos' ? 'cambia el canal. observa la historia. ↗' : 'añade una tarea. prueba el flujo. ↗'}</span></Reveal><div className="lab-demo" key={lab}>{lab === 'datos' ? <DataDemo /> : <TaskDemo />}</div></div></section>*/}

      <Education />

      <section className="section-shell process-section" aria-labelledby="process-heading">
        <Reveal>
          <div className="section-kicker"><span>06 / Mi proceso</span><span>del problema a la posibilidad</span></div>
          <div className="process-layout">
            <h2 id="process-heading" className="display-title">nada está<br /><span className="outline">porque sí.</span></h2>
            <div className="process-list">
              {process.map(([title, subtitle, description], index) => (
                <div key={title} className={`process-item${openProcess === index ? ' is-open' : ''}`}>
                  <h3>
                    <button type="button" className="process-trigger" id={`process-trigger-${index}`} aria-expanded={openProcess === index} aria-controls={`process-panel-${index}`} onClick={() => setOpenProcess(current => current === index ? null : index)}>
                      <span className="process-number">0{index + 1}</span>
                      <span>{title}<small>{subtitle}</small></span>
                      <span className="process-toggle" aria-hidden="true">+</span>
                    </button>
                  </h3>
                  <div className="process-panel" id={`process-panel-${index}`} role="region" aria-labelledby={`process-trigger-${index}`} aria-hidden={openProcess !== index}>
                    <div className="process-panel-inner"><p>{description}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <Contact />
    </main>
  </>;
}
