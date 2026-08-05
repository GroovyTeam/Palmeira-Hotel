// ══════════════════════════════════════════════════════════════
// Hotel Palmeira — Admin Panel Integration
//cambios
// ══════════════════════════════════════════════════════════════

const API_BASE = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port !== '')
  ? 'http://localhost:3000/api'
  : 'https://system.groovy-team.com/api';
window.API_BASE = API_BASE;

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadTestimonials();
  loadGallery();
});

// Load global settings (check-in/out, social links, chatbot activation) change
async function loadSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to load settings');

    const settings = await res.json();
    window.SITE_SETTINGS = settings;

    // Update check-in and check-out
    if (settings.checkin) {
      const checkinEl = document.getElementById('val-checkin');
      if (checkinEl) checkinEl.textContent = `${settings.checkin} hrs`;
      const checkinFooterEl = document.getElementById('val-checkin-footer');
      if (checkinFooterEl) checkinFooterEl.textContent = `${settings.checkin} hrs`;
    }
    if (settings.checkout) {
      const checkoutEl = document.getElementById('val-checkout');
      if (checkoutEl) checkoutEl.textContent = `${settings.checkout} hrs`;
      const checkoutFooterEl = document.getElementById('val-checkout-footer');
      if (checkoutFooterEl) checkoutFooterEl.textContent = `${settings.checkout} hrs`;
    }

    // Update social media links
    if (settings.socials) {
      const instagramEl = document.getElementById('social-instagram');
      if (instagramEl && settings.socials.instagram) {
        instagramEl.href = settings.socials.instagram;
      }

      const facebookEl = document.getElementById('social-facebook');
      if (facebookEl && settings.socials.facebook) {
        facebookEl.href = settings.socials.facebook;
      }
    }

    // Update WhatsApp number used in contact forms/redirects
    if (settings.whatsapp) {
      window.WHATSAPP_NUMBER = settings.whatsapp;
    }

    // Chatbot widget configuration
    if (settings.chatbot) {
      window.CHATBOT_CONFIG = settings.chatbot;
      // Trigger update on chatbot widget if it loaded already
      if (typeof window.initializeChatbot === 'function') {
        window.initializeChatbot();
      }
    }

    // Update Hero Texts & Background Image
    if (settings.hero) {
      const heroTitleEl = document.getElementById('hero-title');
      if (heroTitleEl && settings.hero.titleLine1 && settings.hero.titleLine2) {
        heroTitleEl.innerHTML = `${settings.hero.titleLine1}<br /><em>${settings.hero.titleLine2}</em>`;
      }

      const heroSubtitleEl = document.getElementById('hero-subtitle');
      if (heroSubtitleEl && settings.hero.subtitle) heroSubtitleEl.textContent = settings.hero.subtitle;

      const heroHeaderEl = document.getElementById('top');
      if (heroHeaderEl && settings.hero.bgImage) {
        heroHeaderEl.style.backgroundImage = `linear-gradient(rgba(25, 28, 28, 0.4), rgba(25, 28, 28, 0.4)), url('${settings.hero.bgImage}')`;
      }
    }

    // Update About Section
    if (settings.about) {
      const poolTitleEl = document.getElementById('about-pool-title');
      if (poolTitleEl && settings.about.poolTitle) poolTitleEl.innerHTML = `<span class="material-symbols-outlined">pool</span> ${settings.about.poolTitle}`;

      const poolDescEl = document.getElementById('about-pool-desc');
      if (poolDescEl && settings.about.poolDesc) poolDescEl.textContent = settings.about.poolDesc;

      const serviceTitleEl = document.getElementById('about-service-title');
      if (serviceTitleEl && settings.about.serviceTitle) serviceTitleEl.innerHTML = `<span class="material-symbols-outlined">volunteer_activism</span> ${settings.about.serviceTitle}`;

      const serviceDescEl = document.getElementById('about-service-desc');
      if (serviceDescEl && settings.about.serviceDesc) serviceDescEl.textContent = settings.about.serviceDesc;

      const poolImgEl = document.getElementById('experience-img-1');
      if (poolImgEl && settings.about.poolImage) poolImgEl.src = settings.about.poolImage;

      const serviceImgEl = document.getElementById('experience-img-2');
      if (serviceImgEl && settings.about.serviceImage) serviceImgEl.src = settings.about.serviceImage;
    }

    // Update Rooms Showcase List (Multi-room support)
    if (settings.rooms) {
      const roomsContainer = document.getElementById('rooms-container');
      if (roomsContainer && settings.rooms.list && settings.rooms.list.length > 0) {
        roomsContainer.innerHTML = settings.rooms.list.map((room, index) => {
          const amenitiesHTML = (room.amenities || []).map(a => `
            <li>
              <span class="material-symbols-outlined">check_circle</span> ${a}
            </li>
          `).join('');

          return `
            <div class="room-showcase" style="${index > 0 ? 'margin-top: 3.5rem; border-top: 1px solid rgba(57, 102, 99, 0.1); padding-top: 3.5rem;' : ''}">
              <div class="room-slider">
                <div class="slides">
                  <img class="active" src="${room.imageSrc || './public/img/recursos/room1.png'}" alt="${room.title}" />
                </div>
              </div>
              <div class="room-info">
                <div class="room-price">Desde ${room.priceFrom} / noche</div>
                <h3>${room.title}</h3>
                <p>${room.description}</p>
                <ul class="room-amenities">
                  ${amenitiesHTML}
                </ul>
                <div class="room-schedules" style="margin: 1.2rem 0; display: flex; gap: 1.5rem; font-size: 0.9rem; color: var(--primary);">
                  <div>
                    <strong style="color: var(--tertiary);">Check-in:</strong> <span class="room-val-checkin">${settings.checkin || '15:00'} hrs</span>
                  </div>
                  <div>
                    <strong style="color: var(--tertiary);">Check-out:</strong> <span class="room-val-checkout">${settings.checkout || '12:00'} hrs</span>
                  </div>
                </div>
                <button class="btn-whatsapp" style="width:100%; border:none; outline:none; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; cursor:pointer;" onclick="document.getElementById('navReservar').click()">
                  <i class="fa-brands fa-whatsapp"></i>
                  Reservar por WhatsApp
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Update Location Section
    if (settings.location) {
      const locationTitleEl = document.getElementById('location-title');
      if (locationTitleEl && settings.location.title) locationTitleEl.textContent = settings.location.title;

      const locationDescEl = document.getElementById('location-desc');
      if (locationDescEl && settings.location.desc) locationDescEl.textContent = settings.location.desc;
    }

    // Update Services Section (Title, Desc & Services Grid)
    if (settings.services) {
      const servicesTitleEl = document.getElementById('services-title');
      if (servicesTitleEl && settings.services.title) servicesTitleEl.textContent = settings.services.title;

      const servicesDescEl = document.getElementById('services-desc');
      if (servicesDescEl && settings.services.desc) servicesDescEl.textContent = settings.services.desc;

      const grid = document.getElementById('services-grid');
      if (grid && settings.services.list && settings.services.list.length > 0) {
        grid.innerHTML = settings.services.list.map(s => `
          <div class="service-card">
            <div class="service-icon">
              <span class="material-symbols-outlined">${s.icon || 'star'}</span>
            </div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
          </div>
        `).join('');
      }
    }

    // Update Restaurant Section
    if (settings.restaurant) {
      const restaurantTitleEl = document.getElementById('restaurant-title');
      if (restaurantTitleEl && settings.restaurant.title) restaurantTitleEl.textContent = settings.restaurant.title;

      const restaurantDescEl = document.getElementById('restaurant-desc');
      if (restaurantDescEl && settings.restaurant.desc) restaurantDescEl.textContent = settings.restaurant.desc;

      const restaurantImgEl = document.getElementById('restaurant-img');
      if (restaurantImgEl && settings.restaurant.image) restaurantImgEl.src = settings.restaurant.image;
    }

    // Update Beach Moments Section
    if (settings.beach) {
      const beachTitleEl = document.getElementById('beach-title');
      if (beachTitleEl && settings.beach.title) beachTitleEl.textContent = settings.beach.title;

      const beachDescEl = document.getElementById('beach-desc');
      if (beachDescEl && settings.beach.desc) beachDescEl.textContent = settings.beach.desc;

      const beachImgEl = document.getElementById('beach-img');
      if (beachImgEl && settings.beach.image) beachImgEl.src = settings.beach.image;
    }

    // Update Contact Email
    if (settings.email) {
      const emailEl = document.getElementById('contact-email-text');
      if (emailEl) emailEl.textContent = settings.email;
    }

    // Update Footer Brand & Copyright Copy
    if (settings.footer) {
      const footerBrandEl = document.getElementById('footer-brand');
      if (footerBrandEl && settings.footer.brand) footerBrandEl.textContent = settings.footer.brand;

      const footerCopyEl = document.getElementById('footer-copy');
      if (footerCopyEl && settings.footer.copy) footerCopyEl.textContent = settings.footer.copy;
    }
  } catch (err) {
    console.warn('API Settings integration offline. Using static HTML defaults.', err);
    // Set global default WhatsApp number if settings endpoint fails
    if (!window.WHATSAPP_NUMBER) {
      window.WHATSAPP_NUMBER = '527731758654';
    }
  }
}

// Load testimonials dynamically from admin CRUD
async function loadTestimonials() {
  try {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error('Failed to load testimonials');

    const testimonials = await res.json();
    if (!testimonials || testimonials.length === 0) return;

    const container = document.getElementById('testimonialsContainer');
    if (!container) return;

    // Clear static testimonials and inject dynamic ones
    container.innerHTML = '';

    testimonials.forEach(t => {
      const card = document.createElement('div');
      card.className = 'testimonial-card glass-card';

      const stars = '★'.repeat(t.stars) + '☆'.repeat(5 - t.stars);

      card.innerHTML = `
        <div class="stars">${stars}</div>
        <p class="quote">"${t.quote}"</p>
        ${t.author ? `<div class="author" style="margin-top: 1rem; font-size: 0.85rem; font-weight: 700; color: var(--tertiary); text-transform: uppercase; letter-spacing: 0.1em; text-align: right;">— ${t.author}</div>` : ''}
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.warn('API Testimonials integration offline. Using static HTML defaults.', err);
  }
}

// Load gallery photos dynamically from admin panel
async function loadGallery() {
  try {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error('Failed to load gallery');

    const photos = await res.json();
    if (!photos || photos.length === 0) return;

    const container = document.getElementById('galleryContainer');
    if (!container) return;

    // Clear and build grid
    container.innerHTML = '';

    photos.forEach(photo => {
      const item = document.createElement('div');
      // Assign span class according to JSON layout parameter or default to span-1-1
      const spanClass = photo.spanClass || 'span-1-1';
      item.className = `gallery-item ${spanClass}`;
      item.dataset.category = photo.category || 'general';

      item.innerHTML = `
        <img src="${photo.src}" alt="${photo.alt || 'Momento Palmeira'}" />
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.warn('API Gallery integration offline. Using static HTML defaults.', err);
  }
}
