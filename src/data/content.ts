export const profile = {
  name: 'elias oliva',
  role: 'Ingeniero en Sistemas',
  location: 'Remoto',
  email: 'elias.oliva08@outlook.com',
  github: 'https://github.com/EliasO23',
  linkedin: 'https://www.linkedin.com/in/elias-antonio-oliva-calderon/',
  availableForWork: true,
  // Coloca el PDF en public/documents/cv-elias-oliva.pdf.
  cvUrl: `${import.meta.env.BASE_URL}documents/cv-elias-oliva.pdf`,
};

export type ProjectCategory = 'fullstack' | 'datos' | 'ai' | 'backend' | 'rag' | 'web' | 'machine-learning';
export interface Project {
  id: string;
  number: string;
  name: string;
  category: ProjectCategory;
  description: string;
  image: string;
  imageAlt: string;
  tags: string[];
  challenge: string;
  approach: string;
  kind: 'demo' | 'case-study';
  githubUrl?: string;
  websiteUrl?: string;
  additionalCategories?: ProjectCategory[];
  categoryLabel?: string;
  summary?: string;
  objective?: string;
  solution?: string;
  technologies?: { group: string; tools: string[] }[];
  screenshots?: { src: string; title: string; alt: string; width: number; height: number }[];
  mockup?: { src: string; title?: string; alt: string; width: number; height: number };
  indicators?: string[];
  dataManagement?: string;
}

