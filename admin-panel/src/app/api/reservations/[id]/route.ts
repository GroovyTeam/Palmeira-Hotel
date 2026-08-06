import { NextResponse } from 'next/server';
import { updateReservationStatus, deleteReservation, updateReservationRoom } from '../../../../lib/reservations';

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

// PATCH update status or assigned room
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, assignedRoom } = body;

    let updated: any = null;

    if (status) {
      if (!['pending', 'contacted', 'cancelled', 'confirmed'].includes(status)) {
        return NextResponse.json(
          { error: 'Estado inválido.' },
          { status: 400, headers: corsHeaders }
        );
      }
      updated = await updateReservationStatus(id, status);
    }

    if (assignedRoom !== undefined) {
      updated = await updateReservationRoom(id, assignedRoom);
    }

    if (!updated) {
      return NextResponse.json(
        { error: 'Reservación no encontrada o no se pudo actualizar.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(updated, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('API PATCH Reservation Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la reservación.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE reservation
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteReservation(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Reservación no encontrada.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Reservación eliminada correctamente.' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('API DELETE Reservation Error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la reservación.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
