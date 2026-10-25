import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'orbit-nutrition-2026-super-secret-key-jwt-secure';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'member' | 'admin';
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function getAuthUser(): TokenPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get('orbit_auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
