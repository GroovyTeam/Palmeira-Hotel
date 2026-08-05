// ══════════════════════════════════════════════════════════════
// Hotel Palmeira — Chatbot Widget
// ══════════════════════════════════════════════════════════════

window.initializeChatbot = function() {
  // Check if chatbot is disabled by settings
  const config = window.CHATBOT_CONFIG || { enabled: true, botName: 'Asistente Palmeira', welcomeMsg: '¡Hola! Bienvenido a Hotel Palmeira\'s. Soy tu asistente virtual. ¿En qué te puedo ayudar hoy?' };
  
  // Remove existing chatbot nodes if any (to allow re-initialization when settings load)
  const existingToggle = document.getElementById('chatbotToggle');
  const existingWindow = document.getElementById('chatbotWindow');
  if (existingToggle) existingToggle.remove();
  if (existingWindow) existingWindow.remove();

  if (config.enabled === false) {
    console.log('Chatbot is disabled by admin settings.');
    return;
  }

  // Inject Chatbot floating toggle button
  const toggleBtn = document.createElement('div');
  toggleBtn.id = 'chatbotToggle';
  toggleBtn.className = 'chatbot-toggle';
  toggleBtn.setAttribute('aria-label', 'Abrir chat de ayuda');
  toggleBtn.innerHTML = `<span class="material-symbols-outlined">forum</span>`;
  document.body.appendChild(toggleBtn);

  // Inject Chatbot window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chatbotWindow';
  chatWindow.className = 'chatbot-window';
  
  const botName = config.botName || 'Asistente Palmeira';
  const welcomeMsg = config.welcomeMsg || '¡Hola! Bienvenido a Hotel Palmeira\'s. Soy tu asistente virtual. ¿En qué te puedo ayudar hoy?';

  chatWindow.innerHTML = `
    <div class="chatbot-header">
      <h4>${botName}</h4>
      <button class="chatbot-header-close" id="closeChatBtn">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="chatbot-messages" id="chatbotMessages">
      <div class="chatbot-msg bot">
        ${welcomeMsg}
      </div>
    </div>
    <div class="chatbot-quick-replies" id="chatbotReplies">
      <button class="chatbot-reply-btn" data-reply="horarios">🕒 Horarios Check-in/out</button>
      <button class="chatbot-reply-btn" data-reply="reservar">🔑 ¿Cómo reservo?</button>
      <button class="chatbot-reply-btn" data-reply="wa-chatbot">🤖 Chatbot de WhatsApp</button>
      <button class="chatbot-reply-btn" data-reply="servicios">🏊 Servicios y Alberca</button>
      <button class="chatbot-reply-btn" data-reply="comida">🍴 Restaurante Xanat</button>
      <button class="chatbot-reply-btn" data-reply="ubicacion">📍 Ubicación</button>
      <button class="chatbot-reply-btn" data-reply="agente">💬 Hablar con agente</button>
    </div>
    <form class="chatbot-input-area" id="chatbotForm">
      <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Escribe tu duda aquí..." required autocomplete="off" />
      <button type="submit" class="chatbot-send-btn" aria-label="Enviar mensaje">
        <span class="material-symbols-outlined">send</span>
      </button>
    </form>
  `;
  document.body.appendChild(chatWindow);

  const messagesContainer = document.getElementById('chatbotMessages');
  const chatForm = document.getElementById('chatbotForm');
  const chatInput = document.getElementById('chatbotInput');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const repliesContainer = document.getElementById('chatbotReplies');

  // Toggle open / close
  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      chatInput.focus();
      // Change icon
      toggleBtn.innerHTML = toggleBtn.classList.contains('open') 
        ? `<span class="material-symbols-outlined">close</span>`
        : `<span class="material-symbols-outlined">forum</span>`;
    } else {
      toggleBtn.innerHTML = `<span class="material-symbols-outlined">forum</span>`;
    }
  });

  closeChatBtn.addEventListener('click', () => {
    toggleBtn.classList.remove('open');
    chatWindow.classList.remove('open');
    toggleBtn.innerHTML = `<span class="material-symbols-outlined">forum</span>`;
  });

  // Handle Quick Replies
  repliesContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.chatbot-reply-btn');
    if (!btn) return;
    
    const replyType = btn.dataset.reply;
    const userText = btn.textContent;
    
    appendMessage(userText, 'user');
    
    setTimeout(() => {
      respondToQuery(replyType);
    }, 600);
  });

  // Handle Text Submission
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    setTimeout(() => {
      respondToText(text);
    }, 700);
  });

  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chatbot-msg ${sender}`;
    msg.innerHTML = text.replace(/\n/g, '<br/>');
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Predefined keyword responses for text queries
  function respondToText(text) {
    const normalized = text.toLowerCase();
    
    if (normalized.includes('horario') || normalized.includes('check-in') || normalized.includes('checkin') || normalized.includes('checkout') || normalized.includes('check-out') || normalized.includes('hora')) {
      respondToQuery('horarios');
    } else if (normalized.includes('reservar') || normalized.includes('reserva') || normalized.includes('costo') || normalized.includes('precio') || normalized.includes('tarifa') || normalized.includes('noche') || normalized.includes('pagar')) {
      respondToQuery('reservar');
    } else if (normalized.includes('bot') || normalized.includes('whatsapp bot') || normalized.includes('asistente') || (normalized.includes('wa') && normalized.includes('bot'))) {
      respondToQuery('wa-chatbot');
    } else if (normalized.includes('alberca') || normalized.includes('piscina') || normalized.includes('chukum') || normalized.includes('wifi') || normalized.includes('internet') || normalized.includes('estacionamiento') || normalized.includes('aire')) {
      respondToQuery('servicios');
    } else if (normalized.includes('restaurante') || normalized.includes('comida') || normalized.includes('desayuno') || normalized.includes('chef') || normalized.includes('xanat') || normalized.includes('cenar')) {
      respondToQuery('comida');
    } else if (normalized.includes('ubicacion') || normalized.includes('donde') || normalized.includes('dirección') || normalized.includes('mapa') || normalized.includes('playa') || normalized.includes('oxxo') || normalized.includes('tuxpan')) {
      respondToQuery('ubicacion');
    } else if (normalized.includes('agente') || normalized.includes('humano') || normalized.includes('persona') || normalized.includes('whatsapp') || normalized.includes('llamar') || normalized.includes('telefono') || normalized.includes('atencion') || normalized.includes('atención') || normalized.includes('servicio')) {
      respondToQuery('agente');
    } else {
      appendMessage(
        `Gracias por tu mensaje. Para esa duda específica o consultas especiales, te recomiendo hablar directamente con nuestro personal en recepción. Clic aquí para contactar por WhatsApp:\n\n<a href="https://wa.me/${window.WHATSAPP_NUMBER || '527731758654'}?text=Hola,%20tengo%20una%20duda:%20${encodeURIComponent(text)}" class="btn-submit" style="display:inline-block; font-size: 0.8rem; padding: 0.5rem 0.8rem; margin-top: 0.5rem; text-decoration:none; text-align:center;" target="_blank">Contactar WhatsApp</a>`,
        'bot'
      );
    }
  }

  // Helper to read current check-in/out times from the landing page
  function getHours() {
    const checkinEl = document.getElementById('val-checkin');
    const checkoutEl = document.getElementById('val-checkout');
    return {
      checkin: checkinEl ? checkinEl.textContent.trim() : '15:00 hrs',
      checkout: checkoutEl ? checkoutEl.textContent.trim() : '12:00 hrs'
    };
  }

  // Predefined structured responses
  function respondToQuery(type) {
    let response = '';
    const hours = getHours();
    
    switch(type) {
      case 'horarios':
        response = `Nuestros horarios de estadía son:\n` +
          `• 🔑 *Check-in:* a partir de las *${hours.checkin}*\n` +
          `• 🚪 *Check-out:* límite a las *${hours.checkout}*\n\n` +
          `Si requiere ingresar antes o salir después de estas horas, coméntelo al realizar su reservación.`;
        break;
      case 'reservar':
        response = `¡Reservar en línea con nosotros es muy sencillo!\n\n` +
          `1. Cierra este chat y haz clic en cualquier botón de *Reservar* de la página.\n` +
          `2. Elige tu tipo de habitación, fechas de estadía y número de huéspedes para cotizar.\n` +
          `3. Selecciona **Pago Seguro con Tarjeta en Línea** para confirmar de inmediato y recibir tu código de confirmación en pantalla, o **WhatsApp** para atención personalizada.`;
        break;
      case 'wa-chatbot':
        response = `¡Sí! Contamos con un *Asistente Virtual en WhatsApp* activo las 24 horas.\n\n` +
          `Si prefieres resolver dudas rápidas, cotizar estadías o gestionar pagos por mensajería automática, haz clic en el botón de abajo e inicia el chat con el bot de WhatsApp:\n\n` +
          `<a href="https://wa.me/${window.WHATSAPP_NUMBER || '527731758654'}?text=Hola%20Palmeira%2520Bot,%20me%20gustar%25C3%25ADa%20conocer%20las%20tarifas%20y%20reservar." class="btn-submit" style="display:inline-block; font-size: 0.8rem; padding: 0.5rem 0.8rem; margin-top: 0.5rem; text-decoration:none; text-align:center;" target="_blank">🤖 Chatear con WhatsApp Bot</a>`;
        break;
      case 'servicios':
        response = `Ofrecemos los siguientes servicios premium:\n` +
          `• 🏊 *Alberca de Chukum:* Diseñada con arena natural de Mérida Yucatán para asemejarse a cenotes.\n` +
          `• 📶 *Wi-Fi:* Conexión de alta velocidad en áreas comunes y habitaciones.\n` +
          `• 🚗 *Estacionamiento:* Seguro y gratuito para nuestros huéspedes.\n` +
          `• ❄️ *Aire acondicionado* en todas las habitaciones.`;
        break;
      case 'comida':
        response = `Le invitamos a conocer el *Restaurante Xanat, Beach & Food* dentro de nuestras instalaciones:\n` +
          `• 🍴 *Fusión culinaria y comida de autor* diseñada por nuestro chef.\n` +
          `• 🕒 *Servicio:* Todos los días a partir de las *8:00 AM*.\n` +
          `• 🌅 Terraza con vista espectacular directamente al Golfo de México.`;
        break;
      case 'ubicacion':
        response = `¡Nuestra ubicación es inmejorable!\n` +
          `• 🏖️ Estamos a solo *50 metros de la playa* en Tuxpan, Veracruz, México.\n` +
          `• 🏪 Contamos con una tienda Oxxo a solo 30 metros del hotel.\n` +
          `• 🚗 El centro de Tuxpan se localiza a 15 minutos en auto.`;
        break;
      case 'agente':
        response = `Te estoy conectando con nuestro equipo. Haz clic en el botón de abajo para iniciar un chat directo de soporte con recepción por WhatsApp:\n\n` +
          `<a href="https://wa.me/${window.WHATSAPP_NUMBER || '527731758654'}?text=Hola,%20necesito%20atenci%25C3%25B3n%20personalizada%20de%20un%20agente." class="btn-submit" style="display:inline-block; font-size: 0.8rem; padding: 0.5rem 0.8rem; margin-top: 0.5rem; text-decoration:none; text-align:center;" target="_blank">Conversar con Agente</a>`;
        break;
    }
    
    appendMessage(response, 'bot');
  }
};

// Auto-run if global chatbot config isn't explicitly disabled or delayed
document.addEventListener('DOMContentLoaded', () => {
  // If settings haven't loaded within 1.5 seconds, initialize with defaults
  setTimeout(() => {
    if (!document.getElementById('chatbotToggle')) {
      window.initializeChatbot();
    }
  }, 1500);
});
