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
    const normalized = text.toLowerCase().trim();
    
    // Check if dynamic Q&A has matching keywords
    if (config.qna && Array.isArray(config.qna)) {
      for (const item of config.qna) {
        if (!item.keywords || !item.response) continue;
        
        // Split keywords by comma
        const keywords = item.keywords.split(',').map(kw => kw.trim().toLowerCase());
        const hasMatch = keywords.some(kw => kw !== '' && normalized.includes(kw));
        
        if (hasMatch) {
          const hours = getHours();
          const responseText = item.response
            .replace(/{checkin}/g, hours.checkin)
            .replace(/{checkout}/g, hours.checkout);
          appendMessage(responseText, 'bot');
          return;
        }
      }
    }
    
    // Default fallback if no match found
    appendMessage(
      `Gracias por tu mensaje. Para esa duda específica o consultas especiales, te recomiendo hablar directamente con nuestro personal en recepción. Clic aquí para contactar por WhatsApp:\n\n<a href="https://wa.me/${window.WHATSAPP_NUMBER || '527731758654'}?text=Hola,%20tengo%20una%20duda:%20${encodeURIComponent(text)}" class="btn-submit" style="display:inline-block; font-size: 0.8rem; padding: 0.5rem 0.8rem; margin-top: 0.5rem; text-decoration:none; text-align:center;" target="_blank">Contactar WhatsApp</a>`,
      'bot'
    );
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
    const hours = getHours();
    
    // If the reply matches a Q&A item keywords or id, resolve it
    if (config.qna && Array.isArray(config.qna)) {
      const matched = config.qna.find(item => {
        const kws = (item.keywords || '').toLowerCase();
        return kws.includes(type) || item.id === type;
      });
      
      if (matched) {
        let text = matched.response;
        text = text.replace(/{checkin}/g, hours.checkin).replace(/{checkout}/g, hours.checkout);
        appendMessage(text, 'bot');
        return;
      }
    }
    
    // Fallback if not found in custom Q&A
    let response = '';
    switch(type) {
      case 'agente':
        response = `Te estoy conectando con nuestro equipo. Haz clic en el botón de abajo para iniciar un chat directo de soporte con recepción por WhatsApp:\n\n` +
          `<a href="https://wa.me/${window.WHATSAPP_NUMBER || '527731758654'}?text=Hola,%20necesito%20atenci%25C3%25B3n%20personalizada%20de%20un%20agente." class="btn-submit" style="display:inline-block; font-size: 0.8rem; padding: 0.5rem 0.8rem; margin-top: 0.5rem; text-decoration:none; text-align:center;" target="_blank">Conversar con Agente</a>`;
        break;
      default:
        response = `Para esa duda o consulta especial, te recomiendo hablar directamente con recepción por WhatsApp: \n\n<a href="https://wa.me/${window.WHATSAPP_NUMBER || '527731758654'}?text=Hola,%20tengo%20una%20duda." class="btn-submit" style="display:inline-block; font-size: 0.8rem; padding: 0.5rem 0.8rem; margin-top: 0.5rem; text-decoration:none; text-align:center;" target="_blank">Contactar WhatsApp</a>`;
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
