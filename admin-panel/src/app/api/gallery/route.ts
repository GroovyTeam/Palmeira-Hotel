import { NextResponse } from 'next/server';
import { getGallery, addGalleryItem } from '../../../lib/gallery';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const list = await getGallery();
    return NextResponse.json(list, { headers: corsHeaders });
  } catch (error) {
    console.error('API GET Gallery Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener la galería.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { src, alt, category, spanClass } = body;

    if (!src) {
      return NextResponse.json(
        { error: 'Se requiere la URL o ruta de la imagen.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const newItem = await addGalleryItem({
      src: src.trim(),
      alt: (alt || 'Momento Palmeira').trim(),
      category: category || 'general',
      spanClass: spanClass || 'span-1-1'
    });

    return NextResponse.json(newItem, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('API POST Gallery Error:', error);
    return NextResponse.json(
      { error: 'Error al registrar foto en la galería.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
