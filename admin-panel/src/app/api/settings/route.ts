import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '../../../lib/settings';

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
    const settings = await getSettings();
    return NextResponse.json(settings, { headers: corsHeaders });
  } catch (error) {
    console.error('API GET Settings Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuraciones.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = await getSettings();
    
    const updated = {
      ...current,
      ...body,
      socials: {
        ...current.socials,
        ...(body.socials || {}),
      },
      chatbot: {
        ...current.chatbot,
        ...(body.chatbot || {}),
      },
      hero: {
        ...current.hero,
        ...(body.hero || {}),
      },
      about: {
        ...current.about,
        ...(body.about || {}),
      },
      rooms: {
        ...current.rooms,
        ...(body.rooms || {}),
      },
      location: {
        ...current.location,
        ...(body.location || {}),
      },
      services: {
        ...current.services,
        ...(body.services || {}),
      },
      restaurant: {
        ...current.restaurant,
        ...(body.restaurant || {}),
      },
      beach: {
        ...current.beach,
        ...(body.beach || {}),
      }
    };

    const success = await saveSettings(updated);
    if (!success) throw new Error('Could not write to file');

    return NextResponse.json(updated, { headers: corsHeaders });
  } catch (error) {
    console.error('API POST Settings Error:', error);
    return NextResponse.json(
      { error: 'Error al guardar configuraciones.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
