import fs from 'fs/promises';
import path from 'path';
import { sql, initDb } from './db';

export interface Reservation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'pending' | 'contacted' | 'cancelled' | 'confirmed';
  createdAt: string;
  roomType?: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  totalPrice?: string;
  assignedRoom?: string;
}

const DATA_DIR = path.join(process.cwd(), 'src/data');
const DATA_FILE = path.join(DATA_DIR, 'reservations.json');

// Ensure the directory and file exist (fallback context only)
async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring reservations data file:', error);
  }
}

// Get all reservations
export async function getReservations(): Promise<Reservation[]> {
  if (sql) {
    try {
      await initDb();
      const result = await sql`SELECT * FROM reservations ORDER BY "createdAt" DESC`;
      return result as Reservation[];
    } catch (error) {
      console.error('Error reading reservations from Neon, falling back to local file:', error);
    }
  }

  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as Reservation[];
  } catch (error) {
    console.error('Error reading reservations file:', error);
    return [];
  }
}

// Save all reservations (fallback context only)
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

export async function addReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'> & { id?: string, status?: Reservation['status'], assignedRoom?: string }): Promise<Reservation> {
  const id = reservation.id || `res_${Math.random().toString(36).substr(2, 9)}`;
  const status = reservation.status || 'pending';
  const createdAt = new Date().toISOString();

  // Auto-assign first free physical room instance if not provided
  let assignedRoom: string | undefined = reservation.assignedRoom;
  if (!assignedRoom && reservation.roomType) {
    try {
      const { getSettings } = require('./settings');
      const settings = await getSettings();
      const room = settings.rooms?.list?.find((r: any) => r.title === reservation.roomType);
      const instances = room?.roomInstances || [];
      
      if (instances.length > 0) {
        // Get all active reservations to find overlaps
        const allRes = await getReservations();
        const overlaps = allRes.filter((r: any) => {
          if (r.status === 'cancelled') return false;
          if (r.roomType !== reservation.roomType) return false;
          if (!r.checkIn || !r.checkOut || !reservation.checkIn || !reservation.checkOut) return false;
          
          const rIn = new Date(r.checkIn);
          const rOut = new Date(r.checkOut);
          const selIn = new Date(reservation.checkIn);
          const selOut = new Date(reservation.checkOut);
          
          return (selIn < rOut && selOut > rIn);
        });
        
        const occupied = overlaps.map((r: any) => r.assignedRoom).filter(Boolean);
        const freeInstance = instances.find((inst: string) => !occupied.includes(inst));
        assignedRoom = freeInstance || instances[0];
      }
    } catch (err) {
      console.error('Error auto-assigning physical room:', err);
    }
  }

  if (sql) {
    try {
      await initDb();
      await sql`
        INSERT INTO reservations (
          id, "firstName", "lastName", email, phone, status, 
          "roomType", guests, "checkIn", "checkOut", nights, "totalPrice", "createdAt", "assignedRoom"
        )
        VALUES (
          ${id}, ${reservation.firstName}, ${reservation.lastName}, ${reservation.email}, ${reservation.phone}, ${status},
          ${reservation.roomType || null}, ${reservation.guests || null}, ${reservation.checkIn || null}, 
          ${reservation.checkOut || null}, ${reservation.nights || null}, ${reservation.totalPrice || null}, ${createdAt},
          ${assignedRoom || null}
        )
      `;
      return {
        id,
        ...reservation,
        status,
        createdAt,
        assignedRoom
      } as Reservation;
    } catch (error) {
      console.error('Error adding reservation to Neon, falling back to local file:', error);
    }
  }

  const reservations = await getReservations();
  const newReservation: Reservation = {
    ...reservation,
    id,
    status,
    createdAt,
    assignedRoom
  };
  reservations.unshift(newReservation);
  await saveReservations(reservations);
  return newReservation;
}

// Update a reservation's status
export async function updateReservationStatus(id: string, status: Reservation['status']): Promise<Reservation | null> {
  if (sql) {
    try {
      await initDb();
      const current = await sql`SELECT * FROM reservations WHERE id = ${id} LIMIT 1`;
      if (current.length === 0) return null;
      
      await sql`UPDATE reservations SET status = ${status} WHERE id = ${id}`;
      return {
        ...current[0],
        status
      } as Reservation;
    } catch (error) {
      console.error('Error updating reservation status on Neon, falling back to local file:', error);
    }
  }

  const reservations = await getReservations();
  const index = reservations.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  reservations[index].status = status;
  await saveReservations(reservations);
  return reservations[index];
}

// Delete a reservation
export async function deleteReservation(id: string): Promise<boolean> {
  if (sql) {
    try {
      await initDb();
      await sql`DELETE FROM reservations WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting reservation from Neon, falling back to local file:', error);
    }
  }

  const reservations = await getReservations();
  const filtered = reservations.filter(r => r.id !== id);
  if (filtered.length === reservations.length) return false;
  
  await saveReservations(filtered);
  return true;
}

// Update a reservation's assigned physical room
export async function updateReservationRoom(id: string, assignedRoom: string): Promise<Reservation | null> {
  if (sql) {
    try {
      await initDb();
      const current = await sql`SELECT * FROM reservations WHERE id = ${id} LIMIT 1`;
      if (current.length === 0) return null;
      
      await sql`UPDATE reservations SET "assignedRoom" = ${assignedRoom} WHERE id = ${id}`;
      return {
        ...current[0],
        assignedRoom
      } as Reservation;
    } catch (error) {
      console.error('Error updating reservation room on Neon, falling back to local file:', error);
    }
  }

  const reservations = await getReservations();
  const index = reservations.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  reservations[index].assignedRoom = assignedRoom;
  await saveReservations(reservations);
  return reservations[index];
}
