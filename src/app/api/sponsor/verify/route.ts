import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sponsorId = searchParams.get('id');

    if (!sponsorId) {
      return NextResponse.json({ valid: false, error: 'Sponsor ID parameter missing' }, { status: 400 });
    }

    const sponsor = await db.queryOne(`
      SELECT id, name, role
      FROM users
      WHERE id = ?
    `, [sponsorId.trim()]);

    if (!sponsor) {
      return NextResponse.json({ valid: false, error: `Sponsor ID '${sponsorId}' not found.` }, { status: 444 });
    }

    return NextResponse.json({
      valid: true,
      sponsor: {
        id: sponsor.id,
        name: sponsor.name,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: 'Failed to verify sponsor' }, { status: 500 });
  }
}
