import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailOrId, password } = body;

    if (!emailOrId || !password) {
      return NextResponse.json({ error: 'Distributor ID / Email and password are required.' }, { status: 400 });
    }

    const queryVal = emailOrId.trim();

    // Query user by ID or Email
    const user = db.prepare(`
      SELECT id, name, email, password_hash, role, sponsor_id, parent_id, matrix_level, bfs_sequence, wallet_balance
      FROM users
      WHERE UPPER(id) = UPPER(?) OR LOWER(email) = LOWER(?)
    `).get(queryVal, queryVal) as {
      id: string;
      name: string;
      email: string;
      password_hash: string;
      role: 'member' | 'admin';
      sponsor_id: string | null;
      parent_id: string | null;
      matrix_level: number;
      bfs_sequence: number;
      wallet_balance: number;
    } | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Invalid ID/Email or password.' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid ID/Email or password.' }, { status: 401 });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = signToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        sponsorId: user.sponsor_id,
        parentId: user.parent_id,
        matrixLevel: user.matrix_level,
        bfsSequence: user.bfs_sequence,
        walletBalance: user.wallet_balance,
      },
    });

    response.cookies.set('orbit_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
