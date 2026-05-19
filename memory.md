# Hotel Palmeira — Project Memory

## 🧠 Conciencia y Memoria del Proyecto
Este archivo actúa como la memoria central y conciencia del asistente. Se actualizará obligatoriamente después de cada corrección, prompt o cambio significativo para asegurar la integridad del diseño "Editorial Tranquility" y la continuidad del contexto.

## 📋 Resumen del Proyecto
Migración integral del sitio web de Hotel Palmeira hacia el sistema de diseño **"Editorial Tranquility"**. El objetivo es modernizar la UI/UX, optimizar el rendimiento mediante la eliminación de layouts redundantes y mejorar la tasa de conversión para reservas.

## 🛠️ Decisiones Técnicas Clave
- **Arquitectura Híbrida (Nueva Fase):** El proyecto ahora se divide en dos componentes:
  1. **Sitio Público Estático (`index.html`):** Optimizado para SEO y rendimiento extremo.
  2. **Admin Panel (`/admin-panel`):** Inicializado con Next.js, Tailwind CSS y TypeScript para gestionar el sitio público de forma dinámica (futuro CRUD).
- **Arquitectura Responsiva:** Se eliminaron los 3 layouts duplicados en `index.html`. Ahora el sitio usa un único layout basado en CSS Flexbox/Grid/Masonry.
- **Breakpoints de Navegación:** Se estableció el cambio de menú horizontal a menú de hamburguesa en los **1024px**.
- **Design Tokens:** Uso de variables CSS para colores (Teal, Sand, Gold) y tipografías (Noto Serif y Manrope).
- **Copywriting Editorial:** Transición a un tono de comunicación inspirador y poético para todas las secciones.

## ✅ Hitos Completados
- [x] Implementación del Sistema de Diseño (CSS Tokens).
- [x] Refactorización de `index.html` a un layout único responsivo.
- [x] Migración de validaciones de formulario con SweetAlert2.
- [x] **Expansión Editorial:** Adición de secciones "Experiencias", "Testimonios" (Social Proof) y "Catálogo de Momentos" (Galería Masonry).
- [x] **Optimización Visual:** Reutilización inteligente de imágenes del slider hacia la galería y textos premium.
- [x] **Detalles Inigualables:** Integración de la sección detallando la Alberca de Chukum y el trato excepcional del personal.
- [x] **Admin Panel Init:** Creación del proyecto Next.js y estructura del Dashboard.

## ⏳ Tareas Pendientes / Futuras
- [ ] Conectar el Admin Panel a una base de datos (e.g. Firebase) para que las actualizaciones se reflejen en el sitio estático (posible migración a SSG/ISR).
- [ ] Desarrollo de las vistas CRUD completas para Textos, Imágenes y Testimonios.

## 📝 Notas de Versión
- **v2.1 (2026-05-18):** Adición de la sección de "Detalles Inigualables" (Chukum y Atención) con diseño responsivo premium.
- **v2.0 (2026-05-06):** Expansión de contenido (Experiencias, Galería, Testimonios) y mejora de copywriting. Inicialización del *Palmeira's Hotel Admin Panel* en Next.js.
- **v1.0 (2026-04-15):** Lanzamiento oficial de la migración Editorial Tranquility.
