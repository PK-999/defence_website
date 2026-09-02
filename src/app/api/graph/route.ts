import { NextResponse } from 'next/server';
import { prisma } from '@/lib/content';

export async function GET() {
  try {
    const conflicts = await prisma.conflict.findMany({
      select: { 
        id: true, title: true, slug: true, 
        operations: { select: { id: true } },
        people: { select: { id: true } },
        equipment: { select: { id: true } }
      }
    });

    const people = await prisma.person.findMany({
      select: { 
        id: true, title: true, slug: true,
        operations: { select: { id: true } }
      }
    });

    const operations = await prisma.operation.findMany({
      select: { id: true, title: true, slug: true }
    });

    const equipment = await prisma.equipment.findMany({
      select: { id: true, title: true, slug: true }
    });

    const nodes: any[] = [];
    const links: any[] = [];
    const linkSet = new Set<string>();

    const addLink = (source: string, target: string) => {
      const id1 = source < target ? `${source}-${target}` : `${target}-${source}`;
      if (!linkSet.has(id1)) {
        linkSet.add(id1);
        links.push({ source, target });
      }
    };

    // Process nodes and relationships
    conflicts.forEach(c => {
      nodes.push({ id: c.id, name: c.title, group: 'Conflict', val: 20 });
      c.operations.forEach(o => addLink(c.id, o.id));
      c.people.forEach(p => addLink(c.id, p.id));
      c.equipment.forEach(e => addLink(c.id, e.id));
    });

    people.forEach(p => {
      nodes.push({ id: p.id, name: p.title, group: 'Person', val: 5 });
      p.operations.forEach(o => addLink(p.id, o.id));
    });

    operations.forEach(o => {
      nodes.push({ id: o.id, name: o.title, group: 'Operation', val: 10 });
    });

    equipment.forEach(e => {
      nodes.push({ id: e.id, name: e.title, group: 'Equipment', val: 5 });
    });

    return NextResponse.json({ nodes, links });
  } catch (error) {
    console.error('Graph API error:', error);
    return NextResponse.json({ error: 'Failed to generate graph' }, { status: 500 });
  }
}
