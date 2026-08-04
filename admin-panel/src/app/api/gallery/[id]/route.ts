import { NextResponse } from 'next/server';
import { deleteGalleryItem } from '../../../../lib/gallery';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteGalleryItem(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Foto no encontrada.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Foto eliminada correctamente.' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('API DELETE Gallery Item Error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar foto de la galería.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
