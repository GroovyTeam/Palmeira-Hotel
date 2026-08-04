import { NextResponse } from 'next/server';
import { deleteTestimonial, updateTestimonial } from '../../../../lib/testimonials';

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updated = await updateTestimonial(id, body);
    if (!updated) {
      return NextResponse.json(
        { error: 'Testimonio no encontrado.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(updated, { headers: corsHeaders });
  } catch (error) {
    console.error('API PATCH Testimonial Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar testimonio.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteTestimonial(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Testimonio no encontrado.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Testimonio eliminado correctamente.' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('API DELETE Testimonial Error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar testimonio.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
