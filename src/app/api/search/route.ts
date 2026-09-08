import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { searchArchive } from '@/lib/search/service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const query = searchParams.get('q') ?? "";
    if (query.trim().length < 2) return NextResponse.json({ results: [], total: 0, page: 1, pageSize: 8, pageCount: 1 });
    const result = await searchArchive({ q: query, type: searchParams.get('type') ?? undefined, page: Number(searchParams.get('page') ?? "1"), mode: searchParams.get('mode') === "full" ? "full" : "quick" }, prisma);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: error instanceof Error && ["INVALID_QUERY", "INVALID_TYPE"].includes(error.message) ? error.message : 'Search is temporarily unavailable.' }, { status: error instanceof Error && ["INVALID_QUERY", "INVALID_TYPE"].includes(error.message) ? 400 : 503 });
  }
}
