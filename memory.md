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
- [x] **Gestión de Reservaciones (WhatsApp):** Conexión de la landing page estática con el panel de administración a través de API y almacenamiento JSON local, incluyendo filtros, buscador interactivo y redirección directa de seguimiento a WhatsApp.
- [x] **Reservación en Línea con Pago Seguro:** Integración del flujo interactivo de pagos con tarjeta de crédito simulado en el widget modal, generación de códigos de confirmación `#PA-XXXXXX` y almacenamiento dinámico con estado `confirmed` (Confirmada).
- [x] **Rediseño Conversacional y Ortografía:** Corrección de la redacción de testimonios a un tono 100% natural, corrección de acentos en títulos ("Ubicación") y textos estáticos, y visualización general de horarios de Check-in/out en el footer y formularios.
- [x] **Chatbot Multi-canal:** Enriquecimiento del chatbot web con respuestas en tiempo real de horarios, y simulación de flujos automáticos para el chatbot de WhatsApp.
- [x] **Editor en Vivo del Sitio (Live Editor):** Creación de un panel de edición visual side-by-side para modificar dinámicamente secciones clave (Hero, Habitaciones, Amenidades de Chukum/Servicio, Ubicación) con renderizado interactivo inmediato en el panel y propagación mediante API a la landing page.

## ⏳ Tareas Pendientes / Futuras
- [x] Conectar el Admin Panel a una base de datos de producción (PostgreSQL Neon) para que las actualizaciones se reflejen de forma distribuida.
- [x] Desarrollo de las vistas CRUD completas para Ajustes del Sitio, Galería y Testimonios.

## 📝 Notas de Versión
- **v2.5 (2026-08-04):** Conexión de base de datos PostgreSQL Serverless (Neon DB) con auto-aprovisionamiento de tablas, siembra inicial de testimonios y ajustes, y fallback automático a archivos JSON.
- **v2.4 (2026-08-04):** Editor en Vivo (Live Editor) con preview en tiempo real side-by-side, inyección de contenido dinámico en todas las secciones principales de `index.html` e integración profunda con la API.
- **v2.3 (2026-08-04):** Flujo de reservas en línea (pago simulado + recibo digital), sincronización de horarios de Check-in/out en el footer de la página, testimonios humanizados, chatbot web y WA adaptables, y CRUDs/Dashboard completamente funcionales.
- **v2.2 (2026-07-08):** Implementación de la sección de control y almacenamiento de reservaciones conectada al formulario de WhatsApp del sitio público.
- **v2.1 (2026-05-18):** Adición de la sección de "Detalles Inigualables" (Chukum y Atención) con diseño responsivo premium.
- **v2.0 (2026-05-06):** Expansión de contenido (Experiencias, Galería, Testimonios) y mejora de copywriting. Inicialización del *Palmeira's Hotel Admin Panel* en Next.js.
- **v1.0 (2026-04-15):** Lanzamiento oficial de la migración Editorial Tranquility.
