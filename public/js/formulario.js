document.addEventListener("DOMContentLoaded", (e) => {
  // Botones
  const infobtnMobile = document.getElementById("Bttn"); // Móvil
  const infobtnDesk = document.getElementById("Bttn2"); // Escritorio
  const infobtnTablet = document.getElementById("Bttn3"); // Tablet
  const home = document.getElementById("hamburgerBtn"); // Asumo que este es el botón home o menú

  // Colores
  const swalColors = {
    confirmButtonColor: "#0e0e0e",
    cancelButtonColor: "#d33",
  };

  // Navegación (si existe el elemento)
  /* if (home) {
        home.addEventListener('click', () => window.location.href = "/index.html");
    } */

  // Función mostrar errores
  const mostrarError = (mensaje) => {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: mensaje,
      confirmButtonText: "Entendido",
      confirmButtonColor: swalColors.confirmButtonColor,
      background: "#fff",
      color: "#0e0e0e",
    });
  };

  /**
   * Función DINÁMICA: Recibe los IDs específicos de cada formulario
   */
  const enviarFormulario = (e, ids) => {
    e.preventDefault();

    // 1. Buscamos los inputs usando los IDs que recibimos como parámetro
    const nameInput = document.getElementById(ids.name);
    const lastInput = document.getElementById(ids.last);
    const emailInput = document.getElementById(ids.email);
    const numberInput = document.getElementById(ids.number);

    // Debug: Verificamos si encontró los inputs
    if (!nameInput || !lastInput || !emailInput || !numberInput) {
      console.error(
        "Error: No se encontraron los inputs con los IDs proporcionados:",
        ids
      );
      return;
    }

    // 2. Obtenemos valores
    const name = nameInput.value.trim();
    const last = lastInput.value.trim();
    const email = emailInput.value.trim();
    const number = numberInput.value.trim();

    // --- VALIDACIONES ---

    // A. Campos Vacíos
    if (name === "" || last === "" || email === "" || number === "") {
      mostrarError("Por favor, completa todos los campos.");
      return;
    }

    // B. Validación de Nombres (Sin números)
    const soloLetrasRegex = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]+$/;
    if (!soloLetrasRegex.test(name) || !soloLetrasRegex.test(last)) {
      mostrarError(
        "El nombre y apellido no pueden contener números ni símbolos."
      );
      return;
    }

    if (name.length < 3) {
      mostrarError("El nombre es muy corto.");
      return;
    }

    // C. Correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarError("El correo electrónico no es válido.");
      return;
    }

    // D. Teléfono
    if (isNaN(number) || number.length !== 10) {
      mostrarError("El número telefónico debe tener 10 dígitos exactos.");
      return;
    }

    // --- ÉXITO ---
    Swal.fire({
      icon: "success",
      title: "¡Todo listo!",
      text: "Redirigiendo a WhatsApp...",
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      const mensaje = `Hola, soy ${name} ${last}. Me interesa reservar la habitación. Mi número de contacto es ${number} y mi correo es ${email}`;
      const mensajeCodificado = encodeURIComponent(mensaje);
      const numeroHotel = "5217731716714";
      const url = `https://wa.me/${numeroHotel}?text=${mensajeCodificado}`;
      window.open(url, "_blank");
    }, 1500);
  };

  // --- ASIGNAR EVENTOS SEGÚN EL BOTÓN CLICKEADO ---

  // 1. Formulario MÓVIL (Bttn)
  if (infobtnMobile) {
    infobtnMobile.addEventListener("click", (e) => {
      enviarFormulario(e, {
        name: "name_mobile",
        last: "apellidos_mobile",
        email: "email_mobile",
        number: "phones_mobile",
      });
    });
  }

  // 2. Formulario ESCRITORIO (Bttn2)
  if (infobtnDesk) {
    infobtnDesk.addEventListener("click", (e) => {
      enviarFormulario(e, {
        name: "name_desk",
        last: "apellidos_desk",
        email: "email_desk",
        number: "phones_desk",
      });
    });
  }

  // 3. Formulario TABLET (Bttn3)
  if (infobtnTablet) {
    infobtnTablet.addEventListener("click", (e) => {
      enviarFormulario(e, {
        name: "name_tablet",
        last: "apellidos_tablet",
        email: "email_tablet",
        number: "phones_tablet",
      });
    });
  }
});
