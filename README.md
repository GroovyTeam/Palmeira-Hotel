# Palmeira-Hotel
Palmeira Hotel Web Site is a landing or static page (at the moment, because we have to adapt it to an administrative hotel system.)

In this part, we are only showing the rooms, the hotel's information, ubication, etc.

The app, allows to reserve a room sending a whatsapp with the information of the reservation, which is efficient but, it could be better if we add a database to schedule de dates, availability and automatization of reserves and paymenths.

The objetive is change the site colors, because the current colors are not very attractive and they don't match with the hotel's theme and its not cool in the first impression.
In this process, we need to use the following color palette and be carefully with the structure, functionality and design of the site, your goal is use the most useful and modern design patterns and techniques, taking some of the design standars and practices of UI, UX of the bigest hotels in the world.

# Paleta de colores:
#C5F5F1 = Color primario
#D4BB8B = Color secundario
#D9B36C = Color de acento

# Design System Specification: Editorial Tranquility

## 1. Overview & Creative North Star
The North Star for this design system is **"The Tropical Veranda."** 

Unlike standard hospitality sites that rely on rigid grids and clinical white space, this system mimics the experience of a high-end editorial lookbook. It is designed to feel like a breeze through a palm grove: fluid, layered, and rhythmic. We move beyond the "template" look by utilizing **intentional asymmetry**—allowing high-resolution imagery to break the grid—and **tonal depth** to define structure. 

The goal is to evoke the sensation of luxury through "quiet" interfaces. We prioritize the "breath" between elements, ensuring that the user feels a sense of calm from the first interaction.

---

## 2. Colors & Atmospheric Depth
This palette is inspired by the interplay of water and sand. We use a sophisticated Material Design-based logic to ensure accessibility while maintaining an ethereal, premium feel.

### The Color Logic
*   **Primary (`#396663` / `#C5F5F1`):** Represents the deep lagoon and the soft mist. Use the `primary` (deep teal) for text-based actions and `primary_container` (soft mint) for large structural washes.
*   **Secondary (`#6f5c34` / `#D4BB8B`):** Represents sun-baked sand. These tones provide warmth and organic grounding to the cool mints.
*   **Tertiary (`#775a1c` / `#D9B36C`):** The "Warm Gold." Reserved strictly for moments of high-end intent: "Book Now" buttons, premium suite labels, or signature flourishes.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning. 
*   **Boundaries** must be defined solely through background color shifts. For example, a section using `surface_container_low` should transition directly into a `surface` or `primary_container` section. 
*   This creates a "seamless" horizon line rather than a fragmented "box" layout.

### Signature Textures & Glassmorphism
To avoid a flat, "digital" appearance, use **The Glass & Gradient Rule**:
*   **Floating Elements:** Navbars and modal cards must use `surface` with a 70-80% opacity and a `backdrop-filter: blur(12px)`. This allows the tropical imagery to bleed through, softening the UI.
*   **Gradients:** For Hero backgrounds, use a subtle linear gradient from `surface` to `primary_container` at a 15-degree angle to mimic the natural shift of light on water.

---

## 3. Typography: The Editorial Voice
Our typography pairing balances the timeless authority of a serif with the modern clarity of a geometric sans-serif.

*   **Headings (Noto Serif):** The "Voice of Luxury." Use `display-lg` and `headline-lg` with generous tracking (-0.02em) to create an authoritative, editorial feel. These should often be center-aligned or offset intentionally against imagery.
*   **Body & Labels (Manrope):** The "Modern Concierge." Manrope provides high legibility at small sizes. Use `body-lg` for descriptive storytelling and `label-md` (all-caps with +0.1em letter spacing) for utility items like "Amenities" or "Room Details."

| Scale | Token | Font | Size | Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Noto Serif | 3.5rem | 400 |
| **Headline** | `headline-md` | Noto Serif | 1.75rem | 500 |
| **Title** | `title-lg` | Manrope | 1.375rem | 600 |
| **Body** | `body-md` | Manrope | 0.875rem | 400 |
| **Label** | `label-sm` | Manrope | 0.6875rem | 700 (Caps) |

