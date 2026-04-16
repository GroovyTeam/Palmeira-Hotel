# Hotel Palmeira — Project Memory

## 🧠 Conciencia y Memoria del Proyecto
Este archivo actúa como la memoria central y conciencia del asistente. Se actualizará obligatoriamente después de cada corrección, prompt o cambio significativo para asegurar la integridad del diseño "Editorial Tranquility" y la continuidad del contexto.

## 📋 Resumen del Proyecto
Migración integral del sitio web de Hotel Palmeira hacia el sistema de diseño **"Editorial Tranquility"**. El objetivo es modernizar la UI/UX, optimizar el rendimiento mediante la eliminación de layouts redundantes y mejorar la tasa de conversión para reservas.

## 🛠️ Decisiones Técnicas Clave
- **Arquitectura Responsiva:** Se eliminaron los 3 layouts duplicados en `index.html`. Ahora el sitio usa un único layout basado en CSS Flexbox/Grid.
- **Breakpoints de Navegación:** Se estableció el cambio de menú horizontal a menú de hamburguesa en los **1024px** para evitar solapamientos en dispositivos medianos.
- **Design Tokens:** Uso de variables CSS para colores (Teal, Sand, Gold) y tipografías (Noto Serif y Manrope).
- **Micro-Responsividad:** Se añadieron Media Queries específicas para dispositivos ultra-pequeños (<400px) como iPhone SE, ajustando paddings y font-sizes para evitar overlap en el nav.
- **Lógica Unificada:** Consolidación de scripts en `formulario.js` y `slider.js`.
- **Politica de Memoria (2026-04-16):** Se establece la actualización este archivo tras cada interacción como eje central del desarrollo.

## ✅ Hitos Completados
- [x] Auditoría de arquitectura inicial.
- [x] Implementación del Sistema de Diseño (CSS Tokens).
- [x] Refactorización de `index.html` a un layout único responsivo.
- [x] Unificación de lógica de navegación (Scroll-spy y Mobile Toggle).
- [x] Implementación del nuevo Slider de habitaciones único.
- [x] Solución de solapamiento en barra de navegación (Tablet Fix): Breakpoint movido a 1024px.
- [x] Solución de solapamiento en barra de navegación (iPhone SE Fix): Ajuste de paddings y tipografía <400px.
- [x] Migración de validaciones de formulario con SweetAlert2.

## ⏳ Tareas Pendientes / Futuras
- [ ] Limpieza total de archivos legacy (`room.html`, `redirect.js`, etc.).
- [ ] Optimización de imágenes para carga rápida.
- [ ] Revisión final de SEO y meta-tags.

## 📝 Notas de Versión
- **v1.1 (2026-04-16):** Fix del Nav en tablets (1024px) y eliminación del "Ghost Menu".
- **v1.0 (2026-04-15):** Lanzamiento oficial de la migración Editorial Tranquility.