// Añade a githubUrl la URL del repositorio de cada proyecto para activar su botón.
export const projects: Project[] = [
  // {
  //   id: 'nexo', number: '01', name: 'nexo', category: 'fullstack',
  //   kind: 'demo', githubUrl: '',
  //   description: 'menos fricción. más foco.',
  //   image: '/assets/architecture.png',
  //   imageAlt: 'escultura de bloques de grafito y planos de cristal entrelazados',
  //   tags: ['react', 'typescript', 'estado local'],
  //   challenge: 'dar claridad al trabajo diario: qué está pendiente, qué está en marcha y qué ya está resuelto.',
  //   approach: 'una interfaz de tareas con creación, búsqueda, cambios de estado y persistencia local. una pequeña demostración de producto centrada en la interacción.',
  // },
  // {
  //   id: 'pulso', number: '02', name: 'pulso', category: 'datos',
  //   kind: 'demo', githubUrl: '',
  //   description: 'de números a decisiones.',
  //   image: '/assets/data-sculpture.png',
  //   imageAlt: 'onda tridimensional formada por varillas metálicas de distintas alturas',
  //   tags: ['visualización', 'métricas', 'análisis exploratorio'],
  //   challenge: 'transformar registros de ventas en una lectura comprensible de la evolución de un negocio.',
  //   approach: 'un panel con datos sintéticos, filtros de canal y métricas calculadas al instante. permite explorar ingresos, pedidos y ticket medio, y descargar los datos utilizados.',
  // },
  {
    id: 'seguimiento-becados', number: '01', name: 'Sistema de seguimiento de becados',
    category: 'fullstack', additionalCategories: ['datos'], categoryLabel: 'software + análisis de datos',
    kind: 'case-study', githubUrl: 'https://github.com/EliasO23/sistema_seguimiento_becas.git',
    description: 'seguimiento académico. decisiones basadas en datos.',
    image: `${import.meta.env.BASE_URL}assets/becados-mockup.png`,
    imageAlt: 'presentación del sistema de becados en un monitor sobre una base de grafito',
    mockup: { src: `${import.meta.env.BASE_URL}assets/seguimiento-becados.png`, alt: 'presentación de las interfaces del sistema', width: 1536, height: 1024 },
    tags: ['python', 'visualización', 'análisis exploratorio'],
    summary: 'Aplicación de escritorio para centralizar el seguimiento académico de estudiantes becados. Reúne asistencia, rendimiento, voluntariado y seguimientos individuales, y transforma los registros en indicadores de riesgo, visualizaciones y reportes.',
    challenge: 'La información dispersa en archivos y procesos manuales dificultaba conocer el estado académico de cada estudiante y detectar casos de riesgo. El reto fue reunir esos registros y convertirlos en información útil para monitores y coordinadores.',
    objective: 'Gestionar la información de estudiantes becados y analizar sus datos académicos para facilitar la toma de decisiones y el acompañamiento individual.',
    approach: 'Una aplicación de escritorio modular en python, con interfaz en customtkinter y componentes ttk. Los módulos comparten información almacenada en excel; pandas y numpy procesan los registros, matplotlib genera las visualizaciones y reportlab construye reportes pdf.',
    technologies: [
      { group: 'lenguaje', tools: ['Python'] },
      { group: 'interfaz', tools: ['Customtkinter', 'ttkbootstrap / ttk'] },
      { group: 'procesamiento', tools: ['Pandas', 'NumPy'] },
      { group: 'almacenamiento', tools: ['Excel', 'Openpyxl'] },
      { group: 'visualización y reportes', tools: ['Matplotlib', 'Reportlab', 'pillow'] },
    ],
  },
  {
    id: 'unab-agent', number: '02', name: 'unab agent',
    category: 'ai', additionalCategories: ['backend', 'rag'], categoryLabel: 'ia + sistemas rag',
    kind: 'case-study', githubUrl: 'https://github.com/EliasO23/unab_agent.git',
    description: 'documentos dispersos. respuestas con contexto.',
    image: `${import.meta.env.BASE_URL}assets/agentunab-mockup-oficina.png`,
    imageAlt: 'presentación de la vista principal del agente en un monitor sobre una base de grafito, acompañado de libros y lapiceros',
    mockup: {
      src: `${import.meta.env.BASE_URL}assets/unab-agent.png`,
      alt: 'presentación del asistente universitario con inteligencia artificial y arquitectura rag',
      width: 1536, height: 1024,
    },
    tags: ['python', 'fastapi', 'rag', 'ia generativa'],
    summary: 'Asistente universitario basado en inteligencia artificial y arquitectura rag, diseñado para responder consultas institucionales utilizando reglamentos, calendarios académicos y documentación oficial como fuente de conocimiento. Combina búsqueda semántica, recuperación de contexto y modelos de lenguaje para generar respuestas fundamentadas en la información disponible.',
    challenge: 'La información institucional se encontraba distribuida entre reglamentos, calendarios y diferentes documentos, lo que obligaba a revisar múltiples archivos para resolver una consulta. El reto fue crear un asistente capaz de comprender preguntas en lenguaje natural, localizar la información relevante y responder utilizando el contenido oficial disponible sin inventar información.',
    objective: 'Facilitar el acceso a información institucional mediante un asistente conversacional capaz de consultar documentación universitaria, recuperar los fragmentos más relevantes y generar respuestas claras y contextualizadas a partir de fuentes oficiales.',
    approach: 'Se desarrolló una arquitectura RAG con Python y FastAPI. Los documentos pdf, txt y markdown son procesados y divididos en fragmentos semánticos, que posteriormente se transforman en embeddings y se almacenan en pinecone. Cuando el usuario realiza una consulta, el sistema clasifica su intención, genera diferentes reformulaciones mediante multiquery retrieval, recupera los fragmentos más relevantes y utiliza Gemini para construir una respuesta basada en el contexto encontrado.',
    technologies: [
      { group: 'lenguaje y backend', tools: ['Python', 'FastAPI'] },
      { group: 'rag y orquestación', tools: ['Langchain', 'MultiQueryRetriever', 'semanticchunker'] },
      { group: 'modelos de lenguaje', tools: ['gemini 2.5 flash', 'cohere command-a-03-2025'] },
      { group: 'embeddings', tools: ['intfloat/multilingual-e5-small'] },
      { group: 'base vectorial', tools: ['Pinecone'] },
      { group: 'procesamiento documental', tools: ['pypdfloader', 'textloader', 'markdownloader'] },
    ],
  },
  {
    id: 'importadora-gyb', number: '03', name: 'importadora g&b',
    category: 'fullstack', additionalCategories: ['web'], categoryLabel: 'e-commerce + desarrollo web',
    kind: 'case-study', websiteUrl: 'https://importadoragyb.ec/',
    description: 'e-commerce. catálogo, experiencia y pedidos por whatsapp.',
    image: `${import.meta.env.BASE_URL}assets/mockup-importadoragyb-oficina.png`,
    imageAlt: 'presentación de la interfaz movil y de escritorio del ecommerce, sobre una base de grafito',
    mockup: {
      src: `${import.meta.env.BASE_URL}assets/importadoragyb.png`,
      alt: 'presentación del sitio web de Importadora G&B y en su version movil',
      width: 1536, height: 1024,
    },
    tags: ['wordpress', 'integraciones', 'javascript', 'php'],
    summary: 'Proyecto freelance desarrollado para una empresa de Ecuador dedicada a la venta de sillas de oficina, gamer y de diseño. Participé en la construcción del sitio web desde cero en WordPress, trabajando en su diseño, estructura y experiencia de navegación, además de implementar personalizaciones sobre el proceso de venta para conectar el catálogo con un flujo de pedidos mediante WhatsApp.',
    challenge: 'La empresa necesitaba establecer una presencia digital que permitiera presentar de forma organizada su catálogo de productos y facilitar el proceso de consulta y compra. Además de construir la tienda desde cero, uno de los principales retos fue adaptar el flujo tradicional de e-commerce a un modelo de atención donde los pedidos se continúan directamente mediante WhatsApp sin perder la información del cliente y los productos seleccionados.',
    objective: 'Diseñar y desarrollar una tienda online funcional para centralizar el catálogo de productos de la empresa, mejorar su presencia digital y facilitar que los clientes pudieran explorar productos y generar pedidos estructurados directamente hacia WhatsApp.',
    approach: 'Se construyó el sitio web en WordPress utilizando Elementor como base para la estructura del sitio web. Se trabajó en la organización visual, estructura de páginas y componentes de navegación de la tienda, complementando las funcionalidades existentes con personalizaciones en JavaScript y PHP. Para el proceso de pedidos se desarrolló un flujo que recopila información del comprador y genera automáticamente un mensaje estructurado con los datos del cliente y los productos seleccionados antes de continuar la conversación mediante WhatsApp.',
    technologies: [
      { group: 'cms', tools: ['WordPress'] },
      { group: 'page builder', tools: ['Elementor'] },
      { group: 'desarrollo', tools: ['JavaScript', 'PHP'] },
      { group: 'interfaz', tools: ['HTML', 'CSS', 'Swiper'] },
      { group: 'integraciones', tools: ['WhatsApp'] },
    ],
  },
  {
    id: 'riesgo-academico', number: '04', name: 'Predicción de riesgo académico',
    category: 'datos', additionalCategories: ['machine-learning'], categoryLabel: 'análisis de datos + machine learning',
    kind: 'case-study',
    description: 'datos académicos. detección temprana de riesgo.',
    image: `${import.meta.env.BASE_URL}assets/mockup-riesgoacademico-oficina.png`,
    imageAlt: 'interfaces del dashboard presentadas en un monitor sobre una base de grafito',
    mockup: {
      src: `${import.meta.env.BASE_URL}assets/riesgo-academico.png`,
      alt: 'presentación de los dashboards de análisis y modelo de predicción de riesgo académico',
      width: 1536, height: 1024,
    },
    tags: ['python', 'pandas', 'scikit-learn', 'machine learning'],
    summary: 'Proyecto de análisis de datos y machine learning orientado a identificar estudiantes con mayor probabilidad de presentar riesgo académico. El trabajo parte de un dataset de 100,000 registros y abarca exploración, preparación de datos, construcción de un modelo base, evaluación, mejoras y análisis de resultados.',
    challenge: 'El reto principal fue construir un modelo capaz de detectar patrones asociados al riesgo académico sin utilizar variables que revelaran directamente la categoría objetivo. Durante la preparación de los datos se identificó final_score como una posible fuente de data leakage, por lo que se excluyó del conjunto de variables predictoras para obtener una evaluación más realista del modelo.',
    objective: 'Desarrollar un modelo de clasificación que permita analizar información académica histórica y estimar el nivel de riesgo de los estudiantes, generando una base para futuras estrategias de seguimiento e intervención temprana.',
    approach: 'El proyecto se desarrolló siguiendo un flujo completo de machine learning: definición del problema, análisis exploratorio, revisión de calidad de datos, selección y transformación de variables, separación de los conjuntos de entrenamiento y prueba, construcción de un modelo baseline, evaluación mediante métricas de clasificación y aplicación de mejoras para comparar su desempeño.',
    technologies: [
      { group: 'lenguaje', tools: ['Python'] },
      { group: 'procesamiento', tools: ['Pandas', 'NumPy'] },
      { group: 'machine learning', tools: ['scikit-learn'] },
      { group: 'visualización', tools: ['matplotlib', 'seaborn'] },
      { group: 'entorno', tools: ['Google colab'] },
    ],
  },
];