---

## 4. Elevation & Depth: Tonal Layering
In this design system, shadows are a last resort. We communicate hierarchy through **Physicality and Light.**

*   **The Layering Principle:** Stack `surface_container` tiers to create depth. 
    *   *Base:* `surface`
    *   *Section:* `surface_container_low`
    *   *Card:* `surface_container_lowest` (This creates a soft, "raised" effect through contrast, not shadows).
*   **Ambient Shadows:** If an element must float (e.g., a booking widget), use a "Sunlight Shadow": `box-shadow: 0px 24px 48px rgba(57, 102, 99, 0.06)`. Note the tint—using a fraction of the `primary` color ensures the shadow feels like a natural cast light, not a grey smudge.
*   **The Ghost Border Fallback:** If accessibility requires a stroke, use `outline_variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components & Signature Patterns

### Cards (The "Editorial Frame")
*   **Style:** No borders. Use `xl` (1.5rem) rounded corners.
*   **Content:** Images should use a subtle "Ken Burns" scale effect on hover. Overlap the title or a price chip `secondary_container` across the edge of the image to break the rectangular container.

### Buttons (The "Jewel" Elements)
*   **Primary:** Background `primary`, text `on_primary`. Shape is `full` (pill).
*   **Secondary:** Background `secondary_container`, text `on_secondary_container`.
*   **Interaction:** On hover, do not darken; instead, shift the background to a subtle gradient or increase the `backdrop-blur` intensity.

### Inputs & Fields
*   **Style:** "Underline Only" or "Soft Fill." 
*   **Background:** `surface_container_high`.
*   **Corner:** `sm` (0.25rem) on the bottom edge only for a bespoke architectural feel.

### Navigation (The "Floating Veranda")
*   Use a `surface_container_lowest` background with 60% opacity and `xl` corner radius.
*   The nav should "float" 2rem from the top of the viewport, never pinned to the edges.

---

## 6. Do's & Don'ts

### Do:
*   **Use Asymmetry:** Place a `display-lg` heading so it overlaps a photo and a background wash.
*   **Embrace Negative Space:** If you think a section needs more content, it probably needs more padding. Use the `xl` (1.5rem) spacing unit as your baseline.
*   **Tone-on-Tone:** Use `on_surface_variant` for secondary text to keep the contrast soft and "expensive" looking.

### Don't:
*   **No Dividers:** Never use a horizontal `<hr>` or a 1px border to separate content. Use a 4rem vertical gap or a color shift to `surface_container_low`.
*   **No Pure Blacks:** Use `on_surface` (`#191C1C`) for text. Pure black (`#000000`) is too harsh for this tropical atmosphere.
*   **No Standard Shadows:** Avoid the default CSS `0px 2px 4px` shadows. They look "tech," not "hospitality."



Design to migrate:

<!DOCTYPE html>

