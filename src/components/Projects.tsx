import { useEffect, useRef, useState } from 'react';
import { siGithub } from 'simple-icons';
import { projects, type Project, type ProjectCategory } from '../data/content';
import { Reveal } from './Motion';
import { TaskDemo, DataDemo } from './Demos';

const categoryLabels: Record<ProjectCategory | 'todos', string> = { todos: 'Todos', fullstack: 'FullStack', datos: 'Datos', ai: 'Inteligencia Artificial', backend: 'backend', rag: 'rag', web: 'desarrollo web', 'machine-learning': 'machine learning' };

function matchesCategory(project: Project, filter: 'todos' | ProjectCategory) {
  return filter === 'todos' || project.category === filter || project.additionalCategories?.includes(filter);
}

function ProjectLink({ project }: { project: Project }) {
  if (project.websiteUrl) return <a className="project-github" href={project.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`visitar el sitio web de ${project.name}`}>visitar sitio web <span aria-hidden="true">↗</span></a>;
  const icon = <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d={siGithub.path} /></svg>;
  return project.githubUrl
    ? <a className="project-github" href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`ver ${project.name} en github`}>{icon} github <span aria-hidden="true">↗</span></a>
    : <button className="project-github" type="button" disabled aria-label={`repositorio de ${project.name} próximamente`}>{icon} github <span className="github-pending">próximamente</span></button>;
}

function ProjectCaseStudy({ project }: { project: Project }) {
  return <div className="case-study">
    <div className="case-block"><h3>Objetivo</h3><p>{project.objective}</p></div>
    {project.solution && <div className="case-block"><h3>Solución</h3><p>{project.solution}</p></div>}
    <div className="case-block"><h3>Tecnologías utilizadas</h3><dl className="case-technologies">{project.technologies?.map(technology => <div key={technology.group}><dt>{technology.group}</dt><dd>{technology.tools.join(' · ')}</dd></div>)}</dl></div>
    {!!project.indicators?.length && <div className="case-block"><h3>Indicadores para el seguimiento</h3><ul className="case-indicators">{project.indicators.map(indicator => <li key={indicator}>{indicator}</li>)}</ul></div>}
    {project.dataManagement && <div className="case-block"><h3>Gestión de datos</h3><p>{project.dataManagement}</p></div>}
  </div>;
}

export function Projects() {
  const [filter, setFilter] = useState<'todos' | ProjectCategory>('todos');
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    if (dialog.current) dialog.current.scrollTop = 0;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  const close = () => { dialog.current?.close(); setSelected(null); };
  const shown = projects.filter(project => matchesCategory(project, filter));
  return <section id="proyectos" className="section-shell projects-section" aria-labelledby="projects-heading">
    <Reveal><div className="section-kicker"><span>04 / Proyectos</span><span>Ideas que toman forma</span></div><div className="section-heading-row"><h2 id="projects-heading" className="display-title">del concepto<br />a lo <span className="outline">concreto.</span></h2><p className="section-aside">Distintas formas de resolver.<br />La misma atención al detalle.</p></div></Reveal>
    <div className="project-filter-row"><div className="project-filters" aria-label="filtrar proyectos">{(['todos', 'fullstack', 'datos', 'ai'] as const).map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{categoryLabels[f]}<span>{String(projects.filter(project => matchesCategory(project, f)).length).padStart(2, '0')}</span></button>)}</div><span className="sample-note">Aplicaciones practicas</span></div>
    <div className="project-grid">{shown.map(project => <article className="project" key={project.id}>
      <button className="project-trigger" data-cursor="explorar" onClick={() => setSelected(project)} aria-label={`explorar ${project.name}`}>
        <div className={`project-art${project.mockup ? ' project-art-mockup' : ''}`}><img src={project.image} alt={project.imageAlt} loading="lazy" width="1536" height="1024" /><span className="project-badge">{project.categoryLabel || categoryLabels[project.category]}</span><span className="project-art-number" aria-hidden="true">{project.number}</span><span className="project-open" aria-hidden="true">↗</span></div>
        <div className="project-caption"><div><h3>{project.name}<span className="outline">.</span></h3><p>{project.description}</p></div><span className="mono-label">{project.kind === 'demo' ? 'demo' : 'proyecto'} / {project.number}</span></div>
      </button>
      <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <ProjectLink project={project} />
    </article>)}</div>
    <p className="projects-note" role="status">{shown.length} {shown.length === 1 ? 'proyecto en esta selección' : 'proyectos en esta selección'}.</p>
    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-heading" onCancel={close} onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      {selected && <div className="dialog-inner">
        <div className="dialog-header"><span className="mono-label">{selected.kind === 'demo' ? 'proyecto de demostración' : 'caso de proyecto'} / {selected.number}</span><button className="close-button" onClick={close} aria-label="cerrar proyecto" autoFocus>×</button></div>
        <h2 id="project-dialog-heading" className={`display-title${selected.kind === 'case-study' ? ' case-title' : ''}`}>{selected.name}<span className="outline">.</span></h2>
        {selected.summary && <p className="case-summary">{selected.summary}</p>}
        {(selected.mockup || !!selected.screenshots?.length) && <section className="case-gallery" aria-label="presentación visual del proyecto">
          {(selected.mockup ? [selected.mockup] : selected.screenshots ?? []).map(screenshot => <figure key={screenshot.src}>
            <img src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height} loading="lazy" decoding="async" />
            {screenshot.title && <figcaption>{screenshot.title}</figcaption>}
          </figure>)}
        </section>}
        <div className="project-story"><div><h3>Reto</h3><p>{selected.challenge}</p></div><div><h3>Propuesta</h3><p>{selected.approach}</p></div></div>
        {selected.kind === 'case-study' ? <ProjectCaseStudy project={selected} /> : <>
          {selected.category === 'fullstack' ? <TaskDemo /> : <DataDemo />}
          <p className="demo-footnote">{selected.category === 'fullstack' ? 'prototipo frontend. los datos permanecen en este navegador; no incluye servidor ni autenticación.' : 'las cifras son sintéticas y no representan resultados de un cliente.'}</p>
        </>}
        <div className="project-dialog-actions"><ProjectLink project={selected} /></div>
      </div>}
    </dialog>
  </section>;
}
