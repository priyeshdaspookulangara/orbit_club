import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: any[] = [];

    if (search.trim()) {
      whereClause = 'WHERE u.id LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR u.sponsor_id LIKE ? OR u.parent_id LIKE ?';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    // Platform Metrics
    const totalRevenueRes = await db.queryOne(`SELECT COUNT(*) * 6000 as total_revenue FROM orders`);
    const totalMembersRes = await db.queryOne(`SELECT COUNT(*) as total_members FROM users WHERE role = 'member'`);
    const totalCommissionsRes = await db.queryOne(`SELECT SUM(amount) as total_commissions FROM transactions WHERE type IN ('DIRECT_REFERRAL', 'MATRIX_LEVEL')`);
    const totalOrdersRes = await db.queryOne(`SELECT COUNT(*) as total_orders FROM orders`);

    // Total Count
    const countRes = await db.queryOne(`SELECT COUNT(*) as total FROM users u ${whereClause}`, params);
    const totalRecords = countRes?.total || 0;

    // Paginated Members Listing
    const membersListQuery = `
      SELECT
        u.id, u.name, u.email, u.role, u.sponsor_id, u.parent_id,
        u.matrix_level, u.position, u.bfs_sequence, u.wallet_balance,
        u.flavor_preference, u.created_at,
        o.id as order_id, o.fulfillment_status, o.tracking_number
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id
      ${whereClause}
      ORDER BY u.bfs_sequence ASC
      LIMIT ? OFFSET ?
    `;

    const members = await db.query(membersListQuery, [...params, limit, offset]);

    return NextResponse.json({
      metrics: {
        totalRevenue: totalRevenueRes?.total_revenue || 0,
        totalMembers: totalMembersRes?.total_members || 0,
        totalCommissions: totalCommissionsRes?.total_commissions || 0,
        totalOrders: totalOrdersRes?.total_orders || 0,
      },
      members,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    });
  } catch (err: any) {
    console.error('Admin members fetch error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch members' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { orderId, fulfillmentStatus, trackingNumber } = await request.json();

    if (!orderId || !fulfillmentStatus) {
      return NextResponse.json({ error: 'Order ID and fulfillment status required' }, { status: 400 });
    }

    await db.query(`
      UPDATE orders
      SET fulfillment_status = ?, tracking_number = ?
      WHERE id = ?
    `, [fulfillmentStatus, trackingNumber || null, orderId]);

    return NextResponse.json({
      success: true,
      message: 'Product kit fulfillment status updated successfully',
    });
  } catch (err: any) {
    console.error('Order status update error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 });
  }
}