<html class="scroll-smooth" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Hotel Palmeira's | La Veranda Tropical</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,500;0,700;1,400&amp;family=Manrope:wght@400;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container-lowest": "#ffffff",
                    "inverse-primary": "#a0cfcc",
                    "outline-variant": "#c0c8c7",
                    "primary-fixed-dim": "#a0cfcc",
                    "on-primary": "#ffffff",
                    "secondary-container": "#f7dcaa",
                    "on-primary-fixed": "#00201f",
                    "inverse-on-surface": "#f0f1f0",
                    "outline": "#707978",
                    "error-container": "#ffdad6",
                    "secondary-fixed": "#fadfad",
                    "on-tertiary-container": "#846526",
                    "tertiary-fixed-dim": "#e8c179",
                    "tertiary-container": "#ffe9c6",
                    "surface-bright": "#f9f9f8",
                    "primary": "#396663",
                    "on-tertiary-fixed-variant": "#5d4203",
                    "on-primary-fixed-variant": "#1f4e4b",
                    "primary-fixed": "#bcece8",
                    "on-surface-variant": "#404847",
                    "surface-container-highest": "#e1e3e2",
                    "on-primary-container": "#45726f",
                    "surface-container": "#edeeed",
                    "secondary": "#6f5c34",
                    "tertiary-fixed": "#ffdea5",
                    "background": "#f9f9f8",
                    "on-background": "#191c1c",
                    "secondary-fixed-dim": "#ddc393",
                    "surface-dim": "#d9dad9",
                    "on-surface": "#191c1c",
                    "on-secondary-fixed-variant": "#56441f",
                    "on-secondary-container": "#746038",
                    "surface-variant": "#e1e3e2",
                    "surface-container-high": "#e7e8e7",
                    "on-tertiary": "#ffffff",
                    "primary-container": "#c5f5f1",
                    "surface-tint": "#396663",
                    "inverse-surface": "#2e3131",
                    "on-secondary": "#ffffff",
                    "on-error-container": "#93000a",
                    "tertiary": "#775a1c",
                    "error": "#ba1a1a",
                    "on-tertiary-fixed": "#261900",
                    "surface": "#f9f9f8",
                    "surface-container-low": "#f3f4f3",
                    "on-error": "#ffffff",
                    "on-secondary-fixed": "#261a00"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Noto Serif"],
                    "body": ["Manrope"],
                    "label": ["Manrope"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .editorial-shadow {
            box-shadow: 0px 24px 48px rgba(57, 102, 99, 0.06);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
<!-- Top Navigation -->
<nav class="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl rounded-full px-8 py-3 bg-white/70 backdrop-blur-md shadow-xl shadow-teal-900/5 flex justify-between items-center z-50 transition-transform duration-300">
<div class="text-2xl font-normal font-headline text-primary">Palmeira's</div>
<div class="hidden md:flex items-center gap-8">
<a class="text-primary font-semibold border-b-2 border-tertiary pb-1 font-label text-sm tracking-wide" href="#inicio">Inicio</a>
<a class="text-on-surface-variant/70 hover:text-primary transition-colors font-label text-sm tracking-wide" href="#servicios">Servicios</a>
<a class="text-on-surface-variant/70 hover:text-primary transition-colors font-label text-sm tracking-wide" href="#habitaciones">Habitaciones</a>
<a class="text-on-surface-variant/70 hover:text-primary transition-colors font-label text-sm tracking-wide" href="#ubicacion">Ubicación</a>
<a class="text-on-surface-variant/70 hover:text-primary transition-colors font-label text-sm tracking-wide" href="#contacto">Contacto</a>
</div>
<button class="bg-primary text-on-primary px-6 py-2 rounded-full font-label text-sm tracking-widest uppercase hover:scale-105 transition-transform duration-300">
            Reservar
        </button>
</nav>
<!-- Hero Section -->
<section class="relative min-h-screen flex items-center pt-20 overflow-hidden" id="inicio">
<div class="absolute inset-0 z-0">
<img alt="Luxury resort overview" class="w-full h-full object-cover" data-alt="Luxurious tropical resort infinity pool overlooking the ocean at sunset with warm golden light and palm tree silhouettes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpef-j_nj0xWXplsbgq8375A4Skoq9oObAcbCE_HKoSlXPde5rnRWpB_MP7CcbMU539vulIi-lPcfDc53uuNZffYSnM1Y3l3-SyO-vMIMCGd-VLH7UACOviiIfUn5LLqsP4KX12xtsLkyhHQze4Kbs0rzj-OZ0FtfbYrOvfi_JdjpxbEA42C3IZPsFFM_FeQFolooVhmiBqaYspqYnk8xza_gpmHpP_6gdqEtrDuWib5kRv9k4QPWBLJrCMoqxWFKDd0BR5L_UkQM"/>
<div class="absolute inset-0 bg-gradient-to-b from-surface/60 via-surface/30 to-surface/80 md:bg-gradient-to-r md:from-surface/80 md:via-surface/40 md:to-surface/80"></div>
</div>
<div class="container mx-auto px-10 relative z-10 flex flex-col items-center text-center">
<div class="max-w-3xl space-y-8">
<span class="inline-block px-4 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold tracking-[0.2em] uppercase">
                    Bienvenidos al Paraíso
                </span>
<h1 class="text-5xl md:text-8xl font-headline leading-[1.1] text-primary">
                    La Veranda <br/> <span class="italic font-normal">Tropical.</span>
</h1>
<p class="text-on-surface-variant text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                    Sumérjase en un santuario de tranquilidad donde el lujo se encuentra con la naturaleza salvaje de la costa. Un refugio diseñado para el descanso profundo.
                </p>
<div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
<button class="bg-tertiary text-on-tertiary px-10 py-4 rounded-full font-label text-sm font-bold tracking-widest uppercase shadow-lg shadow-tertiary/20 hover:translate-y-[-2px] transition-all">
                        Reservar Ahora
                    </button>
<a class="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs group" href="#servicios">
                        Ver Servicios
                        <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
</a>
</div>
</div>
<div class="mt-16 bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-2xl md:rounded-3xl editorial-shadow max-w-[280px] flex flex-col items-center">
<div class="text-tertiary mb-2">
<span class="material-symbols-outlined" data-weight="fill">star</span>
<span class="material-symbols-outlined" data-weight="fill">star</span>
<span class="material-symbols-outlined" data-weight="fill">star</span>
<span class="material-symbols-outlined" data-weight="fill">star</span>
<span class="material-symbols-outlined" data-weight="fill">star</span>
</div>
<p class="text-xs font-label uppercase tracking-wider text-on-surface-variant font-bold">Experiencia de 5 Estrellas</p>
<p class="text-[10px] text-on-surface-variant/60 mt-1 uppercase tracking-tighter">Certificada por Traveller's Choice</p>
</div>
</div>
</section>
<!-- Services Section -->
<section class="py-32 bg-surface-container-low" id="servicios">
<div class="container mx-auto px-10">
<div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
<div class="max-w-2xl">
<h2 class="text-4xl md:text-5xl font-headline text-primary mb-6">Amenidades <br/> de Clase Mundial.</h2>
<p class="text-on-surface-variant leading-relaxed">
                        Cada detalle ha sido cuidadosamente curado para elevar su estancia. Desde la gastronomía local hasta tratamientos ancestrales en nuestro spa.
                    </p>
</div>
<div class="pb-2">
<div class="h-[1px] w-24 bg-primary/20 mb-4"></div>
<p class="text-xs font-label uppercase tracking-[0.3em] text-primary font-bold">Explorar Servicios</p>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
<!-- Service 1 -->
<div class="group bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow hover:bg-primary transition-colors duration-500">
<div class="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
<span class="material-symbols-outlined text-3xl text-primary group-hover:text-white">pool</span>
</div>
<h3 class="text-xl font-headline mb-4 group-hover:text-white transition-colors">Piscina Infinita</h3>
<p class="text-on-surface-variant text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                        Vistas panorámicas al océano en un espejo de agua cristalina disponible las 24 horas.
                    </p>
</div>
<!-- Service 2 -->
<div class="group bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow hover:bg-primary transition-colors duration-500">
<div class="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
<span class="material-symbols-outlined text-3xl text-primary group-hover:text-white">spa</span>
</div>
<h3 class="text-xl font-headline mb-4 group-hover:text-white transition-colors">Spa &amp; Bienestar</h3>
<p class="text-on-surface-variant text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                        Terapias holísticas y masajes relajantes con aceites esenciales orgánicos de la región.
                    </p>
</div>
<!-- Service 3 -->
<div class="group bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow hover:bg-primary transition-colors duration-500">
<div class="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
<span class="material-symbols-outlined text-3xl text-primary group-hover:text-white">restaurant</span>
</div>
<h3 class="text-xl font-headline mb-4 group-hover:text-white transition-colors">Restaurante Gourmet</h3>
<p class="text-on-surface-variant text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                        Una fusión culinaria que celebra los sabores frescos del trópico y técnicas internacionales.
                    </p>
</div>
<!-- Service 4 -->
<div class="group bg-surface-container-lowest p-8 rounded-[2rem] editorial-shadow hover:bg-primary transition-colors duration-500">
<div class="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
<span class="material-symbols-outlined text-3xl text-primary group-hover:text-white">fitness_center</span>
</div>
<h3 class="text-xl font-headline mb-4 group-hover:text-white transition-colors">Gimnasio Pro</h3>
<p class="text-on-surface-variant text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                        Equipamiento de última generación con entrenadores personales certificados a su disposición.
                    </p>
</div>
</div>
</div>
</section>
<!-- Rooms Section -->
<section class="py-32 bg-surface" id="habitaciones">
<div class="container mx-auto px-10">
<div class="text-center mb-20">
<span class="text-xs font-label uppercase tracking-[0.4em] text-tertiary font-bold mb-4 inline-block">Refugios Privados</span>
<h2 class="text-4xl md:text-5xl font-headline text-primary">Habitaciones &amp; Suites</h2>
</div>
<div class="space-y-32">
<!-- Room 1 -->
<div class="flex flex-col lg:flex-row items-center gap-16">
<div class="w-full lg:w-3/5 relative">
<div class="aspect-[16/9] rounded-[2.5rem] overflow-hidden editorial-shadow">
<img alt="Ocean View Suite" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" data-alt="Elegant master suite with large balcony overlooking the turquoise sea, white linens, and wooden furniture in soft daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCENfVgBhhMmE6OXOVvY3cenWZbWuzVMopLegP_628ZmIDvCCJ_nUy1jq8Z_LH6Kr9603LdkNvZ6x6rG8SD5AFSoaZczwUXnlnohK4dKf1BW1Y4_CMfViHKFyP9S9-t2hJ4m0Q1B9rS39SuhVmF8ez1PQ-A7AwQZAS3onoyQ0lqp6emXptY0edz1bLJpqzaQfK-vMD9jxaYTMF_wKK8v1sYDPttjwh-CYx6m5Hw69BgKiXV1xNu3UNl17QMa2_U2QvtXRMAd5Dhiyk"/>
</div>
<div class="absolute -top-6 -right-6 bg-secondary-container text-on-secondary-container px-6 py-4 rounded-2xl shadow-xl font-headline text-lg italic">
                            Desde $250 / noche
                        </div>
</div>
<div class="w-full lg:w-2/5 space-y-6">
<h3 class="text-3xl font-headline text-primary">Suite Vista al Mar</h3>
<p class="text-on-surface-variant leading-relaxed">
                            Nuestra suite insignia ofrece una terraza privada con jacuzzi y una vista ininterrumpida del horizonte, perfecta para atardeceres románticos.
                        </p>
<ul class="space-y-3 text-sm text-on-surface-variant/80">
<li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Cama King Size Ultra-premium</li>
<li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Terraza Privada con Jacuzzi</li>
<li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Minibar Artesanal Incluido</li>
</ul>
<div class="pt-6">
<button class="w-full flex items-center justify-center gap-3 bg-secondary text-on-secondary px-8 py-4 rounded-full font-label text-xs font-bold tracking-widest uppercase hover:bg-secondary-fixed-dim transition-colors">
<span class="material-symbols-outlined text-lg">chat</span>
                                Reservar por WhatsApp
                            </button>
</div>
</div>
</div>
<!-- Room 2 -->
<div class="flex flex-col lg:flex-row-reverse items-center gap-16">
<div class="w-full lg:w-3/5 relative">
<div class="aspect-[16/9] rounded-[2.5rem] overflow-hidden editorial-shadow">
<img alt="Garden Bungalow" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" data-alt="Luxury eco-bungalow surrounded by dense tropical gardens, wooden architecture, and warm interior lighting in the evening" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcd0ZugA2WuPzQgI_j3JVbqFlpvmjDihn7CvRRizGU9d-_w5OGUUKABWyTdeD9FWqB6HIHAEyYfqtE4vj_YaJA4qpWmGkb5xWScXiZC9dgAmjDqT9vOeCzGWZgREdcq9NDKV3ssT9b7zuNgkrMElmQ2K3KpKJFGwxAjlk7BoZcIkS4y6VvdyTOSLIqXjmEWcJ3Gun0udleIc9LKLxtPVJ-pTanPPan77X-kcoQe04dfAYxFATtKh9pIN8lts2QXG2SZ7LtPWIFIYE"/>
</div>
<div class="absolute -top-6 -left-6 bg-secondary-container text-on-secondary-container px-6 py-4 rounded-2xl shadow-xl font-headline text-lg italic">
                            Desde $180 / noche
                        </div>
</div>
<div class="w-full lg:w-2/5 space-y-6">
<h3 class="text-3xl font-headline text-primary">Bungalow Jardín</h3>
<p class="text-on-surface-variant leading-relaxed">
                            Rodeado de flora exótica, este bungalow ofrece máxima privacidad y una conexión única con la naturaleza. Ideal para quienes buscan paz total.
                        </p>
<ul class="space-y-3 text-sm text-on-surface-variant/80">
<li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Ducha de Lluvia al Aire Libre</li>
<li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Hamacas Hechas a Mano</li>
<li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">check_circle</span> Ventilación Natural Cruzada</li>
</ul>
<div class="pt-6">
<button class="w-full flex items-center justify-center gap-3 bg-secondary text-on-secondary px-8 py-4 rounded-full font-label text-xs font-bold tracking-widest uppercase hover:bg-secondary-fixed-dim transition-colors">
<span class="material-symbols-outlined text-lg">chat</span>
                                Reservar por WhatsApp
                            </button>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Location Section -->
<section class="py-32 bg-primary-container" id="ubicacion">
<div class="container mx-auto px-10">
<div class="grid lg:grid-cols-2 gap-20 items-center">
<div class="space-y-10">
<div>
<span class="text-xs font-label uppercase tracking-[0.4em] text-primary font-bold mb-4 inline-block">Coordenadas del Edén</span>
<h2 class="text-4xl md:text-5xl font-headline text-primary mb-6">Un Destino, <br/> Mil Aventuras.</h2>
<p class="text-on-primary-container leading-relaxed">
                            Estamos ubicados en el corazón latente de la costa dorada, donde la selva abraza el mar. Un punto estratégico para explorar lo inexplorado.
                        </p>
</div>
<div class="space-y-6">
<div class="flex gap-6 items-start">
<div class="bg-surface-container-lowest p-3 rounded-xl shadow-sm">
<span class="material-symbols-outlined text-tertiary">explore</span>
</div>
<div>
<h4 class="font-headline text-primary text-lg mb-1">Arrecife Coralino</h4>
<p class="text-on-primary-container/70 text-sm">A solo 15 minutos en lancha privada.</p>
</div>
</div>
<div class="flex gap-6 items-start">
<div class="bg-surface-container-lowest p-3 rounded-xl shadow-sm">
<span class="material-symbols-outlined text-tertiary">hiking</span>
</div>
<div>
<h4 class="font-headline text-primary text-lg mb-1">Sendero Las Cascadas</h4>
<p class="text-on-primary-container/70 text-sm">Caminata guiada de 2km por la selva tropical.</p>
</div>
</div>
<div class="flex gap-6 items-start">
<div class="bg-surface-container-lowest p-3 rounded-xl shadow-sm">
<span class="material-symbols-outlined text-tertiary">sailing</span>
</div>
<div>
<h4 class="font-headline text-primary text-lg mb-1">Puerto Deportivo</h4>
<p class="text-on-primary-container/70 text-sm">Disfrute de paseos al atardecer y pesca deportiva.</p>
</div>
</div>
</div>
</div>
<div class="relative">
<div class="aspect-square bg-surface-container-lowest rounded-[3rem] p-4 editorial-shadow overflow-hidden">
<img alt="Map area view" class="w-full h-full object-cover rounded-[2.5rem]" data-alt="Artistic stylized top-down view of a tropical coastline with white sands and lush greenery, minimalist aesthetic" data-location="Costalegre, Mexico" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4CyaHDbvLVw7mrlUXyKpTF7MFhnPI1JJxHN4I4EtKCcIHznb7M4aYF0mp2NNtEx_8kY2gaVNE-xXwUunFFJBHNREGvRM_YtIXunfwzSfxUmBderCNyL_J73ZMcTXyEQDyRkFuFFo09_yiH_eCEtLwFeIKFPHG_8x1Ql0ztVobhTnxHpa_AHGGXUAJcfe_WuJ9cSAXlwH_X1woQjyWvnE36s8jzBfjWZX1xmaxE0tz7hqgCsKfAVxNsqArabPJGwikxHkak4MermA"/>
</div>
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
<div class="w-6 h-6 bg-tertiary rounded-full animate-ping"></div>
<div class="absolute inset-0 w-6 h-6 bg-tertiary rounded-full border-4 border-white shadow-lg"></div>
</div>
</div>
</div>
</div>
</section>
<!-- Contact Section -->
<section class="py-32 bg-surface" id="contacto">
<div class="container mx-auto px-10">
<div class="max-w-5xl mx-auto bg-surface-container-lowest rounded-[3rem] overflow-hidden editorial-shadow grid md:grid-cols-2">
<div class="p-12 md:p-20 bg-primary text-on-primary space-y-12">
<div>
<h2 class="text-4xl font-headline mb-6">Hablemos.</h2>
<p class="text-white/70 leading-relaxed">
                            Estamos aquí para diseñar su experiencia perfecta. ¿Dudas sobre su reserva o peticiones especiales?
                        </p>
</div>
<div class="space-y-6">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined opacity-60">call</span>
<span class="font-label text-sm tracking-widest">+52 (322) 123 4567</span>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined opacity-60">mail</span>
<span class="font-label text-sm tracking-widest">hola@hotelpalmeiras.com</span>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined opacity-60">location_on</span>
<span class="font-label text-sm tracking-widest text-xs">Km 24 Carr. Federal, Costalegre.</span>
</div>
</div>
<div class="pt-10 flex gap-4">
<a class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all" href="#">
<i class="material-symbols-outlined text-lg">share</i>
</a>
<a class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all" href="#">
<i class="material-symbols-outlined text-lg">camera</i>
</a>
</div>
</div>
<div class="p-12 md:p-20">
<form class="space-y-8">
<div>
<label class="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Nombre Completo</label>
<input class="w-full bg-surface-container-high border-none rounded-sm px-0 py-3 focus:ring-0 border-b-2 border-primary-container focus:border-primary transition-colors placeholder-on-surface-variant/30" placeholder="Ej. Mariana Rivera" type="text"/>
</div>
<div>
<label class="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Correo Electrónico</label>
<input class="w-full bg-surface-container-high border-none rounded-sm px-0 py-3 focus:ring-0 border-b-2 border-primary-container focus:border-primary transition-colors placeholder-on-surface-variant/30" placeholder="mariana@ejemplo.com" type="email"/>
</div>
<div>
<label class="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Mensaje</label>
<textarea class="w-full bg-surface-container-high border-none rounded-sm px-0 py-3 focus:ring-0 border-b-2 border-primary-container focus:border-primary transition-colors placeholder-on-surface-variant/30" placeholder="Cuéntenos sus planes..." rows="3"></textarea>
</div>
<button class="w-full bg-primary text-on-primary py-4 rounded-full font-label text-xs font-bold tracking-widest uppercase hover:scale-[1.02] transition-all">
                            Enviar Mensaje
                        </button>
</form>
</div>
</div>
</div>
</section>
<!-- Footer -->
<footer class="w-full pt-20 pb-10 px-10 bg-teal-50 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-teal-100/20">
<div class="font-headline italic text-lg text-primary">Palmeira's</div>
<div class="flex gap-8">
<a class="font-label text-xs uppercase tracking-widest text-teal-700/60 hover:text-amber-500 transition-colors" href="#">Privacidad</a>
<a class="font-label text-xs uppercase tracking-widest text-teal-700/60 hover:text-amber-500 transition-colors" href="#">Términos</a>
<a class="font-label text-xs uppercase tracking-widest text-teal-700/60 hover:text-amber-500 transition-colors" href="#">Sostenibilidad</a>
</div>
<div class="font-label text-xs uppercase tracking-widest text-teal-900/40">
            © 2024 Hotel Palmeira's. La Veranda Tropical.
        </div>
</footer>
</body></html>