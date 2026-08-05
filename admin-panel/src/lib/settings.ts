import fs from 'fs/promises';
import path from 'path';
import { sql, initDb } from './db';

export interface Settings {
  email: string;
  checkin: string;
  checkout: string;
  whatsapp: string;
  socials: {
    instagram: string;
    facebook: string;
  };
  chatbot: {
    enabled: boolean;
    botName: string;
    welcomeMsg: string;
    waBotEnabled?: boolean;
    waWelcomeMsg?: string;
    qna?: Array<{
      id: string;
      keywords: string;
      response: string;
    }>;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    bgImage?: string;
  };
  about: {
    poolTitle: string;
    poolDesc: string;
    serviceTitle: string;
    serviceDesc: string;
    poolImage?: string;
    serviceImage?: string;
  };
  rooms: {
    priceFrom?: string;
    title?: string;
    description?: string;
    amenities?: string[];
    list?: Array<{
      id: string;
      title: string;
      priceFrom: string;
      description: string;
      amenities: string[];
      imageSrc: string;
    }>;
  };
  services: {
    title: string;
    desc: string;
    list?: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
    }>;
  };
  restaurant: {
    title: string;
    desc: string;
    image?: string;
  };
  beach: {
    title: string;
    desc: string;
    image?: string;
  };
  location: {
    title: string;
    desc: string;
  };
  footer: {
    brand: string;
    copy: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'src/data');
const DATA_FILE = path.join(DATA_DIR, 'settings.json');

const DEFAULT_SETTINGS: Settings = {
  email: "hotelpalmeira@gmail.com",
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
    waWelcomeMsg: "¡Hola! Bienvenido al asistente de WhatsApp de Hotel Palmeira. Escribe 'reservar' para cotizar o 'horarios' para conocer los tiempos de check-in/out.",
    qna: [
      {
        id: "qna_1",
        keywords: "horario, check-in, checkin, checkout, check-out, hora",
        response: "Nuestros horarios de estadía son:\n• 🔑 Check-in: a partir de las {checkin} hrs\n• 🚪 Check-out: límite a las {checkout} hrs\n\nSi requiere ingresar antes o salir después de estas horas, coméntelo al realizar su reservación."
      },
      {
        id: "qna_2",
        keywords: "reservar, reserva, costo, precio, tarifa, noche, pagar",
        response: "¡Reservar en línea con nosotros es muy sencillo!\n\n1. Cierra este chat y haz clic en cualquier botón de Reservar de la página.\n2. Elige tus fechas de estadía y número de huéspedes para cotizar.\n3. Confirma tu solicitud de reservación y te redirigiremos a WhatsApp para finalizar con recepción."
      },
      {
        id: "qna_3",
        keywords: "bot, whatsapp bot, asistente, wa bot",
        response: "Contamos con un Asistente Virtual en WhatsApp activo las 24 horas para cotizar y reservar de forma automática.\n\nEscribe 'reservar' al número oficial de WhatsApp para iniciar la simulación."
      },
      {
        id: "qna_4",
        keywords: "alberca, piscina, chukum, wifi, internet, estacionamiento, aire",
        response: "Ofrecemos los siguientes servicios premium:\n• 🏊 Alberca de Chukum: Diseñada con arena natural de Mérida Yucatán para asemejarse a cenotes.\n• 📶 Wi-Fi: Conexión de alta velocidad en áreas comunes y habitaciones.\n• 🚗 Estacionamiento: Seguro y gratuito para nuestros huéspedes.\n• ❄️ Aire acondicionado en todas las habitaciones."
      },
      {
        id: "qna_5",
        keywords: "restaurante, comida, desayuno, chef, xanat, cenar",
        response: "Le invitamos a conocer el Restaurante Xanat, Beach & Food dentro de nuestras instalaciones:\n• 🍴 Fusión culinaria y comida de autor diseñada por nuestro chef.\n• 🕒 Servicio: Todos los días a partir de las 8:00 AM.\n• 🌅 Terraza con vista espectacular directamente al Golfo de México."
      },
      {
        id: "qna_6",
        keywords: "ubicacion, donde, dirección, mapa, playa, oxxo, tuxpan",
        response: "¡Nuestra ubicación es inmejorable!\n• 🏖️ Estamos a solo 50 metros de la playa en Tuxpan, Veracruz, México.\n• 🏪 Contamos con una tienda Oxxo a solo 30 metros del hotel.\n• 🚗 El centro de Tuxpan se localiza a 15 minutos en auto."
      },
      {
        id: "qna_7",
        keywords: "agente, humano, persona, whatsapp, llamar, telefono, recepcion",
        response: "Puedes iniciar un chat directo de soporte con recepción por WhatsApp haciendo clic en el botón flotante o contactándonos al número de reservas oficial."
      }
    ]
  },
  hero: {
    titleLine1: "Hotel",
    titleLine2: "Palmeira's Tuxpan Beach",
    subtitle: "Te invita a su consorcio hotelero que la brisa del mar y el golfo de México te ofrecen en un santuario de paz y elegancia, que se han diseñado para ti",
    bgImage: "./public/img/recursos/hero.png"
  },
  about: {
    poolTitle: "La Alberca",
    poolDesc: "Diseñada con el elemento natural (chukum), traído desde Mérida Yucatán, para que el agua se asemeje a los cenotes naturales de ese lugar.",
    serviceTitle: "Atención de su personal",
    serviceDesc: "Desde la cálida bienvenida hasta el último momento de tu estancia, nuestro equipo está dedicado a tu bienestar. Estamos atentos a cada detalle para convertir tu visita en una experiencia inolvidable.",
    poolImage: "./public/img/recursos/momento1.jpeg",
    serviceImage: "./public/img/recursos/alberca.png"
  },
  rooms: {
    list: [
      {
        id: "room_default_1",
        title: "Descanso y tranquilidad",
        priceFrom: "$1,599 MXN",
        description: "Despertar y observar desde tu habitación la tropicalidad de las aguas del golfo, en Tuxpan, Veracruz, México",
        amenities: ["Cama acogedora", "Limpieza", "Wi-Fi de alta velocidad"],
        imageSrc: "./public/img/recursos/room1.png"
      }
    ]
  },
  location: {
    title: "Ubicación",
    desc: "De la ubicación, nos complace decir que es insuperable: nos encontramos a menos de 50 metros de la playa en Tuxpan, Veracruz, México. Un rincón pacífico ideal para descansar y desconectarse por completo del estrés cotidiano."
  },
  services: {
    title: "Vive y disfruta la naturaleza",
    desc: "Hacer conexión con la naturaleza de este cálido horizonte y belleza del sol, que las playas de Tuxpan, nos brindan para disfrutar con la familia, los amigos y con la tranquilidad de tu ser.",
    list: [
      {
        id: "srv_default_1",
        icon: "location_on",
        title: "Ubicación",
        description: "Estamos a 50 metros de la playa en donde el encanto que buscas te envolverá en su oleaje para que sigas disfrutando del maravilloso mar."
      },
      {
        id: "srv_default_2",
        icon: "pool",
        title: "Alberca",
        description: "Disfruta de un chapuzón y nada a tu gusto para relajarte, sentirte tranquilo y divertirte en el lugar perfecto."
      },
      {
        id: "srv_default_3",
        icon: "restaurant",
        title: "Restaurante",
        description: "Es importante degustar la fusión culinaria y comida de autor, preparada para disfrutar de una diversidad de sabores directamente de la mesa a tu paladar, la que es elaborada con el conocimiento, satisfacción y experiencia de nuestro chef en Xanat."
      },
      {
        id: "srv_default_4",
        icon: "local_parking",
        title: "Estacionamiento",
        description: "Contamos con un estacionamiento que garantiza la seguridad de tu vehículo durante tu estancia."
      }
    ]
  },
  restaurant: {
    title: "Restaurante Xanat, Beach & Food",
    desc: "Descubra la fusión culinaria y de autor en el Restaurante Xanat, ubicado en las hermosas instalaciones de nuestro hotel. Deleite su paladar con una selecta variedad de platillos preparados con ingredientes frescos de la región y la maestría de nuestro chef, ofreciendo un viaje de sabores en un ambiente sofisticado y acogedor frente al mar.",
    image: "./public/img/recursos/restaurant.jpeg"
  },
  beach: {
    title: "Momentos en la Playa",
    desc: "Sienta la calidez de la arena bajo sus pies y déjese envolver por el susurro constante de las olas. En el Hotel Palmeira's Tuxpan Beach, la playa no es solo un destino, sino un lugar donde el amanecer y el atardecer pintan el cielo de matices inolvidables que formarán parte de su historia y descanso.",
    image: "./public/img/recursos/playa_nueva.png"
  },
  footer: {
    brand: "Palmeira's Tuxpan Beach, Veracruz, México",
    copy: "© 2025 Hotel Palmeira's Tuxpan Beach, Veracruz, México. La Veranda Tropical."
  }
};

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring settings data file:', error);
  }
}

