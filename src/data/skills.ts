import {
  siReact, siJavascript, siTypescript, siPython, siGit, siGithub,
  siOdoo, siCloudflare, siWordpress, siMysql, siMariadb, siLangchain, siDocker,
  siHtml5, siBootstrap, siFastapi, siPhp, siPandas, siNumpy, siNextdotjs, siMake,
} from 'simple-icons';

export const skillCategories = [
  { id: 'desarrollo', label: 'Desarrollo', detail: 'interfaces y experiencias web' },
  { id: 'datos', label: 'Datos', detail: 'información con contexto' },
  { id: 'infraestructura', label: 'Infraestructura', detail: 'versionar, conectar y desplegar' },
  { id: 'automatizacion', label: 'Automatización', detail: 'procesos y sistemas conectados' },
] as const;

export type SkillCategory = typeof skillCategories[number]['id'];
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string;
  headline: string;
  description: string;
  uses: string[];
}

// Símbolos propios para Power BI, SQL Server, Pinecone, RAG y REST APIs.
// Las demás herramientas usan Simple Icons, incluidos en el bundle local.
export const skills: Skill[] = [
  { id: 'react', name: 'React', category: 'desarrollo', icon: siReact.path,
    headline: 'Interfaces que responden.', description: 'Componentes reutilizables, estado e interacción para transformar una idea en una experiencia web.', uses: ['componentes', 'interfaces', 'interacción'] },
  { id: 'javascript', name: 'JavaScript', category: 'desarrollo', icon: siJavascript.path,
    headline: 'La lógica de la experiencia.', description: 'Comportamiento, eventos y manejo de datos para dar vida a las interfaces y conectar sus distintas piezas.', uses: ['lógica', 'eventos', 'asincronía'] },
  { id: 'typescript', name: 'TypeScript', category: 'desarrollo', icon: siTypescript.path,
    headline: 'Claridad desde el código.', description: 'Tipos e interfaces para expresar la intención del código y detectar errores durante el desarrollo.', uses: ['tipos', 'contratos', 'mantenibilidad'] },
  { id: 'python', name: 'Python', category: 'datos', icon: siPython.path,
    headline: 'De la pregunta al análisis.', description: 'Scripts para explorar información, transformar datos y automatizar tareas repetitivas.', uses: ['análisis', 'scripts', 'transformación'] },
  { id: 'power-bi', name: 'Power BI', category: 'datos', icon: 'M3 13a1 1 0 0 1 1-1h3v10H4a1 1 0 0 1-1-1Zm6-6a1 1 0 0 1 1-1h4v16H9Zm7-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v19a1 1 0 0 1-1 1h-4Z',
    headline: 'Datos que se entienden.', description: 'Modelos, indicadores y paneles visuales para explorar el comportamiento de un negocio y comunicar hallazgos.', uses: ['paneles', 'indicadores', 'visualización'] },
  { id: 'git', name: 'git', category: 'infraestructura', icon: siGit.path,
    headline: 'Cada cambio tiene historia.', description: 'Control de versiones para organizar cambios, trabajar con ramas y mantener un historial claro del proyecto.', uses: ['versiones', 'ramas', 'colaboración'] },
  { id: 'github', name: 'GitHub', category: 'infraestructura', icon: siGithub.path,
    headline: 'Código que se comparte.', description: 'Repositorios, documentación y revisión de cambios para colaborar y dar seguimiento al desarrollo.', uses: ['repositorios', 'revisiones', 'documentación'] },
  { id: 'odoo', name: 'Odoo', category: 'automatizacion', icon: siOdoo.path,
    headline: 'Procesos que se conectan.', description: 'Aplicaciones de gestión y flujos de trabajo que conectan las distintas necesidades de una organización.', uses: ['gestión', 'módulos', 'procesos'] },
  { id: 'cloudflare', name: 'Cloudflare', category: 'infraestructura', icon: siCloudflare.path,
    headline: 'Una web bien conectada.', description: 'Dominios, distribución de contenido y servicios para poner proyectos web al alcance de sus usuarios.', uses: ['dominios', 'distribución', 'despliegue'] },
  { id: 'wordpress', name: 'WordPress', category: 'desarrollo', icon: siWordpress.path,
    headline: 'Contenido con estructura.', description: 'Sitios administrables que combinan contenido, diseño y funcionalidad para facilitar su actualización.', uses: ['sitios web', 'contenido', 'personalización'] },
  { id: 'mysql', name: 'MySQL', category: 'datos', icon: siMysql.path,
    headline: 'Una base para construir.', description: 'Datos relacionales, consultas y relaciones para organizar la información que necesita una aplicación.', uses: ['consultas', 'relaciones', 'persistencia'] },
  { id: 'sql-server', name: 'SQL Server', category: 'datos', icon: 'M12 1C6.48 1 2 2.79 2 5s4.48 4 10 4 10-1.79 10-4-4.48-4-10-4Zm-10 7v5c0 2.21 4.48 4 10 4s10-1.79 10-4V8c-2.15 1.88-6.02 3-10 3S4.15 9.88 2 8Zm0 8v3c0 2.21 4.48 4 10 4s10-1.79 10-4v-3c-2.15 1.88-6.02 3-10 3S4.15 17.88 2 16Z',
    headline: 'Información para decidir.', description: 'Consultas y organización de datos estructurados para alimentar análisis, reportes y aplicaciones.', uses: ['consultas', 'reportes', 'modelado'] },
  { id: 'mariadb', name: 'Maria DB', category: 'datos', icon: siMariadb.path,
    headline: 'Datos con una base sólida.', description: 'Almacenamiento relacional y consultas para conectar la lógica de las aplicaciones con información persistente.', uses: ['bases de datos', 'relaciones', 'consultas'] },
  { id: 'langchain', name: 'LangChain', category: 'automatizacion', icon: siLangchain.path,
    headline: 'Inteligencia con contexto.', description: 'Conexión de modelos de lenguaje, herramientas y fuentes de información en flujos de trabajo con ia.', uses: ['modelos de lenguaje', 'contexto', 'integración'] },
  { id: 'docker', name: 'Docker', category: 'infraestructura', icon: siDocker.path,
    headline: 'El mismo entorno, donde sea.', description: 'Contenedores para organizar dependencias y reproducir el entorno de una aplicación de forma consistente.', uses: ['contenedores', 'entornos', 'dependencias'] },
  { id: 'html-css', name: 'HTML5/CSS3', category: 'desarrollo', icon: siHtml5.path,
    headline: 'Estructura con intención.', description: 'Contenido semántico y estilos adaptables para crear páginas accesibles, ordenadas y cuidadas en cada pantalla.', uses: ['estructura', 'estilos', 'diseño adaptable'] },
  { id: 'bootstrap', name: 'Bootstrap', category: 'desarrollo', icon: siBootstrap.path,
    headline: 'Interfaces con una base común.', description: 'Rejillas, componentes y utilidades para construir interfaces adaptables y mantener consistencia visual.', uses: ['componentes', 'rejillas', 'prototipos'] },
  { id: 'fastapi', name: 'FastAPI', category: 'desarrollo', icon: siFastapi.path,
    headline: 'Python conectado a la web.', description: 'Servicios web con validación de datos y documentación de endpoints para conectar aplicaciones con su lógica de negocio.', uses: ['servicios web', 'validación', 'documentación'] },
  { id: 'php', name: 'PHP', category: 'desarrollo', icon: siPhp.path,
    headline: 'La lógica del lado del servidor.', description: 'Procesamiento de formularios, acceso a bases de datos y contenido dinámico para aplicaciones web.', uses: ['servidor', 'formularios', 'datos'] },
  { id: 'pandas', name: 'Pandas', category: 'datos', icon: siPandas.path,
    headline: 'Datos listos para explorar.', description: 'Limpieza, combinación y transformación de tablas para preparar información y responder preguntas con datos.', uses: ['limpieza', 'tablas', 'análisis'] },
  { id: 'numpy', name: 'NumPy', category: 'datos', icon: siNumpy.path,
    headline: 'Una base para el cálculo.', description: 'Arreglos y operaciones numéricas para transformar valores y apoyar el análisis de datos con python.', uses: ['arreglos', 'cálculo', 'operaciones numéricas'] },
  { id: 'pinecone', name: 'Pinecone', category: 'datos', icon: 'M12 1 3 7l9 6 9-6-9-6Zm-9 9v3l9 6 9-6v-3l-9 6-9-6Zm0 6v3l9 5 9-5v-3l-9 5-9-5Z',
    headline: 'Encontrar por significado.', description: 'Almacenamiento y búsqueda de vectores para recuperar información relacionada y aportar contexto a aplicaciones con ia.', uses: ['vectores', 'búsqueda semántica', 'contexto'] },
  { id: 'rag', name: 'RAG', category: 'automatizacion', icon: 'M2 3h8v6H2V3Zm12 12h8v6h-8v-6ZM5 11h2v6h5v2H5v-8Zm7-6h7v6h3l-4 4-4-4h3V7h-5V5Z',
    headline: 'Respuestas con contexto.', description: 'Recuperación de información relevante para acompañar las consultas a modelos de lenguaje con documentos y fuentes propias.', uses: ['recuperación', 'documentos', 'modelos de lenguaje'] },
  { id: 'nextjs', name: 'Next.js', category: 'desarrollo', icon: siNextdotjs.path,
    headline: 'De los componentes a la aplicación.', description: 'Rutas y renderizado con react para organizar experiencias web y conectar interfaces con funciones del servidor.', uses: ['rutas', 'renderizado', 'aplicaciones web'] },
  { id: 'rest-apis', name: 'Rest APIs', category: 'desarrollo', icon: 'm6 3 1.4 1.4L3.8 8l3.6 3.6L6 13 1 8l5-5Zm12 8 5 5-5 5-1.4-1.4 3.6-3.6-3.6-3.6L18 11ZM9 5h13v2H9V5ZM2 17h13v2H2v-2Z',
    headline: 'Aplicaciones que conversan.', description: 'Diseño y consumo de endpoints http para intercambiar datos, integrar servicios y conectar el cliente con el servidor.', uses: ['integración', 'endpoints', 'intercambio de datos'] },
  { id: 'make', name: 'Make', category: 'automatizacion', icon: siMake.path,
    headline: 'Menos tareas repetitivas, más posibilidades.', description: 'Flujos visuales para conectar aplicaciones, transformar datos y automatizar procesos mediante integraciones y webhooks.', uses: ['flujos de trabajo', 'integraciones', 'webhooks'] },
];
