import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = getAuthUser();
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  // Platform metrics
  const totalRevenueResult = db.prepare('SELECT SUM(amount) as total FROM orders').get() as { total: number | null };
  const totalRevenue = totalRevenueResult.total || 0;

  const totalMembersResult = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "member"').get() as { count: number };
  const totalMembers = totalMembersResult.count;

  const totalCommissionsResult = db.prepare('SELECT SUM(amount) as total FROM transactions').get() as { total: number | null };
  const totalCommissions = totalCommissionsResult.total || 0;

  const totalOrdersResult = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  const totalOrders = totalOrdersResult.count;

  // Filtered members list
  const searchFilter = query ? `%${query.trim()}%` : '%';

  const countResult = db.prepare(`
    SELECT COUNT(*) as count FROM users
    WHERE id LIKE ? OR name LIKE ? OR email LIKE ? OR sponsor_id LIKE ? OR parent_id LIKE ?
  `).get(searchFilter, searchFilter, searchFilter, searchFilter, searchFilter) as { count: number };

  const members = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.sponsor_id, u.parent_id, u.matrix_level, u.position, u.bfs_sequence, u.wallet_balance, u.flavor_preference, u.shipping_address, u.created_at,
           o.fulfillment_status, o.tracking_number, o.id as order_id
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    WHERE u.id LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR u.sponsor_id LIKE ? OR u.parent_id LIKE ?
    ORDER BY u.bfs_sequence ASC
    LIMIT ? OFFSET ?
  `).all(searchFilter, searchFilter, searchFilter, searchFilter, searchFilter, limit, offset);

  return NextResponse.json({
    metrics: {
      totalRevenue,
      totalMembers,
      totalCommissions,
      totalOrders,
    },
    members,
    pagination: {
      page,
      limit,
      totalRecords: countResult.count,
      totalPages: Math.ceil(countResult.count / limit),
    },
  });
}

export async function PATCH(req: NextRequest) {
  const auth = getAuthUser();
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized access.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { orderId, fulfillmentStatus, trackingNumber } = body;

    if (!orderId || !fulfillmentStatus) {
      return NextResponse.json({ error: 'OrderId and fulfillmentStatus are required.' }, { status: 400 });
    }

    db.prepare(`
      UPDATE orders
      SET fulfillment_status = ?, tracking_number = ?
      WHERE id = ?
    `).run(fulfillmentStatus, trackingNumber || null, orderId);

    return NextResponse.json({ success: true, message: 'Fulfillment status updated.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
