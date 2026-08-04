import fs from 'fs/promises';
import path from 'path';

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  spanClass?: string; // span-1-1, span-2-1, span-1-2, span-2-2
}

const DATA_DIR = path.join(process.cwd(), 'src/data');
const DATA_FILE = path.join(DATA_DIR, 'gallery.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring gallery data file:', error);
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as GalleryItem[];
  } catch (error) {
    console.error('Error reading gallery file:', error);
    return [];
  }
}

export async function saveGallery(gallery: GalleryItem[]): Promise<boolean> {
  await ensureDataFile();
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(gallery, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing gallery file:', error);
    return false;
  }
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  const gallery = await getGallery();
  
  // Decide spanClass based on category or layout distribution
  const spanOptions = ['span-1-1', 'span-2-1', 'span-1-2', 'span-2-2'];
  const spanClass = item.spanClass || spanOptions[Math.floor(Math.random() * 2)]; // default to simple variations
  
  const newItem: GalleryItem = {
    ...item,
    id: `g_${Math.random().toString(36).substr(2, 9)}`,
    spanClass,
  };
  
  gallery.push(newItem);
  await saveGallery(gallery);
  return newItem;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const gallery = await getGallery();
  const filtered = gallery.filter(g => g.id !== id);
  if (filtered.length === gallery.length) return false;
  await saveGallery(filtered);
  return true;
}
