import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { emailOrId, password } = await request.json();

    if (!emailOrId || !password) {
      return NextResponse.json({ error: 'Email/ID and Password are required' }, { status: 400 });
    }

    const user = await db.queryOne(`
      SELECT id, name, email, password_hash, role
      FROM users
      WHERE id = ? OR email = ?
    `, [emailOrId.trim(), emailOrId.trim().toLowerCase()]);

    if (!user) {
      return NextResponse.json({ error: 'Invalid distributor credentials' }, { status: 401 });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid distributor credentials' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set('orbit_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message || 'Authentication failed' }, { status: 500 });
  }
}
