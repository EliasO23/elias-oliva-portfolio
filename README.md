# Elías Oliva | Software Engineer & Data Analyst

Portafolio web personal de Elías Oliva, ingeniero en Sistemas con enfoque en desarrollo fullstack y análisis de datos. Presenta su perfil, habilidades, formación y una selección de proyectos de software, inteligencia artificial y análisis de información.

El sitio combina una estética editorial en tonos carbón y marfil con tipografía de gran formato, navegación por secciones e interacciones adaptadas a escritorio y dispositivos móviles.

## Contenido

- [Características principales](#características-principales)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Proyectos destacados](#proyectos-destacados)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Comandos disponibles](#comandos-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Personalización](#personalización)
- [Pruebas](#pruebas)
- [Compilación y despliegue](#compilación-y-despliegue)
- [Licencia](#licencia)
- [Autor y contacto](#autor-y-contacto)

## Características principales

- **Presentación personal:** hero con retrato, disponibilidad y enlaces a las secciones principales.
- **Perfil y especialidades:** introducción profesional y enfoque en desarrollo fullstack y análisis de datos.
- **Habilidades interactivas:** herramientas organizadas por área, filtros y detalles de cada tecnología.
- **Catálogo de proyectos:** filtros por categoría y fichas con contexto, objetivos, tecnologías e imágenes, además de enlaces cuando están configurados.
- **Formación y proceso de trabajo:** recorrido académico y acordeón que explica las etapas de trabajo.
- **Contacto:** formulario que envía los datos a un webhook de Make, con estado de envío y recuperación ante errores.
- **Diseño adaptable y accesibilidad:** navegación por teclado, foco visible, enlace para saltar al contenido y respeto por la preferencia de movimiento reducido.
- **Página 404 personalizada:** vista para rutas desconocidas con acceso de regreso al inicio.

## Tecnologías utilizadas

| Tecnología | Uso en el portafolio |
| --- | --- |
| React 19 | Componentes de interfaz y manejo del estado |
| TypeScript 5.7 | Tipado del código y de los datos |
| Vite 6 | Servidor de desarrollo y compilación para producción |
| Tailwind CSS 4 | Utilidades de estilo integradas mediante el plugin de Vite |
| CSS | Diseño editorial, animaciones y estilos adaptables |
| Simple Icons | Iconos de tecnologías y herramientas |
| Playwright | Pruebas de interfaz en navegador |

El portafolio es una aplicación frontend estática. Los proyectos que presenta pueden utilizar otras tecnologías; estas no son dependencias del sitio.

## Proyectos destacados

| Proyecto | Descripción |
| --- | --- |
| Sistema de seguimiento de becados | Aplicación de escritorio para seguimiento académico, indicadores y reportes |
| UNAB Agent | Asistente con recuperación de información documental y modelos de lenguaje |
| Importadora G&B | Sitio de comercio electrónico en WordPress con pedidos mediante WhatsApp |
| Predicción de riesgo académico | Análisis de datos y modelos de clasificación para detectar riesgo académico |

Las fichas se definen en `src/data/content.ts`. 

## Instalación y ejecución

### Requisitos

- Node.js 22 o superior.
- npm.
- Google Chrome para ejecutar las pruebas con la configuración actual de Playwright.

### Desarrollo local

Descarga o clona el repositorio y abre una terminal en la raíz del proyecto.

```sh
npm ci
npm run dev
```

Abre la dirección indicada por Vite en la terminal, normalmente `http://127.0.0.1:5173`.

### Contacto protegido con Turnstile

El formulario envía a `/api/contact`. El servidor valida los campos, verifica el token con Cloudflare (incluidos hostname y action) y después entrega a Make únicamente `interest`, `name`, `email` y `message`. Una respuesta correcta confirma recepción, no la finalización del escenario.

Copia `.env.example` a `.env.local` si aún no existe. Configura `MAKE_WEBHOOK_URL` con tu webhook. El archivo de ejemplo incluye las claves oficiales de prueba para localhost:

```dotenv
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
TURNSTILE_TEST_MODE=true
TURNSTILE_ALLOWED_HOSTNAMES=localhost,127.0.0.1
MAKE_WEBHOOK_URL=https://hook.tu-region.make.com/tu-webhook
```

Solo `TURNSTILE_SITE_KEY` es pública. La clave secreta y el webhook se leen exclusivamente en el servidor; no se incluyen en el bundle del navegador. No añadas prefijos `VITE_` a secretos.

Ejecuta `npm run dev`: un adaptador de desarrollo sirve la misma lógica de `api/contact.ts` desde Vite, sin necesitar cuenta de Vercel. Reinicia el servidor después de cambiar variables. Necesitas conexión a Cloudflare. Las claves de prueba simulan la verificación; un envío manual válido sí contacta al webhook configurado, por lo que conviene usar un escenario de pruebas.

La API limita el cuerpo a 16 KiB, valida longitudes y categorías, rechaza tokens ausentes o inválidos y no reintenta automáticamente llamadas a Make. El formulario conserva los datos si falla, renueva el token después de cada intento y ofrece reintentar si Turnstile no carga o expira.

### Publicar en Vercel

1. Importa o vincula este proyecto como Vite. `api/contact.ts` se ejecutará como Vercel Function. No basta publicar solo `dist/` en un alojamiento estático: esa carpeta no contiene el servidor.
2. Crea un widget Turnstile (Managed) y registra el dominio público del sitio.
3. Configura en Vercel las claves reales `TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY`, `MAKE_WEBHOOK_URL`, `TURNSTILE_TEST_MODE=false` y `TURNSTILE_ALLOWED_HOSTNAMES=tu-proyecto.vercel.app,tu-dominio.com` (solo los dominios que uses, sin protocolo ni rutas).
4. Las claves de prueba y el modo de prueba son rechazados por la API en Production y Preview. Configura también claves reales y dominios permitidos para probar un despliegue Preview.
5. Despliega y verifica el flujo. Puedes usar `vercel dev` para probar el entorno Vercel localmente tras vincular el proyecto y configurar sus variables Development.

Turnstile reduce abuso automatizado; un límite de solicitudes adicional puede ayudar ante envíos repetidos. No se ha añadido un limitador persistente en esta integración.

Referencias: [Turnstile y claves de prueba](https://developers.cloudflare.com/turnstile/troubleshooting/testing/), [validación de tokens](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [funciones Node.js de Vercel](https://vercel.com/docs/functions/runtimes/node-js).

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm ci` | Instala las dependencias según `package-lock.json` |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Verifica TypeScript, compila el sitio y genera `dist/404.html` |
| `npm run preview` | Sirve localmente la compilación de `dist/` |
| `npx playwright test` | Ejecuta las pruebas con un servidor aislado iniciado automáticamente |

## Estructura del proyecto

```text
.
├── public/
│   ├── assets/                 # Retratos, imágenes y mockups de proyectos
│   ├── documents/              # Ubicación prevista para el currículum PDF
│   └── favicon.ico
├── scripts/
│   └── create-404.mjs          # Genera el documento 404 de producción
├── src/
│   ├── components/            # Componentes React y su CSS específico
│   │   ├── App.tsx            # Composición de las secciones del sitio
│   │   ├── Hero.tsx
│   │   ├── ProfileIntro.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Education.tsx
│   │   ├── Contact.tsx
│   │   ├── NotFound.tsx
│   │   ├── Motion.tsx
│   │   └── Demos.tsx
│   ├── data/
│   │   ├── content.ts         # Perfil y catálogo de proyectos
│   │   └── skills.ts          # Categorías y detalles de habilidades
│   ├── styles/
│   │   └── global.css         # Estilos globales y sistema editorial
│   ├── main.tsx               # Montaje de React y selección de la vista inicial
│   └── vite-env.d.ts
├── tests/                     # Pruebas de interfaz con Playwright
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Los componentes utilizan nombres PascalCase. El CSS específico de un componente se guarda junto a él, como `Skills.css`; los estilos compartidos se concentran en `src/styles/global.css`.

Las carpetas `node_modules/`, `dist/`, `test-results/` y `artifacts/` se generan localmente y están excluidas del control de versiones.

## Personalización

| Contenido | Archivo o ubicación |
| --- | --- |
| Nombre, correo, redes y disponibilidad | `profile` en `src/data/content.ts` |
| Proyectos, categorías, imágenes y enlaces | `projects` en `src/data/content.ts` |
| Herramientas, iconos y categorías de habilidades | `src/data/skills.ts` |
| Presentación profesional | `src/components/ProfileIntro.tsx` |
| Formación académica | `src/components/Education.tsx` |
| Orden de secciones y proceso de trabajo | `src/components/App.tsx` |
| Presentación del hero | `src/components/Hero.tsx` |
| Colores, tipografía y estilos compartidos | `src/styles/global.css` |
| Título y metadatos HTML | `index.html` |

## Pruebas

Playwright usa Google Chrome e inicia automáticamente un servidor aislado en `http://127.0.0.1:5174` con un webhook ficticio. Las pruebas de contacto simulan Turnstile y las solicitudes; las pruebas de API inyectan respuestas de los proveedores. No activan el escenario real de Make.

```sh
npx playwright test
```

Para verificar solo el formulario:

```sh
npx playwright test tests/contact.spec.ts tests/contact-api.spec.ts
```

La suite cubre navegación, adaptación a distintos anchos, proyectos, habilidades, contacto, movimiento reducido y página 404. Contacto comprueba el JSON enviado, el bloqueo durante el envío, la validación, la limpieza tras la confirmación y la conservación de datos ante errores HTTP, de red o de tiempo de espera.

Los resultados se guardan en `test-results/` y algunas pruebas generan capturas en `artifacts/`.

## Compilación y despliegue

Genera y revisa la versión de producción:

```sh
npm run build
npm run preview
```

La carpeta `dist/` contiene los archivos estáticos que deben publicarse. La compilación también copia los recursos de `public/` y genera `404.html` mediante `scripts/create-404.mjs`.

| Parámetro | Valor |
| --- | --- |
| Comando de instalación | `npm ci` |
| Comando de compilación | `npm run build` |
| Directorio de salida | `dist` |

Si el sitio se publica bajo una subruta, configura `base` en `vite.config.ts` antes de compilar para que las URLs de los recursos coincidan con esa ubicación.

Para las rutas desconocidas, configura el alojamiento para servir el documento `404.html`. En servidores con fallback a `index.html`, React también muestra la página de error, aunque el código de estado HTTP depende del alojamiento.

## Licencia

El código fuente propio y la documentación técnica de este proyecto se distribuyen
bajo la [licencia MIT](LICENSE). Puedes reutilizarlos, modificarlos y distribuirlos,
incluso comercialmente, conservando el aviso de autoría y la licencia.

Las **fotografías personales, el currículum y los textos personales** quedan
excluidos de MIT y tienen sus derechos reservados. Los recursos de terceros
mantienen sus respectivas licencias. Consulta [NOTICE.md](NOTICE.md) para conocer
el alcance, las ubicaciones del contenido excluido y el contacto para solicitar
autorización.

## Autor y contacto

**Elías Oliva** · Ingeniería en Sistemas, desarrollo fullstack y análisis de datos.

- GitHub: [EliasO23](https://github.com/EliasO23)
- LinkedIn: [Elías Antonio Oliva Calderón](https://www.linkedin.com/in/elias-antonio-oliva-calderon/)
- Correo: [elias.oliva08@outlook.com](mailto:elias.oliva08@outlook.com)




