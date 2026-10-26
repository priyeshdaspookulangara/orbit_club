import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'ALL'; // ALL | DIRECT_REFERRAL | MATRIX_LEVEL | WITHDRAWAL
    const search = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const params: any[] = [];

    if (auth.role !== 'admin') {
      whereClause += ' AND t.user_id = ?';
      params.push(auth.userId);
    } else if (search.trim()) {
      whereClause += ' AND (t.user_id LIKE ? OR u.name LIKE ? OR t.description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (type !== 'ALL') {
      whereClause += ' AND t.type = ?';
      params.push(type);
    }

    // Get Total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE ${whereClause}
    `;
    const countRes = await db.queryOne(countQuery, params);
    const totalRecords = countRes?.total || 0;

    // Get Paginated Transactions
    const dataQuery = `
      SELECT
        t.id,
        t.user_id,
        u.name as user_name,
        u.email as user_email,
        t.source_user_id,
        s.name as source_user_name,
        t.type,
        t.amount,
        t.level_depth,
        t.description,
        t.created_at
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN users s ON t.source_user_id = s.id
      WHERE ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const transactions = await db.query(dataQuery, [...params, limit, offset]);

    // Calculate Summary Stats
    let statsQuery = `
      SELECT
        SUM(CASE WHEN t.type = 'DIRECT_REFERRAL' THEN t.amount ELSE 0 END) as total_direct,
        SUM(CASE WHEN t.type = 'MATRIX_LEVEL' THEN t.amount ELSE 0 END) as total_matrix,
        SUM(CASE WHEN t.type = 'WITHDRAWAL' THEN ABS(t.amount) ELSE 0 END) as total_withdrawn
      FROM transactions t
    `;
    const statsParams: any[] = [];
    if (auth.role !== 'admin') {
      statsQuery += ` WHERE t.user_id = ?`;
      statsParams.push(auth.userId);
    }

    const stats = await db.queryOne(statsQuery, statsParams);

    return NextResponse.json({
      success: true,
      transactions,
      stats: {
        totalDirect: Number(stats?.total_direct) || 0,
        totalMatrix: Number(stats?.total_matrix) || 0,
        totalWithdrawn: Number(stats?.total_withdrawn) || 0,
        netBalance: (Number(stats?.total_direct) || 0) + (Number(stats?.total_matrix) || 0) - (Number(stats?.total_withdrawn) || 0),
      },
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    });
  } catch (err: any) {
    console.error('Payout report error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch payout report' }, { status: 500 });
  }
}
