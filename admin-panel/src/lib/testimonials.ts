import fs from 'fs/promises';
import path from 'path';
import { sql, initDb } from './db';

export interface Testimonial {
  id: string;
  stars: number;
  author: string;
  quote: string;
}

const DATA_DIR = path.join(process.cwd(), 'src/data');
const DATA_FILE = path.join(DATA_DIR, 'testimonials.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring testimonials data file:', error);
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (sql) {
    try {
      await initDb();
      const result = await sql`SELECT * FROM testimonials`;
      return result as Testimonial[];
    } catch (error) {
      console.error('Error reading testimonials from Neon, falling back to local file:', error);
    }
  }

  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as Testimonial[];
  } catch (error) {
    console.error('Error reading testimonials file:', error);
    return [];
  }
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<boolean> {
  // Only called in local JSON fallback context
  await ensureDataFile();
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(testimonials, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing testimonials file:', error);
    return false;
  }
}

export async function addTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  const id = `t_${Math.random().toString(36).substr(2, 9)}`;
  if (sql) {
    try {
      await initDb();
      await sql`
        INSERT INTO testimonials (id, stars, author, quote)
        VALUES (${id}, ${testimonial.stars}, ${testimonial.author}, ${testimonial.quote})
      `;
      return { id, ...testimonial };
    } catch (error) {
      console.error('Error adding testimonial to Neon, falling back to local file:', error);
    }
  }

  const testimonials = await getTestimonials();
  const newT: Testimonial = {
    ...testimonial,
    id,
  };
  testimonials.push(newT);
  await saveTestimonials(testimonials);
  return newT;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (sql) {
    try {
      await initDb();
      await sql`DELETE FROM testimonials WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting testimonial from Neon, falling back to local file:', error);
    }
  }

  const testimonials = await getTestimonials();
  const filtered = testimonials.filter(t => t.id !== id);
  if (filtered.length === testimonials.length) return false;
  await saveTestimonials(filtered);
  return true;
}

export async function updateTestimonial(id: string, update: Partial<Testimonial>): Promise<Testimonial | null> {
  if (sql) {
    try {
      await initDb();
      const current = await sql`SELECT * FROM testimonials WHERE id = ${id} LIMIT 1`;
      if (current.length === 0) return null;
      
      const merged = { ...current[0], ...update } as Testimonial;
      await sql`
        UPDATE testimonials
        SET stars = ${merged.stars}, author = ${merged.author}, quote = ${merged.quote}
        WHERE id = ${id}
      `;
      return merged;
    } catch (error) {
      console.error('Error updating testimonial on Neon, falling back to local file:', error);
    }
  }

  const testimonials = await getTestimonials();
  const index = testimonials.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  testimonials[index] = { ...testimonials[index], ...update };
  await saveTestimonials(testimonials);
  return testimonials[index];
}
