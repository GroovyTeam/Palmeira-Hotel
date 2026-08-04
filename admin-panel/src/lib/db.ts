import { neon } from '@neondatabase/serverless';

// Initialize Neon SQL function if connection string is present
export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

// Track if database tables have been verified/created in this runtime instance
let dbInitialized = false;

// Default values for database seeding if empty
const DEFAULT_SETTINGS = {
  checkin: "15:00",
  checkout: "12:00",
  whatsapp: "527731758654",
  socials: {
    instagram: "https://instagram.com/hotelpalmeiras",
    facebook: "https://facebook.com/hotelpalmeiras"
  },
  chatbot: {
    enabled: true,
    botName: "Asistente Palmeira",
    welcomeMsg: "¡Hola! Bienvenido a Hotel Palmeira's. Soy tu asistente virtual. ¿En qué te puedo ayudar hoy?",
    waBotEnabled: true,
    waWelcomeMsg: "¡Hola! Bienvenido al asistente de WhatsApp de Hotel Palmeira. Escribe 'reservar' para cotizar o 'horarios' para conocer los tiempos de check-in/out."
  },
  hero: {
    title: "Hotel<br /><em>Palmeira's Tuxpan Beach</em>",
    subtitle: "Te invita a su consorcio hotelero que la brisa del mar y el golfo de México te ofrecen en un santuario de paz y elegancia, que se han diseñado para ti"
  },
  about: {
    poolTitle: "La Alberca",
    poolDesc: "Diseñada con el elemento natural (chukum), traído desde Mérida Yucatán, para que el agua se asemeje a los cenotes naturales de ese lugar.",
    serviceTitle: "Atención de su personal",
    serviceDesc: "Desde la cálida bienvenida hasta el último momento de tu estancia, nuestro equipo está dedicado a tu bienestar. Estamos atentos a cada detalle para convertir tu visita en una experiencia inolvidable."
  },
  rooms: {
    priceFrom: "$1,599 MXN",
    title: "Descanso y tranquilidad",
    description: "Despertar y observar desde tu habitación la tropicalidad de las aguas del golfo, en Tuxpan, Veracruz, México",
    amenities: [
      "Cama acogedora",
      "Limpieza",
      "Wi-Fi de alta velocidad"
    ]
  },
  location: {
    title: "Ubicación",
    desc: "De la ubicación, nos complace decir que es insuperable: nos encontramos a menos de 50 metros de la playa en Tuxpan, Veracruz, México. Un rincón pacífico ideal para descansar y desconectarse por completo del estrés cotidiano."
  },
  services: {
    title: "Vive y disfruta la naturaleza",
    desc: "Hacer conexión con la naturaleza de este cálido horizonte y belleza del sol, que las playas de Tuxpan, nos brindan para disfrutar con la familia, los amigos y con la tranquilidad de tu ser."
  },
  restaurant: {
    title: "Restaurante Xanat, Beach & Food",
    desc: "Descubra la fusión culinaria y de autor en el Restaurante Xanat, ubicado en las hermosas instalaciones de nuestro hotel. Deleite su paladar con una selecta variedad de platillos preparados con ingredientes frescos de la región y la maestría de nuestro chef, ofreciendo un viaje de sabores en un ambiente sofisticado y acogedor frente al mar."
  },
  beach: {
    title: "Momentos en la Playa",
    desc: "Sienta la calidez de la arena bajo sus pies y déjese envolver por el susurro constante de las olas. En el Hotel Palmeira's Tuxpan Beach, la playa no es solo un destino, sino un lugar donde el amanecer y el atardecer pintan el cielo de matices inolvidables que formarán parte de su historia y descanso."
  }
};

const DEFAULT_TESTIMONIALS = [
  {
    id: "t_1",
    stars: 5,
    author: "Mariana Rivera",
    quote: "La comida en el restaurante Xanat está riquísima, de verdad. Pedí los camarones al coco y el sabor es de otro nivel, aparte comes con la vista directa al mar. Nos gustó tanto que fuimos dos veces en la misma semana."
  },
  {
    id: "t_2",
    stars: 5,
    author: "Carlos Delgado",
    quote: "Un hotel excelente para relajarse. Literalmente cruzas la calle y ya estás en la arena. La alberca de Chukum es súper cómoda y el agua templada se siente riquísima de noche. Muy recomendado si buscas tranquilidad."
  },
  {
    id: "t_3",
    stars: 5,
    author: "Familia Gómez",
    quote: "Súper limpio todo y las camas comodísimas. Lo mejor de todo es el trato del personal, todos son súper atentos y amables desde que llegas. El aire acondicionado enfría excelente, indispensable por el calor de Tuxpan. Volveremos pronto."
  }
];

export async function initDb() {
  if (!sql) return;
  if (dbInitialized) return;

  try {
    // 1. Create settings table and seed if empty
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value JSONB NOT NULL
      );
    `;

    const settingsCheck = await sql`SELECT * FROM settings WHERE key = 'site_settings'`;
    if (settingsCheck.length === 0) {
      await sql`
        INSERT INTO settings (key, value)
        VALUES ('site_settings', ${JSON.stringify(DEFAULT_SETTINGS)})
      `;
      console.log('Seeded default site settings into Neon database.');
    }

    // 2. Create testimonials table and seed if empty
    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(50) PRIMARY KEY,
        stars INT NOT NULL,
        author VARCHAR(100) NOT NULL,
        quote TEXT NOT NULL
      );
    `;

    const testimonialsCheck = await sql`SELECT COUNT(*)::int as count FROM testimonials`;
    if (testimonialsCheck[0].count === 0) {
      for (const t of DEFAULT_TESTIMONIALS) {
        await sql`
          INSERT INTO testimonials (id, stars, author, quote)
          VALUES (${t.id}, ${t.stars}, ${t.author}, ${t.quote})
        `;
      }
      console.log('Seeded default testimonials into Neon database.');
    }

    // 3. Create reservations table
    await sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id VARCHAR(50) PRIMARY KEY,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        status VARCHAR(20) NOT NULL,
        "roomType" VARCHAR(100),
        guests INT,
        "checkIn" VARCHAR(30),
        "checkOut" VARCHAR(30),
        nights INT,
        "totalPrice" VARCHAR(30),
        "createdAt" VARCHAR(50) NOT NULL
      );
    `;

    dbInitialized = true;
    console.log('Database tables successfully verified and initialized in Neon PostgreSQL.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}
