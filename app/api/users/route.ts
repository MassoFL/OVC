import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key');

async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    if (!token) return null;
    
    const { payload } = await jwtVerify(token.value, secret);
    
    const result = await pool.query(
      'SELECT id, email, name, role FROM app_users WHERE id = $1',
      [payload.id]
    );
    
    return result.rows[0];
  } catch (error) {
    return null;
  }
}

// GET - Récupérer tous les utilisateurs
export async function GET() {
  try {
    const user = await getUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const result = await pool.query(
      'SELECT id, email, name, role, created_at FROM app_users ORDER BY created_at DESC'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

// PATCH - Modifier le rôle d'un utilisateur
export async function PATCH(request: Request) {
  try {
    const user = await getUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'ID utilisateur et rôle requis' },
        { status: 400 }
      );
    }

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'UPDATE app_users SET role = $1 WHERE id = $2 RETURNING id, email, name, role',
      [role, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request: Request) {
  try {
    const user = await getUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    // Empêcher la suppression de son propre compte
    if (parseInt(userId) === user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM app_users WHERE id = $1', [userId]);

    return NextResponse.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
