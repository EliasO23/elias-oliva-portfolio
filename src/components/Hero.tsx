import { useEffect, useRef, useState, type ReactNode } from 'react';
import './Hero.css';

export interface HeroProps {
  name?: string;
  location?: string;
  portraitSrc?: string;
  portraitAlt?: string;
  backgroundVideoSrc?: string;
  availableForWork?: boolean;
  links?: { projects?: string; about?: string; contact?: string };
}

function Destination({ href, children, className = '' }: {
  href?: string; children: ReactNode; className?: string;
}) {
  return href
    ? <a href={href} className={className}>{children}</a>
    : <span className={`${className} unconfigured`} aria-disabled="true">{children}</span>;
}

function TitleWords() {
  return <><span className="word word-code">código</span><span className="word word-with">con</span><span className="word word-purpose">criterio.</span></>;
}

export function Hero({ name = 'elias oliva', location = 'remoto', portraitSrc,
  portraitAlt = '', backgroundVideoSrc = '', availableForWork = false, links = {},
}: HeroProps) {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [failedPortrait, setFailedPortrait] = useState<string>();
  const [failedVideo, setFailedVideo] = useState<string>();
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotionAllowed(!query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const stage = stageRef.current;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
    if (!stage || !motionAllowed) return;
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      stage.style.setProperty('--hero-x', '0px');
      stage.style.setProperty('--hero-y', '0px');
    };
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = stage.getBoundingClientRect();
        stage.style.setProperty('--hero-x', `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 16}px`);
        stage.style.setProperty('--hero-y', `${(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 10}px`);
      });
    };
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerleave', reset);
    finePointer.addEventListener('change', reset);
    window.addEventListener('blur', reset);
    return () => {
      reset();
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', reset);
      finePointer.removeEventListener('change', reset);
      window.removeEventListener('blur', reset);
    };
  }, [motionAllowed]);
  const hasPortrait = Boolean(portraitSrc && failedPortrait !== portraitSrc);

  return (
    <section className={`hero relative isolate w-full overflow-hidden bg-[#171715] text-[#E9DFC5] ${hasPortrait ? 'has-portrait' : ''}`} aria-label="presentación">
      {backgroundVideoSrc && motionAllowed && failedVideo !== backgroundVideoSrc && <>
        <video key={backgroundVideoSrc} className="absolute inset-0 h-full w-full object-cover" src={backgroundVideoSrc} autoPlay loop muted playsInline aria-hidden="true" onError={() => setFailedVideo(backgroundVideoSrc)} />
        <div className="absolute inset-0 bg-[#171715]/80" />
      </>}

      <header className="hero-header relative z-30 flex items-center justify-between gap-4">
        <Destination className="brand pill flex items-center gap-3" href={links.about}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18" stroke="currentColor" strokeWidth="1.5" /></svg>
          <span>{name}</span>
        </Destination>
        <nav aria-label="navegación principal" className="pill center-nav hidden md:flex items-center gap-1">
          <Destination href={links.projects}>Proyectos</Destination>
          <Destination href={links.about}>Sobre mí</Destination>
          <Destination href={links.contact}>Contacto</Destination>
        </nav>
        <Destination className="contact-button inline-flex items-center gap-7 rounded-full" href={links.contact}>Hablemos <span aria-hidden="true">↗</span></Destination>
      </header>

      <div ref={stageRef} className="editorial-stage relative">
        <div className="eyebrow">Ingeniero en sistemas | Fullstack jr & Datos</div>
        {availableForWork && <div className="availability flex items-center gap-2.5"><span className="status-dot" />Disponible para proyectos</div>}
        <h1 className="hero-title"><span className="sr-only">código con criterio.</span><span aria-hidden="true"><TitleWords /></span></h1>
        <div className="intro">
          <span className="intro-marker" aria-hidden="true">↳</span>
          <p>Construyo experiencias web y encuentro historias en los datos. Cada detalle tiene una razón.</p>
          <Destination className="project-link inline-flex items-center justify-between gap-6" href={links.projects}>explorar proyectos <span aria-hidden="true">↗</span></Destination>
        </div>
        {hasPortrait && <div className="portrait-layer"><img src={portraitSrc} alt={portraitAlt} onError={() => setFailedPortrait(portraitSrc)} /><div className="portrait-fade" /></div>}
        {hasPortrait && <div className="hero-title title-outline" aria-hidden="true"><TitleWords /></div>}
        <div className="edition-note" aria-hidden="true">Pensando con intención.<br />Construyendo con precisión.</div>
      </div>

      <footer className="hero-footer relative z-20 flex flex-wrap items-center justify-between gap-5">
        <p>Desarrollo de Software & Análisis de Datos <span className="footer-dot">·</span> {location}</p>
        <Destination className="selection-link inline-flex items-center gap-8" href={links.projects}>selección de proyectos <span aria-hidden="true">↓</span></Destination>
      </footer>
    </section>
  );
}
