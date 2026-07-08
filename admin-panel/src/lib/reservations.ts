import fs from 'fs/promises';
import path from 'path';

export interface Reservation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'pending' | 'contacted' | 'cancelled';
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'src/data');
const DATA_FILE = path.join(DATA_DIR, 'reservations.json');

const SEED_DATA: Reservation[] = [
  {
    id: 'res_1',
    firstName: 'Sofía',
    lastName: 'Rodríguez',
    email: 'sofia.rod@example.com',
    phone: '5512345678',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'res_2',
    firstName: 'Alejandro',
    lastName: 'Gómez',
    email: 'a.gomez@example.com',
    phone: '5598765432',
    status: 'contacted',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'res_3',
    firstName: 'María',
    lastName: 'del Carmen',
    email: 'mcarmen@example.com',
    phone: '5545678901',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'res_4',
    firstName: 'Roberto',
    lastName: 'Sánchez',
    email: 'roberto.s@example.com',
    phone: '5532109876',
    status: 'cancelled',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  }
];

// Ensure the directory and file exist, initialized with seed data if needed
async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File does not exist, create it with seed data
      await fs.writeFile(DATA_FILE, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring reservations data file:', error);
  }
}

// Get all reservations
export async function getReservations(): Promise<Reservation[]> {
  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as Reservation[];
  } catch (error) {
    console.error('Error reading reservations file:', error);
    return [];
  }
}

// Save all reservations
export async function saveReservations(reservations: Reservation[]): Promise<boolean> {
  await ensureDataFile();
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(reservations, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing reservations file:', error);
    return false;
  }
}

// Add a single reservation
export async function addReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Promise<Reservation> {
  const reservations = await getReservations();
  const newReservation: Reservation = {
    ...reservation,
    id: `res_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  reservations.unshift(newReservation); // Add to the beginning of the list
  await saveReservations(reservations);
  return newReservation;
}

// Update a reservation's status
export async function updateReservationStatus(id: string, status: Reservation['status']): Promise<Reservation | null> {
  const reservations = await getReservations();
  const index = reservations.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  reservations[index].status = status;
  await saveReservations(reservations);
  return reservations[index];
}

// Delete a reservation
export async function deleteReservation(id: string): Promise<boolean> {
  const reservations = await getReservations();
  const filtered = reservations.filter(r => r.id !== id);
  if (filtered.length === reservations.length) return false;
  
  await saveReservations(filtered);
  return true;
}
