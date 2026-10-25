import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rootId = searchParams.get('root') || 'ORB00000';

  const node = db.prepare(`
    SELECT id, name, role, sponsor_id, parent_id, matrix_level, position, bfs_sequence, wallet_balance
    FROM users
    WHERE id = ?
  `).get(rootId) as any;

  if (!node) {
    return NextResponse.json({ error: 'Node not found' }, { status: 404 });
  }

  // Get direct children in matrix
  const children = db.prepare(`
    SELECT id, name, role, sponsor_id, parent_id, matrix_level, position, bfs_sequence, wallet_balance
    FROM users
    WHERE parent_id = ?
    ORDER BY position ASC
  `).all(rootId) as any[];

  return NextResponse.json({
    node,
    children,
  });
}
