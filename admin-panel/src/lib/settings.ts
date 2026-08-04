import fs from 'fs/promises';
import path from 'path';
import { sql, initDb } from './db';

export interface Settings {
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
  };
  hero?: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
  };
  about?: {
    poolTitle: string;
    poolDesc: string;
    serviceTitle: string;
    serviceDesc: string;
  };
  rooms?: {
    priceFrom: string;
    title: string;
    description: string;
    amenities: string[];
  };
  location?: {
    title: string;
    desc: string;
  };
  services?: {
    title: string;
    desc: string;
  };
  restaurant?: {
    title: string;
    desc: string;
  };
  beach?: {
    title: string;
    desc: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'src/data');
const DATA_FILE = path.join(DATA_DIR, 'settings.json');

const DEFAULT_SETTINGS: Settings = {
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
    titleLine1: "Hotel",
    titleLine2: "Palmeira's Tuxpan Beach",
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
        return value as Settings;
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error reading settings from Neon, falling back to local file:', error);
    }
  }

  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as Settings;
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