export async function getSettings(): Promise<Settings> {
  if (sql) {
    try {
      await initDb();
      const result = await sql`SELECT value FROM settings WHERE key = 'site_settings' LIMIT 1`;
      if (result.length > 0) {
        const value = typeof result[0].value === 'string' ? JSON.parse(result[0].value) : result[0].value;
        
        // Sanitize database objects to have array properties if undefined
        const sanitized = {
          ...DEFAULT_SETTINGS,
          ...value,
          chatbot: {
            ...DEFAULT_SETTINGS.chatbot,
            ...(value.chatbot || {})
          },
          services: {
            ...DEFAULT_SETTINGS.services,
            ...(value.services || {}),
            list: (value.services && value.services.list) || DEFAULT_SETTINGS.services.list
          },
          rooms: {
            ...DEFAULT_SETTINGS.rooms,
            ...(value.rooms || {}),
            list: (value.rooms && value.rooms.list) || DEFAULT_SETTINGS.rooms.list
          }
        };
        return sanitized as Settings;
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error reading settings from Neon, falling back to local file:', error);
    }
  }

  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    const sanitized = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      chatbot: {
        ...DEFAULT_SETTINGS.chatbot,
        ...(parsed.chatbot || {})
      },
      services: {
        ...DEFAULT_SETTINGS.services,
        ...(parsed.services || {}),
        list: (parsed.services && parsed.services.list) || DEFAULT_SETTINGS.services.list
      },
      rooms: {
        ...DEFAULT_SETTINGS.rooms,
        ...(parsed.rooms || {}),
        list: (parsed.rooms && parsed.rooms.list) || DEFAULT_SETTINGS.rooms.list
      }
    };
    return sanitized as Settings;
  } catch (error) {
    console.error('Error reading settings file:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<boolean> {
  if (sql) {
    try {
      await initDb();
      await sql`
        INSERT INTO settings (key, value)
        VALUES ('site_settings', ${JSON.stringify(settings)})
        ON CONFLICT (key)
        DO UPDATE SET value = ${JSON.stringify(settings)}
      `;
      return true;
    } catch (error) {
      console.error('Error saving settings to Neon:', error);
      return false;
    }
  }

  await ensureDataFile();
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing settings file:', error);
    return false;
  }
}
