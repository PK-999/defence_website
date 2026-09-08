import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isEntityType } from '@/lib/domain/entities';
import { getPublicGraphNeighborhood } from '@/lib/repositories/graph';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  if (!isEntityType(type) || !id?.trim()) return NextResponse.json({ error: "A public entity type and id are required." }, { status: 400 });
  const rawLimit = Number(url.searchParams.get("limit") ?? "40");
  const result = await getPublicGraphNeighborhood({ type, id }, { limit: Number.isFinite(rawLimit) ? rawLimit : 40 }, prisma);
  if (!result) return NextResponse.json({ error: "Public graph seed was not found." }, { status: 404 });
  return NextResponse.json(result);
}
