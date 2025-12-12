const next = document.getElementById("nextbtn");
const btnreserve = document.getElementById("btnreserve");
const img = document.getElementById("habitacion");
const home = document.getElementById("home");
const contacto = document.getElementById("button");
function redirect() {
  window.location.href = "./public/views/room.html";
}
function asesoramiento() {
  window.location.href =
    " https://wa.me/7731716714?text=Hola me interesa reservar una habitacion y quisiera hablar con un asesor.";
}

document.addEventListener("DOMContentLoaded", (e) => {
  next.addEventListener("click", (e) => {
    img.setAttribute("src", "./public/img/prueba.jpg");
  });
});
