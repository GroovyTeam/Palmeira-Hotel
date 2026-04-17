# Hotel Palmeira — Project Memory

## 🧠 Conciencia y Memoria del Proyecto
Este archivo actúa como la memoria central y conciencia del asistente. Se actualizará obligatoriamente después de cada corrección, prompt o cambio significativo para asegurar la integridad del diseño "Editorial Tranquility" y la continuidad del contexto.

## 📋 Resumen del Proyecto
Migración integral del sitio web de Hotel Palmeira hacia el sistema de diseño **"Editorial Tranquility"**. El objetivo es modernizar la UI/UX, optimizar el rendimiento mediante la eliminación de layouts redundantes y mejorar la tasa de conversión para reservas.

## 🛠️ Decisiones Técnicas Clave
- **Arquitectura Responsiva:** Se eliminaron los 3 layouts duplicados en `index.html`. Ahora el sitio usa un único layout basado en CSS Flexbox/Grid.
- **Breakpoints de Navegación:** Se estableció el cambio de menú horizontal a menú de hamburguesa en los **1024px** para evitar solapamientos en dispositivos medianos.
- **Design Tokens:** Uso de variables CSS para colores (Teal, Sand, Gold) y tipografías (Noto Serif y Manrope).
- **Micro-Responsividad:** Se añadieron Media Queries para dispositivos ultra-pequeños (<400px).
- **SEO & Metadatos:** Implementación de JSON-LD (Hotel Schema), etiquetas Open Graph/Twitter corregidas y URL canónica configurada.
- **Optimización de Imágenes:** Aplicación de `loading="lazy"`, `fetchpriority` y atributos `alt` descriptivos para mejora de Core Web Vitals y accesibilidad.
- **Preloader de Activos:** Implementada pantalla de carga personalizada con sincronización.go oficial animado y sincronización de carga de activos (imágenes y mapas).
- **Optimización Safari:** Se rediseñó el Nav para pantallas móviles.
- **Lógica Unificada:** Consolidación de scripts en `formulario.js` y `slider.js`.
- **Politica de Memoria (2026-04-16):** Se establece la actualización este archivo tras cada interacción como eje central del desarrollo.

## ✅ Hitos Completados
- [x] Auditoría de arquitectura inicial.
- [x] Implementación del Sistema de Diseño (CSS Tokens).
- [x] Refactorización de `index.html` a un layout único responsivo.
- [x] Unificación de lógica de navegación (Scroll-spy y Mobile Toggle).
- [x] Implementación del nuevo Slider de habitaciones único.
- [x] Solución de solapamiento en barra de navegación (Tablet Fix): Breakpoint movido a 1024px.
- [x] Solución de solapamiento en barra de navegación (iPhone SE Fix).
- [x] Optimización de SEO e Imágenes.
- [x] Limpieza técnica de archivos legacy.
- [x] Implementación del Preloader editorial.
- [x] Ajuste de densidades: Reducción de espacios excesivos entre secciones.
- [x] Optimización Safari iOS: Transición de Nav flotante a Nav anclado.
- [x] Migración de validaciones de formulario con SweetAlert2.

## ⏳ Tareas Pendientes / Futuras
- [ ] Limpieza total de archivos legacy (Finalizada).
- [ ] Revisión continua de métricas de carga.

## 📝 Notas de Versión
- **SEO & Image Performance (2026-04-16):** Despliegue de datos estructurados y estrategias de carga diferida.
- **Branding Preloader (2026-04-16):** Personalización del preloader con logo y colores corporativos.
- **UI Density Polish (2026-04-16):** Ajuste de paddings en secciones y márgenes de seguridad en subtítulos hero.
- **Safari iOS Optimization (2026-04-16):** Eliminación del conflicto de "doble cápsula" mediante el rediseño del Nav en móviles.
- **Optimización iPhone SE (2026-04-16):** Se corrigió el desbordamiento de la barra de navegación en pantallas de 375px.
- **v1.0 (2026-04-15):** Lanzamiento oficial de la migración Editorial Tranquility.
