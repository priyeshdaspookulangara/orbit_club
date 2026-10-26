import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = getAuthUser();
    if (!auth) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await db.queryOne(`
      SELECT
        id, name, email, role, sponsor_id, parent_id, matrix_level, position,
        bfs_sequence, wallet_balance, flavor_preference, shipping_address, created_at
      FROM users
      WHERE id = ?
    `, [auth.userId]);

    if (!user) {
      return NextResponse.json({ authenticated: false, error: 'User not found' }, { status: 404 });
    }

    const orders = await db.query(`
      SELECT id, package_name, amount, flavor, fulfillment_status, tracking_number, created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [auth.userId]);

    const transactions = await db.query(`
      SELECT id, source_user_id, type, amount, level_depth, description, created_at
      FROM transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [auth.userId]);

    const directRecruits = await db.query(`
      SELECT id, name, email, matrix_level, created_at
      FROM users
      WHERE sponsor_id = ?
      ORDER BY created_at DESC
    `, [auth.userId]);

    const matrixChildren = await db.query(`
      SELECT id, name, position, matrix_level
      FROM users
      WHERE parent_id = ?
      ORDER BY position ASC
    `, [auth.userId]);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        sponsorId: user.sponsor_id,
        parentId: user.parent_id,
        matrixLevel: user.matrix_level,
        position: user.position,
        bfsSequence: user.bfs_sequence,
        walletBalance: user.wallet_balance,
        flavorPreference: user.flavor_preference,
        shippingAddress: user.shipping_address,
        createdAt: user.created_at,
      },
      orders,
      transactions,
      directRecruits,
      matrixChildren,
    });
  } catch (err: any) {
    console.error('Fetch me profile error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch user data' }, { status: 500 });
  }
}
