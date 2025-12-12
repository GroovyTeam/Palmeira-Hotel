document.addEventListener('DOMContentLoaded', (e) => {
    
    const home = document.getElementById('home');
    const infobtn = document.getElementById('button'); 
    const infobtn2 = document.getElementById('button2'); 
    
    // Configuración de colores (Negro Room1)
    const swalColors = {
        confirmButtonColor: '#0e0e0e', 
        cancelButtonColor: '#d33',
    };

    if (home) {
        home.addEventListener('click', () => window.location.href = "../index.html");
    }

    const mostrarError = (mensaje) => {
        Swal.fire({
            icon: 'warning',
            title: 'Revisa los datos',
            text: mensaje,
            confirmButtonText: 'Corregir',
            confirmButtonColor: swalColors.confirmButtonColor,
            background: '#fff',
            color: '#0e0e0e'
        });
    };

    const enviarFormulario = (e, ids) => {
        e.preventDefault();

        const nameInput = document.getElementById(ids.name);
        const lastInput = document.getElementById(ids.last);
        const emailInput = document.getElementById(ids.email);
        const numberInput = document.getElementById(ids.number);

        if (!nameInput || !lastInput || !emailInput || !numberInput) return;

        const name = nameInput.value.trim();
        const last = lastInput.value.trim();
        const email = emailInput.value.trim();
        const number = numberInput.value.trim();

        // --- 1. VALIDACIÓN DE NOMBRES Y APELLIDOS (SIN NÚMEROS) ---
        // Esta Regex permite: Letras (a-z), Mayúsculas (A-Z), Acentos (áé...), ñ y espacios.
        // NO permite: Números (0-9) ni símbolos especiales (@, $, etc).
        const soloLetrasRegex = /^[a-zA-ZÁ-ÿ\u00f1\u00d1\s]+$/;

        if (!soloLetrasRegex.test(name)) {
            mostrarError('El nombre no puede contener números ni símbolos.');
            return;
        }

        if (!soloLetrasRegex.test(last)) {
            mostrarError('El apellido no puede contener números ni símbolos.');
            return;
        }

        if (name.length < 3 || last.length < 3) {
            mostrarError('El nombre o apellido son muy cortos.');
            return;
        }

        // --- 2. VALIDACIÓN DE CORREO (CON NÚMEROS PERMITIDOS) ---
        // Nota: Los correos SÍ pueden llevar números (ej. juan123@gmail.com).
        // Esta validación asegura que tenga formato de correo real.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            mostrarError('El formato del correo electrónico es incorrecto.');
            return;
        }

        // --- 3. VALIDACIÓN DE TELÉFONO (SOLO NÚMEROS) ---
        // isNaN = "Is Not a Number" (Si no es número, da true)
        if (isNaN(number) || number.length !== 10) {
            mostrarError('El teléfono debe ser solo números y tener 10 dígitos.');
            return;
        }

        // --- ÉXITO ---
        Swal.fire({
            icon: 'success',
            title: 'Procesando...',
            text: 'Abriendo WhatsApp para finalizar tu reserva.',
            timer: 2000, 
            showConfirmButton: false
        });

        setTimeout(() => {
            const mensaje = `Hola, soy ${name} ${last}. Me interesa reservar la habitación. Mi número de contacto es ${number} y mi correo es ${email}`;
            const mensajeCodificado = encodeURIComponent(mensaje);
            const numeroHotel = '525545034306'; 
            const url = `https://wa.me/${numeroHotel}?text=${mensajeCodificado}`;
            
            window.open(url, '_self');
        }, 1500); 
    };

    // Asignación de eventos
    if (infobtn) {
        infobtn.addEventListener('click', (e) => {
            enviarFormulario(e, { name: 'name', last: 'last', email: 'email', number: 'number' });
        });
    }

    if (infobtn2) {
        infobtn2.addEventListener('click', (e) => {
            enviarFormulario(e, { name: 'Names', last: 'apellidos', email: 'correo', number: 'phone' });
        });
    }
});
