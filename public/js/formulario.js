// ════════════════════════════════════
// Contact Form + WhatsApp Redirect
// ════════════════════════════════════

const WHATSAPP_NUMBER = '525545034306';

function asesoramiento() {
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, me gustaría recibir asesoramiento sobre sus habitaciones.')}`,
    '_self'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  // All "Reservar" buttons → WhatsApp
  const reservarBtns = ['navReservar', 'mobileReservar', 'heroReservar', 'roomReservar'];
  reservarBtns.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', asesoramiento);
  });

  // Contact form
  const form = document.getElementById('contactForm');
  if (!form) return;

  const swalTheme = {
    confirmButtonColor: '#396663',
    background: '#f9f9f8',
    color: '#191c1c',
  };

  const showError = (msg) => {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: msg,
      confirmButtonText: 'Entendido',
      ...swalTheme,
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const last = document.getElementById('contact-last').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();

    // Validations
    if (!name || !last || !email || !phone) {
      return showError('Por favor, completa todos los campos.');
    }

    const nameRegex = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]+$/;
    if (!nameRegex.test(name) || !nameRegex.test(last)) {
      return showError('El nombre y apellido no pueden contener números ni símbolos.');
    }
    if (name.length < 3) {
      return showError('El nombre es muy corto.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showError('El correo electrónico no es válido.');
    }

    if (isNaN(phone) || phone.length !== 10) {
      return showError('El número telefónico debe tener 10 dígitos exactos.');
    }

    // Success
    Swal.fire({
      icon: 'success',
      title: '¡Todo listo!',
      text: 'Redirigiendo a WhatsApp...',
      timer: 2000,
      showConfirmButton: false,
      ...swalTheme,
    });

    setTimeout(() => {
      const msg = `Hola, soy ${name} ${last}. Me interesa reservar una habitación. Mi número de contacto es ${phone} y mi correo es ${email}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_self');
    }, 1500);
  });
});
