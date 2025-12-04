import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key');

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const { payload } = await jwtVerify(token.value, secret);

    // Récupérer le rôle depuis la base de données
    const result = await pool.query(
      'SELECT id, email, name, role FROM app_users WHERE id = $1',
      [payload.id]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
