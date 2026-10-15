import { useEffect, useRef, type ReactNode } from 'react';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!element || preference.matches) return;
    element.classList.add('will-reveal');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.classList.add('is-visible'); observer.disconnect(); }
    }, { threshold: 0.08 });
    const show = () => { if (preference.matches) element.classList.add('is-visible'); };
    observer.observe(element);
    preference.addEventListener('change', show);
    return () => { observer.disconnect(); preference.removeEventListener('change', show); element.classList.remove('will-reveal'); };
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function MotionEffects() {
  const cursor = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const topLink = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(pointer: fine)');
    let frame = 0;
    let scrollFrame = 0;
    let lastPointer: { x: number; y: number } | null = null;
    const move = (event: PointerEvent) => {
      if (preference.matches || !pointer.matches) return;
      lastPointer = { x: event.clientX, y: event.clientY };
      const target = event.target instanceof Element ? event.target.closest('[data-cursor]') : null;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (cursor.current) {
          cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
          cursor.current.classList.toggle('cursor-visible', Boolean(target));
        }
      });
    };
    const hide = () => cursor.current?.classList.remove('cursor-visible');
    const scroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (progress.current) progress.current.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
        if (topLink.current) topLink.current.hidden = window.scrollY < window.innerHeight;
        const target = lastPointer && !preference.matches && pointer.matches
          ? document.elementFromPoint(lastPointer.x, lastPointer.y)?.closest('[data-cursor]')
          : null;
        cursor.current?.classList.toggle('cursor-visible', Boolean(target));
      });
    };
    const resetMotion = () => {
      hide();
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('scroll', scroll, { passive: true });
    preference.addEventListener('change', resetMotion);
    scroll();
    return () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(scrollFrame);
      window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide);
      window.removeEventListener('scroll', scroll); preference.removeEventListener('change', resetMotion);
    };
  }, []);
  return <>
    <div ref={progress} className="reading-progress" aria-hidden="true" />
    <div ref={cursor} className="project-cursor" aria-hidden="true"><span>explorar ↗</span></div>
    <a ref={topLink} className="back-top" href="#inicio" hidden aria-label="volver al inicio">↑</a>
  </>;
}
