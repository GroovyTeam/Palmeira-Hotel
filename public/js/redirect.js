// ============================
// CONFIGURACIÓN GLOBAL
// ============================
const TOTAL = 8;
let count = 0;
const numeroHotel = "525545034306";
// ============================
// BOTONES
// ============================
const next = document.getElementById("nextbtnMobile");
const nextDesktop = document.getElementById("nextbtnDesktop");
const nextTablet = document.getElementById("nextbtnTablet");

const backMobile = document.getElementById("backMobile");
const backDesktop = document.getElementById("backDesktop");
const backTablet = document.getElementById("backTablet");

const reserveBtnMobile = document.getElementById("reserveBtnMobile");
const reserveBtnDesktop = document.getElementById("reserveBtnDesktop");
const reserveBtnTablet = document.getElementById("reserveBtnTablet");
// ============================
// ELEMENTOS UI
// ============================
const roomNameMobile = document.getElementById("roomNameMobile");
const roomNameDesktop = document.getElementById("roomNameDesktop");
const roomNameTablet = document.getElementById("roomNameTablet");

const descriptionMobile = document.getElementById("descriptionMobile");
const descriptionDesktop = document.getElementById("descriptionDesktop");
const descriptionTablet = document.getElementById("descriptionTablet");

const costoMobile = document.getElementById("costoMobile");
const costoDesktop = document.getElementById("costoDesktop");
const costoTablet = document.getElementById("costoTablet");

const img = document.getElementById("habitacion");
const imgDesktop = document.getElementById("habitacionDesktop");
const imgTablet = document.getElementById("habitacionTablet");

// ============================
// DATOS
// ============================
const roomNames = [
  "Perla Negra",
  "Esmeralda Deluxe",
  "Rubí Suite",
  "Zafiro Familiar",
  "Topacio",
  "Amatista",
  "Diamante Presidencial",
  "Ópalo Romántica"
];

const descriptions = [
  "Habitación diseñada para parejas que buscan un ambiente íntimo y romántico, con decoración elegante y detalles especiales.",
  "Enorme habitación con vista al mar, ideal para parejas que desean disfrutar de la tranquilidad y la privacidad.",
  "Habitación con un diseño moderno y sofisticado, ideal para viajeros que buscan comodidad y estilo durante su estancia.",
  "Habitación espaciosa con comodidades de lujo, perfecta para aquellos que desean una experiencia de alojamiento superior.",
  "Suite exclusiva con áreas separadas para dormir y relajarse, equipada con servicios premium para una estancia inolvidable.",
  "Habitación amplia y cómoda, ideal para familias que buscan un espacio acogedor y funcional durante su viaje.",
  "Habitación elegante con todas las comodidades necesarias para una estancia placentera, perfecta para viajeros de negocios o placer.",
  "Habitación con un diseño vibrante y moderno, equipada con todas las facilidades para una estancia confortable."
];

const costs = [
  "$189 MXN por noche",
  "$899 MXN por noche",
  "$1,199 MXN por noche",
  "$199 MXN por noche",
  "$799 MXN por noche",
  "$299 MXN por noche",
  "$2,499 MXN por noche",
  "$999 MXN por noche"
];

// ============================
// FUNCIONES PRINCIPALES
// ============================
function chooseRoom() {
  img.src = "./public/img/prueba" + count + ".jpg";
  imgDesktop.src = "./public/img/prueba" + count + ".jpg";
  imgTablet.src = "./public/img/prueba" + count + ".jpg";

  roomNameMobile.textContent = roomNames[count];
  roomNameDesktop.textContent = roomNames[count];
  roomNameTablet.textContent = roomNames[count];

  descriptionMobile.textContent = descriptions[count];
  descriptionDesktop.textContent = descriptions[count];
  descriptionTablet.textContent = descriptions[count];

  costoMobile.textContent = costs[count];
  costoDesktop.textContent = costs[count];
  costoTablet.textContent = costs[count];

  console.log("Mostrando habitación:", count);
}

function nextRoom() {
  count = (count + 1) % TOTAL;
  chooseRoom();
}

function backRoom() {
  count = (count - 1 + TOTAL) % TOTAL;
  chooseRoom();
}
function redirect() {
  window.location.href = "./public/views/room.html?room=" + count;
}
function asesoramiento(){
  window.location.href = `https://wa.me/${numeroHotel}?text=Hola,%20me%20gustaría%20recibir%20asesoramiento%20sobre%20las%20habitaciones%20del%20hotel.`;
}


// ============================
// EVENTOS
// ============================
document.addEventListener("DOMContentLoaded", () => {
  chooseRoom(); // mostrar la primera al cargar

  next.addEventListener("click", nextRoom);
  nextDesktop.addEventListener("click", nextRoom);
  nextTablet.addEventListener("click", nextRoom);

  backMobile.addEventListener("click", backRoom);
  backDesktop.addEventListener("click", backRoom);
  backTablet.addEventListener("click", backRoom);

  reserveBtnDesktop.addEventListener("click", redirect);
  reserveBtnMobile.addEventListener("click", redirect);
  reserveBtnTablet.addEventListener("click", redirect);
});
