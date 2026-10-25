import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
  const auth = getAuthUser();
  if (!auth) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = db.prepare(`
    SELECT id, name, email, role, sponsor_id, parent_id, matrix_level, position, bfs_sequence, wallet_balance, flavor_preference, shipping_address, created_at
    FROM users
    WHERE id = ?
  `).get(auth.userId) as any;

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
  }

  // Fetch orders and transactions for user dashboard
  const orders = db.prepare(`
    SELECT id, package_name, amount, flavor, fulfillment_status, tracking_number, created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(auth.userId);

  const transactions = db.prepare(`
    SELECT t.id, t.source_user_id, u.name as source_name, t.type, t.amount, t.level_depth, t.description, t.created_at
    FROM transactions t
    LEFT JOIN users u ON u.id = t.source_user_id
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
  `).all(auth.userId);

  // Fetch direct downline recruits
  const directRecruits = db.prepare(`
    SELECT id, name, email, matrix_level, created_at
    FROM users
    WHERE sponsor_id = ?
    ORDER BY created_at DESC
  `).all(auth.userId);

  // Fetch matrix children (directly assigned parent)
  const matrixChildren = db.prepare(`
    SELECT id, name, email, position, matrix_level, created_at
    FROM users
    WHERE parent_id = ?
    ORDER BY position ASC
  `).all(auth.userId);

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
}
