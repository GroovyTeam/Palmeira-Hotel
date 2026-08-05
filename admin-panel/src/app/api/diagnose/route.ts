import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_DEFINED: !!process.env.DATABASE_URL,
      DATABASE_URL_PREVIEW: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL.substring(0, 15)}...${process.env.DATABASE_URL.substring(process.env.DATABASE_URL.length - 10)}`
        : 'none',
      NODE_ENV: process.env.NODE_ENV,
    },
    neonClientInitialized: !!sql,
    connectionTest: 'not_started',
    tablesVerified: {},
    error: null,
  };

  if (!process.env.DATABASE_URL) {
    diagnostics.connectionTest = 'failed';
    diagnostics.error = 'DATABASE_URL is not defined in the environment variables.';
    return NextResponse.json(diagnostics, { status: 200, headers: corsHeaders });
  }

  if (!sql) {
    diagnostics.connectionTest = 'failed';
    diagnostics.error = 'Neon client was not initialized. Check driver setup.';
    return NextResponse.json(diagnostics, { status: 200, headers: corsHeaders });
  }

  try {
    // 1. Connection test
    const testResult = await sql`SELECT 1 as connected`;
    diagnostics.connectionTest = testResult[0]?.connected === 1 ? 'success' : 'unexpected_result';

    // 2. Query settings table
    try {
      const settingsTable = await sql`SELECT * FROM settings LIMIT 1`;
      diagnostics.tablesVerified.settings = {
        exists: true,
        rowsCount: settingsTable.length,
        sampleKey: settingsTable[0]?.key || 'none',
      };
    } catch (e: any) {
      diagnostics.tablesVerified.settings = { exists: false, error: e.message };
    }

    // 3. Query testimonials table
    try {
      const testimonialsTable = await sql`SELECT COUNT(*)::int as count FROM testimonials`;
      diagnostics.tablesVerified.testimonials = {
        exists: true,
        rowsCount: testimonialsTable[0]?.count,
      };
    } catch (e: any) {
      diagnostics.tablesVerified.testimonials = { exists: false, error: e.message };
    }

    // 4. Query reservations table
    try {
      const reservationsTable = await sql`SELECT COUNT(*)::int as count FROM reservations`;
      diagnostics.tablesVerified.reservations = {
        exists: true,
        rowsCount: reservationsTable[0]?.count,
      };
    } catch (e: any) {
      diagnostics.tablesVerified.reservations = { exists: false, error: e.message };
    }

  } catch (err: any) {
    diagnostics.connectionTest = 'failed';
    diagnostics.error = err.message;
    diagnostics.stack = err.stack;
  }

  return NextResponse.json(diagnostics, { status: 200, headers: corsHeaders });
}
