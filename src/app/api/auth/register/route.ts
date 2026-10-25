import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { registerDistributor } from '@/lib/matrixEngine';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, sponsorId, flavorPreference, shippingAddress } = body;

    if (!name || !email || !password || !sponsorId || !flavorPreference || !shippingAddress) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const cleanSponsorId = sponsorId.trim().toUpperCase();

    // Verify sponsor exists
    const sponsor = db.prepare('SELECT id, name FROM users WHERE id = ?').get(cleanSponsorId) as { id: string; name: string } | undefined;
    if (!sponsor) {
      return NextResponse.json({ error: `Sponsor ID '${cleanSponsorId}' not found in the system.` }, { status: 400 });
    }

    // Verify email uniqueness
    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existingEmail) {
      return NextResponse.json({ error: 'This email address is already registered.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await registerDistributor({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      sponsorId: cleanSponsorId,
      flavorPreference,
      shippingAddress: shippingAddress.trim(),
    });

    const tokenPayload = {
      userId: result.userId,
      email: email.toLowerCase().trim(),
      role: 'member' as const,
      name: name.trim(),
    };

    const token = signToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'member',
        sponsorId: cleanSponsorId,
        parentId: result.parentId,
        matrixLevel: result.matrixLevel,
        position: result.position,
        bfsSequence: result.bfsSequence,
        orderId: result.orderId,
      },
    });

    response.cookies.set('orbit_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
