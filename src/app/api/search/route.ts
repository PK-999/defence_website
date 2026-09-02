import { NextResponse } from 'next/server';
import { prisma } from '@/lib/content';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Define a reusable search clause (case insensitive match on SQLite using contains)
  const searchClause = {
    OR: [
      { title: { contains: query } },
      { summary: { contains: query } },
    ]
  };

  try {
    const [conflicts, people, operations, equipment] = await Promise.all([
      prisma.conflict.findMany({
        where: searchClause,
        take: 5,
        select: { id: true, title: true, slug: true, summary: true }
      }),
      prisma.person.findMany({
        where: searchClause,
        take: 5,
        select: { id: true, title: true, slug: true, summary: true }
      }),
      prisma.operation.findMany({
        where: searchClause,
        take: 5,
        select: { id: true, title: true, slug: true, summary: true }
      }),
      prisma.equipment.findMany({
        where: searchClause,
        take: 5,
        select: { id: true, title: true, slug: true, summary: true }
      }),
    ]);

    // Format results to a unified structure
    const formatResults = (items: any[], type: string, hrefPrefix: string) => 
      items.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        type,
        href: `${hrefPrefix}/${item.slug}`
      }));

    const results = [
      ...formatResults(conflicts, 'Conflict', '/history'),
      ...formatResults(people, 'Person', '/people'),
      ...formatResults(operations, 'Operation', '/operations'),
      ...formatResults(equipment, 'Equipment', '/arsenal'),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
