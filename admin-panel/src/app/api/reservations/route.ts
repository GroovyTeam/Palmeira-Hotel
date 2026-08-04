import { NextResponse } from 'next/server';
import { getReservations, addReservation } from '../../../lib/reservations';

// Common CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET all reservations
export async function GET() {
  try {
    const list = await getReservations();
    return NextResponse.json(list, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('API GET Reservations Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener las reservaciones.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST create reservation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      roomType, 
      guests, 
      checkIn, 
      checkOut, 
      nights, 
      totalPrice,
      status
    } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const newRes = await addReservation({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      roomType: roomType ? roomType.trim() : undefined,
      guests: guests ? Number(guests) : undefined,
      checkIn: checkIn ? checkIn.trim() : undefined,
      checkOut: checkOut ? checkOut.trim() : undefined,
      nights: nights ? Number(nights) : undefined,
      totalPrice: totalPrice ? totalPrice.trim() : undefined,
      status: status ? status.trim() : undefined,
    });

    return NextResponse.json(newRes, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('API POST Reservation Error:', error);
    return NextResponse.json(
      { error: 'Error al registrar la reservación.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
