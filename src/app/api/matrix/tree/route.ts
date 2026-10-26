import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rootId = searchParams.get('root') || 'ORB00000';

    const rootUser = await db.queryOne(`
      SELECT id, name, parent_id, sponsor_id, matrix_level, position, bfs_sequence
      FROM users
      WHERE id = ?
    `, [rootId]);

    if (!rootUser) {
      return NextResponse.json({ error: 'Root node not found' }, { status: 404 });
    }

    const children = await db.query(`
      SELECT id, name, parent_id, sponsor_id, matrix_level, position, bfs_sequence
      FROM users
      WHERE parent_id = ?
      ORDER BY position ASC
    `, [rootId]);

    return NextResponse.json({
      root: rootUser,
      children,
      childCount: children.length,
      maxCapacity: 10,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch matrix tree' }, { status: 500 });
  }
}
