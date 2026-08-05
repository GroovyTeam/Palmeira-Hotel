// ══════════════════════════════════════════════════════════════
// Hotel Palmeira — Interactive Booking Widget (Modal)
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  setupBookingWidget();
});

function setupBookingWidget() {
  // Create dialog modal markup
  const dialogHtml = `
    <dialog id="bookingDialog" class="booking-dialog">
      <style>
        .booking-dialog {
          --radius-xl: 12px;
          --radius-2xl: 16px;
          --radius-3xl: 24px;
          border: none;
          background: transparent;
          padding: 0;
          max-width: 550px;
          width: 90%;
          max-height: 92vh;
          border-radius: var(--radius-3xl);
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          margin: auto;
        }
        .booking-dialog::backdrop {
          background: rgba(25, 28, 28, 0.45);
          backdrop-filter: blur(8px);
        }
        .booking-container {
          background: rgba(249, 249, 248, 0.99);
          border: 1px solid rgba(255, 255, 255, 0.6);
          padding: 2.2rem;
          border-radius: var(--radius-3xl);
          font-family: var(--font-sans), sans-serif;
          color: var(--primary);
          max-height: 92vh;
          overflow-y: auto;
          box-sizing: border-box;
        }
        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(57, 102, 99, 0.1);
          padding-bottom: 0.8rem;
        }
        .booking-header h3 {
          font-family: var(--font-headline), serif;
          color: var(--primary);
          font-size: 1.6rem;
          margin: 0;
          font-weight: 700;
        }
        .booking-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--primary);
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        .booking-close:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.05);
        }
        .booking-form {
          display: grid;
          gap: 1.1rem;
        }
        .booking-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 575px) {
          .booking-container {
            padding: 1.25rem;
            border-radius: var(--radius-2xl);
            max-height: 92vh;
          }
          .booking-header {
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
          }
          .booking-header h3 {
            font-size: 1.3rem;
          }
          .booking-form {
            gap: 0.75rem;
          }
          .booking-row {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .booking-group {
            gap: 0.25rem;
          }
          .booking-group label {
            font-size: 0.7rem;
          }
          .booking-group input,
          .booking-group select {
            padding: 0.6rem 0.8rem;
            font-size: 0.85rem;
            border-radius: var(--radius-xl);
          }
          .booking-summary {
            padding: 0.8rem;
            margin: 0.5rem 0;
          }
          .booking-submit {
            padding: 0.75rem;
            font-size: 0.9rem;
          }
        }
        .booking-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: left;
        }
        .booking-group label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--primary);
          opacity: 0.8;
        }
        .booking-group input,
        .booking-group select {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(57, 102, 99, 0.2);
          background: rgba(255, 255, 255, 0.9);
          border-radius: var(--radius-xl);
          font-size: 0.9rem;
          color: var(--primary);
          outline: none;
          transition: all 0.3s;
        }
        .booking-group input:focus,
        .booking-group select:focus {
          border-color: var(--tertiary);
          box-shadow: 0 0 0 3px rgba(188, 151, 93, 0.15);
          background: #ffffff;
        }
        .booking-summary {
          background: rgba(57, 102, 99, 0.04);
          border: 1px dashed rgba(57, 102, 99, 0.2);
          padding: 1.1rem;
          border-radius: var(--radius-xl);
          margin: 0.8rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .booking-price-label {
          font-size: 0.8rem;
          color: var(--primary);
          opacity: 0.85;
        }
        .booking-price-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--tertiary);
        }
        .booking-submit {
          background: var(--tertiary);
          color: #ffffff;
          border: none;
          padding: 0.9rem;
          border-radius: var(--radius-xl);
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 10px rgba(188, 151, 93, 0.2);
        }
        .booking-submit:hover {
          background: #a9804b;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(188, 151, 93, 0.3);
        }
        .booking-submit:active {
          transform: translateY(0);
        }
        .booking-step {
          animation: bookingFadeIn 0.35s ease-in-out forwards;
        }
        @keyframes bookingFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <div class="booking-container">
        <div class="booking-header">
          <h3 id="bookingModalTitle">Reservar en Línea</h3>
          <button class="booking-close" id="closeBookingBtn">&times;</button>
        </div>
        
        <!-- STEP 1: Details & Guest Form -->
        <div id="bookingStep1" class="booking-step">
          <form id="bookingModalForm" class="booking-form">
            <div class="booking-row">
              <div class="booking-group">
                <label for="book-name">Nombre</label>
                <input type="text" id="book-name" placeholder="Ej. Mariana" required />
              </div>
              <div class="booking-group">
                <label for="book-last">Apellido</label>
                <input type="text" id="book-last" placeholder="Ej. Rivera" required />
              </div>
            </div>
            
            <div class="booking-row">
              <div class="booking-group">
                <label for="book-email">Correo Electrónico</label>
                <input type="email" id="book-email" placeholder="correo@ejemplo.com" required />
              </div>
              <div class="booking-group">
                <label for="book-phone">Teléfono (10 dígitos)</label>
                <input type="tel" id="book-phone" placeholder="55 1234 5678" maxlength="10" required />
              </div>
            </div>
            
            <div class="booking-row">
              <div class="booking-group">
                <label for="book-room-type">Tipo de Habitación</label>
                <select id="book-room-type" required>
                  <!-- Populated dynamically from window.SITE_SETTINGS -->
                </select>
              </div>
              <div class="booking-group">
                <label for="book-guests">Huéspedes</label>
                <select id="book-guests" required>
                  <option value="1">1 Persona</option>
                  <option value="2" selected>2 Personas</option>
                  <option value="3">3 Personas</option>
                  <option value="4">4 Personas</option>
                </select>
              </div>
            </div>
            
            <div class="booking-row">
              <div class="booking-group">
                <label for="book-checkin">Fecha de Entrada</label>
                <input type="date" id="book-checkin" required />
              </div>
              <div class="booking-group">
                <label for="book-checkout">Fecha de Salida</label>
                <input type="date" id="book-checkout" required />
              </div>
            </div>
            
            <div class="booking-summary">
              <span class="booking-price-label">Total Estimado (<span id="book-nights-count">1</span> noche/s):</span>
              <span class="booking-price-value" id="book-total-price">$1,599 MXN</span>
            </div>
            
            <button type="submit" class="booking-submit" id="btnSubmitStep1">
              Confirmar y ver Ticket de Reserva <span class="material-symbols-outlined" style="font-size: 1.2rem; vertical-align: middle;">arrow_forward</span>
            </button>
          </form>
        </div>

        <!-- STEP 4: Success / Ticket -->
        <div id="bookingStep4" class="booking-step" style="display: none; text-align: center;">
          <div style="margin: 0.3rem auto 1.2rem auto; width: 56px; height: 56px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">check_circle</span>
          </div>
          <h4 style="font-family: var(--font-headline), serif; color: var(--primary); font-size: 1.4rem; margin: 0 0 0.4rem 0; font-weight: 700;">¡Solicitud de Reserva Registrada!</h4>
          <p style="color: #555; font-size: 0.85rem; margin: 0 0 1.2rem 0; line-height: 1.5; text-align: left;">
            Tu solicitud ha sido guardada en nuestro sistema. Para asegurar tu habitación y confirmar disponibilidad, haz clic en el botón de abajo para enviar tu ticket por WhatsApp a recepción.
          </p>
          
          <!-- Ticket Receipt -->
          <div style="background: #ffffff; border: 1px solid rgba(57, 102, 99, 0.15); border-radius: var(--radius-xl); padding: 1.1rem; text-align: left; font-size: 0.8rem; margin-bottom: 1.2rem; line-height: 1.6; color: var(--primary);">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(57, 102, 99, 0.2); padding-bottom: 0.5rem; margin-bottom: 0.5rem; font-weight: 700;">
              <span>Código de Reserva:</span>
              <span id="ticket-code" style="color: var(--tertiary); font-family: monospace; font-size: 0.95rem;">PA-123456</span>
            </div>
            <div><strong>Huésped:</strong> <span id="ticket-name">Mariana Rivera</span></div>
            <div><strong>Habitación:</strong> <span id="ticket-room">Sencilla</span></div>
            <div><strong>Estadía:</strong> <span id="ticket-dates">5 de ago al 7 de ago</span> (<span id="ticket-nights">2</span> noche/s)</div>
            <div><strong>Horarios:</strong> Check-in <span id="ticket-checkin">15:00</span> • Check-out <span id="ticket-checkout">12:00</span></div>
            <div style="border-top: 1px dashed rgba(57, 102, 99, 0.2); padding-top: 0.5rem; margin-top: 0.5rem; display: flex; justify-content: space-between; font-weight: 800;">
              <span>Total Estimado:</span>
              <span id="ticket-total" style="color: var(--tertiary); font-size: 0.95rem;">$3,198 MXN</span>
            </div>
          </div>
          
          <button class="booking-submit" id="btnFinishBooking" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <svg style="width: 1.2rem; height: 1.2rem; fill: currentColor;" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.424 5.429 0 12.008 0c3.189.001 6.186 1.24 8.441 3.499 2.256 2.259 3.493 5.259 3.491 8.45-.003 6.578-5.429 12.002-12.007 12.002-1.997-.001-3.957-.502-5.69-1.463L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.82 1.452 5.407 0 9.805-4.4 9.808-9.81.002-2.62-1.018-5.086-2.873-6.944-1.856-1.857-4.325-2.876-6.945-2.878-5.411 0-9.81 4.4-9.813 9.811-.001 1.699.444 3.359 1.29 4.83l-.97 3.548 3.691-.967zm12.38-5.748c-.302-.15-1.787-.881-2.063-.982-.276-.1-.476-.15-.676.15-.2.3-.778 1-.95 1.19-.172.2-.345.224-.646.074-.3-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.084-.176-.3-.019-.462.13-.611.135-.134.302-.351.453-.527.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.526-.075-.15-.676-1.631-.926-2.23-.244-.582-.49-.5-.676-.51-.176-.01-.376-.01-.576-.01-.2 0-.527.075-.802.375-.276.3-1.052 1.026-1.052 2.5 0 1.475 1.077 2.9 1.227 3.1.15.2 2.122 3.24 5.14 4.548.718.311 1.277.497 1.714.637.722.229 1.378.196 1.898.119.58-.087 1.787-.73 2.037-1.432.25-.702.25-1.303.175-1.431-.075-.127-.275-.202-.576-.352z"/>
            </svg>
            Enviar Ticket por WhatsApp
          </button>
        </div>
      </div>
    </dialog>
  `;

  // Inject dialog to body
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = dialogHtml.trim();
  const dialog = tempDiv.querySelector('#bookingDialog');
  document.body.appendChild(dialog);

  // Grab Step Elements
  const step1 = document.getElementById('bookingStep1');
  const step4 = document.getElementById('bookingStep4');

  // Grab form inputs
  const form1 = document.getElementById('bookingModalForm');
  const roomTypeSelect = document.getElementById('book-room-type');
  const checkinInput = document.getElementById('book-checkin');
  const checkoutInput = document.getElementById('book-checkout');
  const nightsCount = document.getElementById('book-nights-count');
  const totalPrice = document.getElementById('book-total-price');

  // Navigation buttons
  const btnClose = document.getElementById('closeBookingBtn');
  const btnFinishBooking = document.getElementById('btnFinishBooking');

  // Populate single room type dynamically from global settings
  function populateRoomType() {
    const settings = window.SITE_SETTINGS || { rooms: { title: "Habitación Estándar", priceFrom: "$1,599 MXN" } };
    const roomTitle = (settings.rooms && settings.rooms.title) || "Habitación Estándar";
    const roomPriceStr = (settings.rooms && settings.rooms.priceFrom) || "$1,599 MXN";
    const priceNum = parseInt(roomPriceStr.replace(/[^0-9]/g, '')) || 1599;

    roomTypeSelect.innerHTML = `
      <option value="${roomTitle} — ${roomPriceStr}/noche" data-price="${priceNum}">${roomTitle} — ${roomPriceStr}/noche</option>
    `;
  }
  populateRoomType();

  // Set default dates (Check-in = tomorrow, Check-out = day after)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  checkinInput.value = tomorrow.toISOString().split('T')[0];
  checkoutInput.value = dayAfter.toISOString().split('T')[0];
  checkinInput.min = today.toISOString().split('T')[0];

  // Intercept all Booking buttons to open modal
  const bookingButtons = ['navReservar', 'mobileReservar', 'heroReservar', 'roomReservar'];
  bookingButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.outerHTML = btn.outerHTML; // Removes prior listeners
      const newBtn = document.getElementById(id);
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        populateRoomType();
        resetToStep1();
        dialog.showModal();
        calculatePrice();
      });
    }
  });

  // Date updates & calculations
  checkinInput.addEventListener('change', () => {
    checkoutInput.min = checkinInput.value;
    if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
      const nextDate = new Date(checkinInput.value);
      nextDate.setDate(nextDate.getDate() + 1);
      checkoutInput.value = nextDate.toISOString().split('T')[0];
    }
    calculatePrice();
  });

  checkoutInput.addEventListener('change', calculatePrice);
  roomTypeSelect.addEventListener('change', calculatePrice);

  function calculatePrice() {
    const date1 = new Date(checkinInput.value);
    const date2 = new Date(checkoutInput.value);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    
    const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
    const pricePerNight = selectedOption ? (parseInt(selectedOption.getAttribute('data-price')) || 1599) : 1599;
    const total = pricePerNight * diffDays;
    
    nightsCount.textContent = diffDays;
    totalPrice.textContent = `$${total.toLocaleString('es-MX')} MXN`;
  }

  // Close modals
  btnClose.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      dialog.close();
    }
  });

  // Handle Step 1 details submission
  form1.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('book-name').value.trim();
    const last = document.getElementById('book-last').value.trim();
    const email = document.getElementById('book-email').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const guests = document.getElementById('book-guests').value;
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const totalRaw = totalPrice.textContent;

    if (!name || !last || !email || !phone) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, rellena todos los campos.',
        confirmButtonColor: '#396663'
      });
    }

    const nameRegex = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]+$/;
    if (!nameRegex.test(name) || !nameRegex.test(last)) {
      return Swal.fire({
        icon: 'warning',
        title: 'Nombre inválido',
        text: 'El nombre y el apellido no deben contener números o caracteres especiales.',
        confirmButtonColor: '#396663'
      });
    }

    if (isNaN(phone) || phone.length !== 10) {
      return Swal.fire({
        icon: 'warning',
        title: 'Teléfono inválido',
        text: 'El número de teléfono debe constar de exactamente 10 dígitos.',
        confirmButtonColor: '#396663'
      });
    }

    const date1 = new Date(checkin);
    const date2 = new Date(checkout);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
    const roomTypeName = selectedOption ? selectedOption.value.split(' — ')[0] : 'Habitación Estándar';

    // Generate random confirmation code
    const randomCode = 'PA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Visual loading indicator
    const submitBtn = document.getElementById('btnSubmitStep1');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Registrando...';

    // Send payload to backend reservations DB with "pending" status
    const payload = {
      id: randomCode,
      firstName: name,
      lastName: last,
      email: email,
      phone: phone,
      roomType: roomTypeName,
      guests: parseInt(guests),
      checkIn: checkin,
      checkOut: checkout,
      nights: diffDays,
      totalPrice: totalRaw,
      status: 'pending'
    };

    try {
      await fetch(`${window.API_BASE || 'https://system.groovy-team.com/api'}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Backend server offline. Reservation saved locally on device only.', err);
    }

    // Populate Ticket receipt
    document.getElementById('ticket-code').textContent = randomCode;
    document.getElementById('ticket-name').textContent = `${name} ${last}`;
    document.getElementById('ticket-room').textContent = roomTypeName;
    
    const checkinFormatted = new Date(checkin).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    const checkoutFormatted = new Date(checkout).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    document.getElementById('ticket-dates').textContent = `${checkinFormatted} al ${checkoutFormatted}`;
    document.getElementById('ticket-nights').textContent = diffDays;
    
    const valCheckinText = document.getElementById('val-checkin')?.textContent || '15:00 hrs';
    const valCheckoutText = document.getElementById('val-checkout')?.textContent || '12:00 hrs';
    document.getElementById('ticket-checkin').textContent = valCheckinText;
    document.getElementById('ticket-checkout').textContent = valCheckoutText;
    document.getElementById('ticket-total').textContent = totalRaw;

    // Switch to Step 4 (Receipt and WhatsApp CTA)
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    step1.style.display = 'none';
    step4.style.display = 'block';
    document.getElementById('bookingModalTitle').textContent = 'Solicitud Registrada';

    // Store reservation details globally to reuse in WA button
    window.ACTIVE_RESERVATION = {
      code: randomCode,
      name: `${name} ${last}`,
      phone: phone,
      email: email,
      room: roomTypeName,
      guests: guests,
      checkin: checkinFormatted,
      checkout: checkoutFormatted,
      nights: diffDays,
      total: totalRaw
    };
  });

  // Finish booking and redirect to WhatsApp
  btnFinishBooking.addEventListener('click', () => {
    const res = window.ACTIVE_RESERVATION;
    if (res) {
      const whatsappNumber = window.WHATSAPP_NUMBER || '527731758654';
      const msg = `¡Hola! Me gustaría confirmar mi reservación:\n\n` +
        `• *Código:* ${res.code}\n` +
        `• *Cliente:* ${res.name}\n` +
        `• *Habitación:* ${res.room}\n` +
        `• *Huéspedes:* ${res.guests} persona(s)\n` +
        `• *Estadía:* del ${res.checkin} al ${res.checkout} (${res.nights} noche/s)\n` +
        `• *Total Estimado:* ${res.total}\n\n` +
        `Mis datos de contacto son:\n` +
        `• Teléfono: ${res.phone}\n` +
        `• Correo: ${res.email}\n\n` +
        `Quedo en espera para confirmar disponibilidad. ¡Gracias!`;

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    }
    dialog.close();
    resetToStep1();
  });

  function resetToStep1() {
    step1.style.display = 'block';
    step4.style.display = 'none';
    document.getElementById('bookingModalTitle').textContent = 'Reservar en Línea';
    form1.reset();
  }
}
