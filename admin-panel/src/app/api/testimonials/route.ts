import { NextResponse } from 'next/server';
import { getTestimonials, addTestimonial } from '../../../lib/testimonials';

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
    const list = await getTestimonials();
    return NextResponse.json(list, { headers: corsHeaders });
  } catch (error) {
    console.error('API GET Testimonials Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener testimonios.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stars, author, quote } = body;

    if (!quote) {
      return NextResponse.json(
        { error: 'El testimonio requiere una cita de texto.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const newT = await addTestimonial({
      stars: Number(stars) || 5,
      author: author || 'Invitado anónimo',
      quote: quote.trim(),
    });

    return NextResponse.json(newT, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('API POST Testimonial Error:', error);
    return NextResponse.json(
      { error: 'Error al registrar testimonio.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
