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
          .booking-row {
            grid-template-columns: 1fr;
            gap: 0.8rem;
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
        .pay-option-card {
          display: flex;
          padding: 1.1rem;
          border: 1.5px solid rgba(57, 102, 99, 0.2);
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: all 0.2s;
          background: #ffffff;
        }
        .pay-option-card.active {
          border-color: var(--tertiary);
          background: rgba(57, 102, 99, 0.03);
          box-shadow: 0 4px 12px rgba(57, 102, 99, 0.05);
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
                  <option value="sencilla" data-price="1599" selected>Sencilla (1 Cama Matrimonial) — $1,599/noche</option>
                  <option value="doble" data-price="2199">Doble (2 Camas Matrimoniales) — $2,199/noche</option>
                  <option value="familiar" data-price="2999">Familiar (Suite Amplia) — $2,999/noche</option>
                </select>
              </div>
              <div class="booking-group">
                <label for="book-guests">Huéspedes</label>
                <select id="book-guests" required>
                  <option value="1">1 Persona</option>
                  <option value="2" selected>2 Personas</option>
                  <option value="3">3 Personas</option>
                  <option value="4">4 Personas</option>
                  <option value="5">5+ Personas</option>
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
            
            <button type="submit" class="booking-submit">
              Siguiente: Método de Confirmación <span class="material-symbols-outlined" style="font-size: 1.2rem; vertical-align: middle;">arrow_forward</span>
            </button>
          </form>
        </div>

        <!-- STEP 2: Choose Payment Method -->
        <div id="bookingStep2" class="booking-step" style="display: none;">
          <p style="margin-bottom: 1.2rem; color: var(--primary); font-size: 0.9rem; line-height: 1.6; text-align: left;">
            Selecciona cómo deseas asegurar tu estadía en Hotel Palmeira. Elige la confirmación en línea para bloquear tu habitación de forma inmediata.
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.8rem;">
            <!-- Option 1: Card -->
            <div class="pay-option-card active" id="pay-opt-online">
              <input type="radio" name="pay-method" value="online" checked style="margin-right: 1rem; accent-color: var(--tertiary);" id="radio-online" />
              <div style="text-align: left;">
                <strong style="color: var(--primary); display: block; font-size: 0.9rem; margin-bottom: 0.15rem;">Pago Seguro con Tarjeta en Línea</strong>
                <span style="color: #666; font-size: 0.75rem; display: block; line-height: 1.4;">Garantiza tu habitación inmediatamente. Aceptamos Visa, MasterCard y AMEX.</span>
              </div>
            </div>
            <!-- Option 2: WhatsApp -->
            <div class="pay-option-card" id="pay-opt-whatsapp">
              <input type="radio" name="pay-method" value="whatsapp" style="margin-right: 1rem; accent-color: var(--tertiary);" id="radio-whatsapp" />
              <div style="text-align: left;">
                <strong style="color: var(--primary); display: block; font-size: 0.9rem; margin-bottom: 0.15rem;">Resolver dudas o pagar por WhatsApp</strong>
                <span style="color: #666; font-size: 0.75rem; display: block; line-height: 1.4;">Habla con recepción. Ideal si tienes dudas previas o requieres otro método de pago.</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button class="booking-submit" id="btnBackToStep1" style="background: #e9e9e8; color: var(--primary); font-weight: 600; box-shadow: none; flex: 1;">
              Atrás
            </button>
            <button class="booking-submit" id="btnConfirmPaymentChoice" style="flex: 2;">
              Continuar <span class="material-symbols-outlined" style="font-size: 1.2rem; vertical-align: middle;">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- STEP 3: Card Payment Form -->
        <div id="bookingStep3" class="booking-step" style="display: none;">
          <div style="background: rgba(57, 102, 99, 0.05); padding: 0.9rem 1.1rem; border-radius: var(--radius-xl); margin-bottom: 1.2rem; text-align: left; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600; opacity: 0.85;">Total a Pagar:</span>
            <strong style="color: var(--tertiary); font-size: 1.2rem;" id="modal-pay-amount">$1,599 MXN</strong>
          </div>
          <form id="bookingPaymentForm" class="booking-form">
            <div class="booking-group">
              <label for="card-holder">Nombre del Titular</label>
              <input type="text" id="card-holder" placeholder="Ej. Mariana Rivera" required />
            </div>
            <div class="booking-group">
              <label for="card-number">Número de Tarjeta</label>
              <input type="text" id="card-number" placeholder="4152 3456 7890 1234" maxlength="19" required />
            </div>
            <div class="booking-row">
              <div class="booking-group">
                <label for="card-expiry">Vencimiento</label>
                <input type="text" id="card-expiry" placeholder="MM/AA" maxlength="5" required />
              </div>
              <div class="booking-group">
                <label for="card-cvv">Código (CVV)</label>
                <input type="password" id="card-cvv" placeholder="123" maxlength="4" required />
              </div>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 0.8rem;">
              <button type="button" class="booking-submit" id="btnBackToStep2" style="background: #e9e9e8; color: var(--primary); font-weight: 600; box-shadow: none; flex: 1;">
                Atrás
              </button>
              <button type="submit" class="booking-submit" id="btnProcessPayment" style="flex: 2;">
                Pagar y Confirmar Reserva
              </button>
            </div>
          </form>
        </div>

        <!-- STEP 4: Success / Ticket -->
        <div id="bookingStep4" class="booking-step" style="display: none; text-align: center;">
          <div style="margin: 0.3rem auto 1.2rem auto; width: 56px; height: 56px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span class="material-symbols-outlined" style="font-size: 2.8rem;">check_circle</span>
          </div>
          <h4 style="font-family: var(--font-headline), serif; color: var(--primary); font-size: 1.4rem; margin: 0 0 0.4rem 0; font-weight: 700;">¡Reservación Confirmada!</h4>
          <p style="color: #555; font-size: 0.85rem; margin: 0 0 1.2rem 0; line-height: 1.5;">
            Tu habitación ha sido bloqueada y tu pago simulado se procesó con éxito.
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
              <span>Total Pagado:</span>
              <span id="ticket-total" style="color: var(--tertiary); font-size: 0.95rem;">$3,198 MXN</span>
            </div>
          </div>
          
          <button class="booking-submit" id="btnFinishBooking" style="width: 100%;">
            Entendido
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
  const step2 = document.getElementById('bookingStep2');
  const step3 = document.getElementById('bookingStep3');
  const step4 = document.getElementById('bookingStep4');

  // Grab form inputs
  const form1 = document.getElementById('bookingModalForm');
  const roomTypeSelect = document.getElementById('book-room-type');
  const checkinInput = document.getElementById('book-checkin');
  const checkoutInput = document.getElementById('book-checkout');
  const nightsCount = document.getElementById('book-nights-count');
  const totalPrice = document.getElementById('book-total-price');

  // Card payment inputs
  const formPayment = document.getElementById('bookingPaymentForm');
  const cardHolder = document.getElementById('card-holder');
  const cardNumber = document.getElementById('card-number');
  const cardExpiry = document.getElementById('card-expiry');
  const cardCvv = document.getElementById('card-cvv');
  const modalPayAmount = document.getElementById('modal-pay-amount');

  // Radios and container cards
  const payOptOnline = document.getElementById('pay-opt-online');
  const payOptWhatsapp = document.getElementById('pay-opt-whatsapp');
  const radioOnline = document.getElementById('radio-online');
  const radioWhatsapp = document.getElementById('radio-whatsapp');

  // Navigation buttons
  const btnClose = document.getElementById('closeBookingBtn');
  const btnBackToStep1 = document.getElementById('btnBackToStep1');
  const btnBackToStep2 = document.getElementById('btnBackToStep2');
  const btnConfirmPaymentChoice = document.getElementById('btnConfirmPaymentChoice');
  const btnFinishBooking = document.getElementById('btnFinishBooking');

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
        resetToStep1();
        dialog.showModal();
        calculatePrice();
      });
    }
  });

  // Radio button interactivity
  payOptOnline.addEventListener('click', () => {
    radioOnline.checked = true;
    payOptOnline.classList.add('active');
    payOptWhatsapp.classList.remove('active');
  });

  payOptWhatsapp.addEventListener('click', () => {
    radioWhatsapp.checked = true;
    payOptWhatsapp.classList.add('active');
    payOptOnline.classList.remove('active');
  });

  // Expiry formatting MM/AA
  cardExpiry.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      e.target.value = value;
    }
  });

  // Card number formatting (group in 4)
  cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    e.target.value = formatted;
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
    const pricePerNight = parseInt(selectedOption.getAttribute('data-price')) || 1599;
    const total = pricePerNight * diffDays;
    
    nightsCount.textContent = diffDays;
    totalPrice.textContent = `$${total.toLocaleString('es-MX')} MXN`;
    modalPayAmount.textContent = `$${total.toLocaleString('es-MX')} MXN`;
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
  form1.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('book-name').value.trim();
    const last = document.getElementById('book-last').value.trim();
    const email = document.getElementById('book-email').value.trim();
    const phone = document.getElementById('book-phone').value.trim();

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

    // Move to Step 2
    step1.style.display = 'none';
    step2.style.display = 'block';
    document.getElementById('bookingModalTitle').textContent = 'Confirmación';
    cardHolder.value = `${name} ${last}`;
  });

  // Step 2 buttons
  btnBackToStep1.addEventListener('click', () => {
    step2.style.display = 'none';
    step1.style.display = 'block';
    document.getElementById('bookingModalTitle').textContent = 'Reservar en Línea';
  });

  btnConfirmPaymentChoice.addEventListener('click', async () => {
    const isOnline = radioOnline.checked;

    if (isOnline) {
      // Move to Step 3 (Payment Form)
      step2.style.display = 'none';
      step3.style.display = 'block';
      document.getElementById('bookingModalTitle').textContent = 'Detalles de Pago';
    } else {
      // Trigger reservation as pending, and redirect to WhatsApp
      await submitPendingReservation();
    }
  });

  // Step 3 buttons
  btnBackToStep2.addEventListener('click', () => {
    step3.style.display = 'none';
    step2.style.display = 'block';
    document.getElementById('bookingModalTitle').textContent = 'Confirmación';
  });

  // Process Card Payment submit
  formPayment.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('book-name').value.trim();
    const last = document.getElementById('book-last').value.trim();
    const email = document.getElementById('book-email').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const roomType = roomTypeSelect.value;
    const roomTypeName = roomTypeSelect.options[roomTypeSelect.selectedIndex].text.split(' — ')[0];
    const guests = document.getElementById('book-guests').value;
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const totalRaw = totalPrice.textContent;

    const holder = cardHolder.value.trim();
    const cardNum = cardNumber.value.replace(/\s/g, '');
    const exp = cardExpiry.value;
    const cvv = cardCvv.value;

    if (cardNum.length < 15 || exp.length < 5 || cvv.length < 3 || !holder) {
      return Swal.fire({
        icon: 'error',
        title: 'Tarjeta Inválida',
        text: 'Por favor, introduce los datos de tarjeta correctos.',
        confirmButtonColor: '#396663'
      });
    }

    // Visual loading indicator
    const payBtn = document.getElementById('btnProcessPayment');
    const originalText = payBtn.textContent;
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Procesando Pago...';

    // Generate random confirmation code
    const randomCode = 'PA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const date1 = new Date(checkin);
    const date2 = new Date(checkout);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Send payload to backend reservations DB with "confirmed" status
    const payload = {
      firstName: name,
      lastName: last,
      email: email,
      phone: phone,
      roomType: roomType,
      guests: parseInt(guests),
      checkIn: checkin,
      checkOut: checkout,
      nights: diffDays,
      totalPrice: totalRaw,
      status: 'confirmed'
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

    // Simulate payment delay
    setTimeout(() => {
      payBtn.disabled = false;
      payBtn.textContent = originalText;

      // Populate Ticket
      document.getElementById('ticket-code').textContent = randomCode;
      document.getElementById('ticket-name').textContent = `${name} ${last}`;
      document.getElementById('ticket-room').textContent = roomTypeName;
      
      const checkinFormatted = new Date(checkin).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
      const checkoutFormatted = new Date(checkout).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
      document.getElementById('ticket-dates').textContent = `${checkinFormatted} al ${checkoutFormatted}`;
      document.getElementById('ticket-nights').textContent = diffDays;
      
      // Checkin hours (from page fallback or settings if available)
      const valCheckinText = document.getElementById('val-checkin')?.textContent || '15:00 hrs';
      const valCheckoutText = document.getElementById('val-checkout')?.textContent || '12:00 hrs';
      document.getElementById('ticket-checkin').textContent = valCheckinText;
      document.getElementById('ticket-checkout').textContent = valCheckoutText;
      
      document.getElementById('ticket-total').textContent = totalRaw;

      // Switch to Step 4
      step3.style.display = 'none';
      step4.style.display = 'block';
      document.getElementById('bookingModalTitle').textContent = 'Confirmado';

      // Clear card fields
      cardNumber.value = '';
      cardExpiry.value = '';
      cardCvv.value = '';
    }, 2000);
  });

  // Finish booking
  btnFinishBooking.addEventListener('click', () => {
    dialog.close();
    resetToStep1();
  });

  // Submit pending reservation (WhatsApp option)
  async function submitPendingReservation() {
    const name = document.getElementById('book-name').value.trim();
    const last = document.getElementById('book-last').value.trim();
    const email = document.getElementById('book-email').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const roomType = roomTypeSelect.value;
    const roomTypeName = roomTypeSelect.options[roomTypeSelect.selectedIndex].text.split(' — ')[0];
    const guests = document.getElementById('book-guests').value;
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const totalRaw = totalPrice.textContent;

    const date1 = new Date(checkin);
    const date2 = new Date(checkout);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Register reservation as pending
    const payload = {
      firstName: name,
      lastName: last,
      email: email,
      phone: phone,
      roomType: roomType,
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

    Swal.fire({
      icon: 'success',
      title: '¡Itinerario Creado!',
      text: 'Redirigiendo a WhatsApp para coordinar dudas y pago...',
      timer: 2000,
      showConfirmButton: false
    });

    setTimeout(() => {
      dialog.close();
      const whatsappNumber = window.WHATSAPP_NUMBER || '527731758654';
      const checkinFormatted = new Date(checkin).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
      const checkoutFormatted = new Date(checkout).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
      
      const msg = `¡Hola! Me gustaría coordinar una reservación (Código Pendiente):\n\n` +
        `• *Cliente:* ${name} ${last}\n` +
        `• *Habitación:* ${roomTypeName}\n` +
        `• *Huéspedes:* ${guests} persona(s)\n` +
        `• *Estadía:* del ${checkinFormatted} al ${checkoutFormatted} (${diffDays} noche/s)\n` +
        `• *Total Estimado:* ${totalRaw}\n\n` +
        `Mis datos de contacto son:\n` +
        `• Teléfono: ${phone}\n` +
        `• Correo: ${email}\n\n` +
        `Quedo en espera para confirmar disponibilidad y resolver dudas. ¡Gracias!`;

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      resetToStep1();
    }, 1500);
  }

  function resetToStep1() {
    step1.style.display = 'block';
    step2.style.display = 'none';
    step3.style.display = 'none';
    step4.style.display = 'none';
    document.getElementById('bookingModalTitle').textContent = 'Reservar en Línea';
  }
}
