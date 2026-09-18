import { NextResponse } from 'next/server';

// Reserved callback path for the future MAL OAuth implementation.
// Never reflect authorization codes or tokens into the response.
export function GET() {
  return NextResponse.json(
    { error: 'connection_not_available', message: 'MyAnimeList connection is not enabled yet. Please return to the homepage.' },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
