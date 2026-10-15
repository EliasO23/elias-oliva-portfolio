import { copyFile } from 'node:fs/promises';

// Los hosts estáticos pueden servir este documento para rutas inexistentes.
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url));
