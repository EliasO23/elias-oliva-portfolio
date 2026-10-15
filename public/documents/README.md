# Currículum

Coloca en esta carpeta tu currículum en PDF con este nombre exacto:

`cv-elias-oliva.pdf`

Ruta dentro del proyecto: `public/documents/cv-elias-oliva.pdf`.
Dirección pública: `/documents/cv-elias-oliva.pdf`.

La nueva sección de presentación (`#perfil`), situada debajo de la cinta, comprueba si el servidor entrega un PDF real. Hasta que lo añadas, el botón se mantiene desactivado y muestra «cv disponible próximamente».

Después de añadir el archivo, recarga la página. Si vas a publicar el sitio, vuelve a ejecutar `npm run build` y publica la carpeta `dist` actualizada, incluyendo el PDF.

Para cambiar el nombre o la ruta, edita `profile.cvUrl` en `src/content.ts`.
