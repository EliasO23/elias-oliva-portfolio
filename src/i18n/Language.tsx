import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en } from './en';
import { projectTerms, projectTranslations } from './projects.en';
import { skillTranslations } from './skills.en';
import { projects as sourceProjects } from '../data/content';
import { skills as sourceSkills } from '../data/skills';

export type Language = 'es' | 'en';
const dictionary = { ...en, ...projectTerms };
const storageKey = 'portfolio-language';
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem(storageKey) === 'en' ? 'en' : 'es'; }
    catch { return 'es'; }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem(storageKey, language); } catch { /* Works without storage. */ }
    const isHome = [import.meta.env.BASE_URL, `${import.meta.env.BASE_URL}index.html`].includes(location.pathname);
    document.title = isHome
      ? (language === 'en' ? 'elias oliva | Software Engineer & Data Analyst' : 'elias oliva | Ingeniero en Sistemas y Analista de Datos')
      : `404 · ${language === 'en' ? 'Page not found' : 'Página no encontrada'} | elias oliva`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'en'
      ? 'elias oliva · systems engineer, junior fullstack developer and data analyst. Code with purpose, web experiences and stories in data.'
      : 'elias oliva · ingeniero en sistemas, desarrollador fullstack jr y analista de datos. código con criterio, experiencias web y datos que cuentan historias.');
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider is required');
  const { language } = context;
  return useMemo(() => {
    const t = (text: string) => language === 'en' ? dictionary[text] ?? text : text;
    const projects = sourceProjects.map(project => ({
      ...project,
      ...(language === 'en' ? projectTranslations[project.id] : {}),
      technologies: project.technologies?.map(technology => ({ ...technology, group: t(technology.group) })),
      mockup: project.mockup && { ...project.mockup, alt: t(project.mockup.alt), title: project.mockup.title && t(project.mockup.title) },
      screenshots: project.screenshots?.map(screenshot => ({ ...screenshot, alt: t(screenshot.alt), title: t(screenshot.title) })),
    }));
    const skills = sourceSkills.map(skill => ({ ...skill, ...(language === 'en' ? skillTranslations[skill.id] : {}) }));
    return { ...context, t, projects, skills };
  }, [context, language]);
}

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const nextLanguage = language === 'es' ? 'en' : 'es';
  const label = language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish';
  return <button className="language-selector pill" type="button" aria-label={label} title={label}
    onClick={() => setLanguage(nextLanguage)}>
    <svg className="language-flag" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      {nextLanguage === 'en' ? <>
        <path fill="#fff" d="M0 0h32v32H0z" />
        {Array.from({ length: 7 }, (_, row) => <rect key={row} x="0" y={row * 64 / 13} width="32" height={32 / 13} fill="#B22234" />)}
        <path fill="#3C3B6E" d="M0 0h18v17.23H0z" />
        {Array.from({ length: 9 }, (_, row) => Array.from({ length: row % 2 === 0 ? 6 : 5 }, (_, column) => (
          <path key={`${row}-${column}`} fill="#fff" transform={`translate(${1.5 + column * 3 + (row % 2) * 1.5} ${1.7 + row * 1.7})`}
            d="M0-.7.16-.22H.67L.26.08.42.57 0 .27-.42.57-.26.08-.67-.22H-.16Z" />
        )))}
      </> : <>
        <path fill="#AA151B" d="M0 0h32v32H0z" />
        <path fill="#F1BF00" d="M0 8h32v16H0z" />
        {/* Compact coat of arms, kept legible at icon size. */}
        <path fill="#AA151B" d="m8 12 1-2 1.5 1 1.5-1 1 2v1H8z" />
        <path fill="#fff" stroke="#AA151B" strokeWidth=".6" d="M8 14h5v4c0 2-2.5 3-2.5 3S8 20 8 18z" />
        <path fill="#AA151B" d="M8.4 14.4h2v2.5h-2zm2.1 2.6h2.1v1.3L10.5 20z" />
        <path stroke="#fff" strokeWidth="1" d="M6 14v6m9-6v6" />
        <path stroke="#AA151B" strokeWidth=".7" d="M5 16h2m7 0h2" />
      </>}
    </svg>
    {nextLanguage.toUpperCase()}
  </button>;
}
