import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sponsorId = searchParams.get('sponsorId');

  if (!sponsorId) {
    return NextResponse.json({ valid: false, message: 'Sponsor ID is required.' }, { status: 400 });
  }

  const cleanId = sponsorId.trim().toUpperCase();
  const user = db.prepare('SELECT id, name FROM users WHERE id = ?').get(cleanId) as { id: string; name: string } | undefined;

  if (user) {
    return NextResponse.json({ valid: true, name: user.name, id: user.id });
  } else {
    return NextResponse.json({ valid: false, message: 'Sponsor ID not found in database.' }, { status: 404 });
  }
}
