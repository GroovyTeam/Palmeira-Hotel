// ============================
// DATOS DE LAS HABITACIONES
// ============================
const rooms = [
  {
    name: "Perla Negra",
    price: "$189 MXN por noche",
    desc: "Habitación diseñada para parejas que buscan un ambiente íntimo y romántico, con decoración elegante y detalles especiales.",
    images: [
      "../img/room1.jpeg",
      "../img/room1_2.jpeg",
      "../img/room1_3.jpeg",
      "../img/room1_4.jpeg",
      "../img/room1_5.jpeg"
    ]
  },
  {
    name: "Esmeralda Deluxe",
    price: "$899 MXN por noche",
    desc: "Enorme habitación con vista al mar, ideal para parejas que desean disfrutar de la tranquilidad y la privacidad.",
    images: [
      "../img/room2.jpeg",
      "../img/room2_2.jpeg",
      "../img/room2_3.jpeg",
      "../img/room2_4.jpeg",
      "../img/room2_5.jpeg"
    ]
  },
  {
    name: "Rubí Suite",
    price: "$1,199 MXN por noche",
    desc: "Habitación con un diseño moderno y sofisticado, ideal para viajeros que buscan comodidad y estilo durante su estancia.",
    images: [
      "../img/room3.jpeg",
      "../img/room3_2.jpeg",
      "../img/room3_3.jpeg",
      "../img/room3_4.jpeg",
      "../img/room3_5.jpeg"
    ]
  },
  {
    name: "Zafiro Familiar",
    price: "$199 MXN por noche",
    desc: "Habitación espaciosa con comodidades de lujo, perfecta para aquellos que desean una experiencia de alojamiento superior.",
    images: [
      "../img/room4.jpeg",
      "../img/room4_2.jpeg",
      "../img/room4_3.jpeg",
      "../img/room4_4.jpeg",
      "../img/room4_5.jpeg"
    ]
  },
  {
    name: "Topacio",
    price: "$799 MXN por noche",
    desc: "Suite exclusiva con áreas separadas para dormir y relajarse, equipada con servicios premium para una estancia inolvidable.",
    images: [
      "../img/room5.jpeg",
      "../img/room5_2.jpeg",
      "../img/room5_3.jpeg",
      "../img/room5_4.jpeg",
      "../img/room5_5.jpeg"
    ]
  },
  {
    name: "Amatista",
    price: "$299 MXN por noche",
    desc: "Habitación amplia y cómoda, ideal para familias que buscan un espacio acogedor y funcional durante su viaje.",
    images: [
      "../img/room6.jpeg",
      "../img/room6_2.jpeg",
      "../img/room6_3.jpeg",
      "../img/room6_4.jpeg",
      "../img/room6_5.jpeg"
    ]
  },
  {
    name: "Diamante Presidencial",
    price: "$2,499 MXN por noche",
    desc: "Habitación elegante con todas las comodidades necesarias para una estancia placentera, perfecta para viajeros de negocios o placer.",
    images: [
      "../img/room7.jpeg",
      "../img/room7_2.jpeg",
      "../img/room7_3.jpeg",
      "../img/room7_4.jpeg",
      "../img/room7_5.jpeg"
    ]
  },
  {
    name: "Ópalo Romántica",
    price: "$999 MXN por noche",
    desc: "Habitación con un diseño vibrante y moderno, equipada con todas las facilidades para una estancia confortable.",
    images: [
      "../img/room8.jpeg",
      "../img/room8_2.jpeg",
      "../img/room8_3.jpeg",
      "../img/room8_4.jpeg",
      "../img/room8_5.jpeg"
    ]
  }
];

// ============================
// LEER PARÁMETRO DE LA URL
// ============================
const params = new URLSearchParams(window.location.search);
let index = parseInt(params.get("room"));

if (isNaN(index) || index < 0 || index >= rooms.length) {
  index = 0; // fallback seguro
}

// ============================
// CARGAR DATOS EN LA UI
// ============================
const room = rooms[index];

// Títulos (mobile y desktop)
document.querySelectorAll(".Title h1, .title h1").forEach(el => {
  el.textContent = room.name;
});

// Precios
document.querySelectorAll(".cost p").forEach(el => {
  el.textContent = room.price;
});

// Descripciones
document.querySelectorAll(".desc p").forEach(el => {
  el.textContent = room.desc;
});

// ============================
// CARGAR SLIDERS
// ============================
document.querySelectorAll(".slider").forEach(slider => {
  slider.innerHTML = ""; // limpiar imágenes viejas

  room.images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    slider.appendChild(img);
  });
});

// ============================
// LOG
// ============================
console.log("Habitación cargada:", room.name);
