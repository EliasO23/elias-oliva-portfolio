import type { Project } from '../data/content';

// Only editorial content is localized; URLs, IDs, categories and assets are shared.
export const projectTranslations: Record<string, Partial<Project>> = {
  'seguimiento-becados': {
    name: 'Scholarship tracking system', categoryLabel: 'software + data analytics',
    description: 'academic tracking. data-driven decisions.',
    imageAlt: 'scholarship tracking system displayed on a monitor on a graphite stand',
    tags: ['python', 'visualization', 'exploratory analysis'],
    summary: 'A desktop application that centralizes academic tracking for scholarship students. It brings together attendance, performance, volunteering and individual follow-ups, turning records into risk indicators, visualizations and reports.',
    challenge: 'Information scattered across files and manual processes made it difficult to assess each student’s academic progress and identify students at risk. The challenge was to bring those records together and turn them into useful information for mentors and coordinators.',
    objective: 'Manage scholarship students’ information and analyze academic data to support decision-making and individual guidance.',
    approach: 'A modular Python desktop application with CustomTkinter and ttk interfaces. Modules share information stored in Excel; pandas and NumPy process the records, Matplotlib creates visualizations and ReportLab generates PDF reports.',
  },
  'unab-agent': {
    categoryLabel: 'AI + RAG systems', description: 'scattered documents. answers with context.',
    imageAlt: 'university assistant displayed on a monitor on a graphite stand, alongside books and pens',
    tags: ['python', 'fastapi', 'rag', 'generative AI'],
    summary: 'An AI university assistant built with a RAG architecture to answer institutional questions using regulations, academic calendars and official documents as its knowledge base. It combines semantic search, context retrieval and language models to generate answers grounded in the available information.',
    challenge: 'Institutional information was spread across regulations, calendars and other documents, requiring users to review multiple files to answer a question. The challenge was to build an assistant that could understand natural-language questions, find relevant information and answer from official sources without inventing facts.',
    objective: 'Make institutional information easier to access through a conversational assistant that searches university documents, retrieves relevant passages and generates clear, contextual answers grounded in official sources.',
    approach: 'Built a RAG architecture with Python and FastAPI. PDF, text and Markdown documents are processed and split into semantic chunks, converted to embeddings and stored in Pinecone. For each query, the system classifies intent, generates alternative formulations using multi-query retrieval, retrieves relevant passages and uses Gemini to compose an answer based on the retrieved context.',
  },
  'importadora-gyb': {
    categoryLabel: 'e-commerce + web development', description: 'e-commerce. product discovery and WhatsApp orders.',
    imageAlt: 'mobile and desktop e-commerce interfaces displayed on a graphite stand',
    tags: ['wordpress', 'integrations', 'javascript', 'php'],
    summary: 'A freelance project for an Ecuadorian company selling office, gaming and designer chairs. I helped build its WordPress website from scratch, working on design, structure and navigation, and customized the sales process to connect the product catalog with a WhatsApp ordering flow.',
    challenge: 'The company needed a digital presence to organize its product catalog and make inquiries and purchases easier. Alongside building the store from scratch, a key challenge was adapting a traditional e-commerce flow to a service model where orders continue on WhatsApp while retaining customer details and selected products.',
    objective: 'Design and develop a functional online store to centralize the company’s product catalog, strengthen its digital presence and let customers explore products and send structured orders directly to WhatsApp.',
    approach: 'Built the WordPress website using Elementor for the page structure. Organized the store’s visual design, pages and navigation, extending its functionality with JavaScript and PHP. Created an ordering flow that collects buyer information and automatically generates a structured message with customer details and selected products before continuing the conversation on WhatsApp.',
  },
  'riesgo-academico': {
    name: 'Academic risk prediction', categoryLabel: 'data analytics + machine learning',
    description: 'academic data. early risk detection.',
    imageAlt: 'analytics dashboards displayed on a monitor on a graphite stand',
    summary: 'A data analytics and machine learning project to identify students more likely to face academic risk. Starting with a dataset of 100,000 records, the work covers exploration, data preparation, baseline modeling, evaluation, improvements and analysis of results.',
    challenge: 'The main challenge was to detect patterns associated with academic risk without using variables that directly reveal the target category. During data preparation, final_score was identified as a potential source of data leakage and excluded from the predictors to obtain a more realistic evaluation.',
    objective: 'Develop a classification model to analyze historical academic information and estimate students’ risk levels, providing a foundation for future monitoring and early intervention strategies.',
    approach: 'Followed a complete machine learning workflow: problem definition, exploratory analysis, data quality checks, feature selection and transformation, train-test splitting, baseline modeling, classification metrics and iterative improvements to compare performance.',
  },
};

export const projectTerms: Record<string, string> = {
  'presentación de las interfaces del sistema': 'overview of the system interfaces',
  'presentación del asistente universitario con inteligencia artificial y arquitectura rag': 'overview of the AI university assistant and its RAG architecture',
  'presentación del sitio web de Importadora G&B y en su version movil': 'desktop and mobile views of the Importadora G&B website',
  'presentación de los dashboards de análisis y modelo de predicción de riesgo académico': 'overview of the analytics dashboards and academic risk prediction model',
  'lenguaje': 'language', 'interfaz': 'interface', 'procesamiento': 'processing', 'almacenamiento': 'storage',
  'visualización y reportes': 'visualization and reporting', 'lenguaje y backend': 'language and backend',
  'rag y orquestación': 'RAG and orchestration', 'modelos de lenguaje': 'language models',
  'base vectorial': 'vector database', 'procesamiento documental': 'document processing',
  'integraciones': 'integrations', 'visualización': 'visualization', 'entorno': 'environment',
};
