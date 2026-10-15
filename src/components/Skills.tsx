import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { skillCategories, skills, type SkillCategory } from '../data/skills';
import { Reveal } from './Motion';
import './Skills.css';

function Icon({ path }: { path: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d={path} /></svg>;
}

function moveHighlight(event: PointerEvent<HTMLButtonElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--light-x', `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty('--light-y', `${event.clientY - bounds.top}px`);
}

export function Skills() {
  const [category, setCategory] = useState<SkillCategory>('desarrollo');
  const [selectedId, setSelectedId] = useState(skills[0].id);
  const detailRef = useRef<HTMLDivElement>(null);
  const shown = skills.filter(skill => skill.category === category);
  const selected = skills.find(skill => skill.id === selectedId) ?? skills[0];
  const selectedCategory = skillCategories.find(item => item.id === selected.category)!;

  function filter(next: typeof category) {
    setCategory(next);
    const nextSkills = skills.filter(skill => skill.category === next);
    if (!nextSkills.some(skill => skill.id === selectedId)) setSelectedId(nextSkills[0].id);
  }

  function selectSkill(id: string) {
    setSelectedId(id);
    if (window.matchMedia('(max-width: 767px)').matches) {
      detailRef.current?.scrollIntoView({
        block: 'center',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  }

  return (
    <section id="habilidades" className="section-shell skills-section" aria-labelledby="skills-heading">
      <Reveal>
        <div className="section-kicker"><span>03 / Mis habilidades</span><span>El cómo detrás de cada idea</span></div>
        <div className="section-heading-row">
          <h2 id="skills-heading" className="display-title">distintas piezas.<br /><span className="outline">mismo propósito.</span></h2>
          <p className="section-aside">Un stack para conectar<br />interfaces, sistemas y datos.</p>
        </div>
      </Reveal>

      <div className="skills-toolbar">
        <div className="skills-filters" role="group" aria-label="filtrar habilidades por área">
          {skillCategories.map(item => <button key={item.id} type="button" onClick={() => filter(item.id)} aria-pressed={category === item.id} aria-controls="skills-grid">{item.label}<span>{skills.filter(skill => skill.category === item.id).length}</span></button>)}
        </div>
        <p className="skills-counter" role="status">{String(shown.length).padStart(2, '0')} / {skills.length} herramientas</p>
      </div>

      <Reveal>
        <div className="skills-workbench">
          <div ref={detailRef} id="skill-detail" className="skill-detail" aria-live="polite" aria-atomic="true">
            <div className="skill-detail-content" key={selected.id}>
              <div className="skill-detail-top"><span>{selectedCategory.label}</span><span aria-hidden="true">↗</span></div>
              <div className="skill-emblem" aria-hidden="true"><div className="skill-orbit" /><div className="skill-orbit skill-orbit-inner" /><Icon path={selected.icon} /></div>
              <h3>{selected.name}<span className="outline">.</span></h3>
              <p className="skill-headline">{selected.headline}</p>
              <p className="skill-description">{selected.description}</p>
              <div className="skill-uses">{selected.uses.map(use => <span key={use}>{use}</span>)}</div>
            </div>
          </div>

          <div className="skills-catalog">
            <div id="skills-grid" className="skills-grid" role="group" aria-label="herramientas disponibles">
              {shown.map((skill, index) => (
                <button key={skill.id} type="button" className="skill-tool" aria-pressed={selectedId === skill.id} aria-controls="skill-detail" onClick={() => selectSkill(skill.id)} onPointerMove={moveHighlight} style={{ '--skill-order': index } as CSSProperties}>
                  <span className="skill-tool-index" aria-hidden="true">{String(skills.indexOf(skill) + 1).padStart(2, '0')}</span>
                  <span className="skill-tool-arrow" aria-hidden="true">↗</span>
                  <span className="skill-tool-icon"><Icon path={skill.icon} /></span>
                  <span className="skill-tool-name">{skill.name}</span>
                </button>
              ))}
            </div>
            <div className="skills-catalog-footer"><span>elige una herramienta para conocer su enfoque.</span><span aria-hidden="true">↖</span></div>
          </div>
        </div>
      </Reveal>
      <div className="skills-bottom"><span>la herramienta cambia. el criterio permanece.</span><a className="text-link" href="#proyectos">ver las ideas en acción <span aria-hidden="true">↗</span></a></div>
    </section>
  );
}
