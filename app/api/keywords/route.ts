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
    
    // Récupérer le rôle de l'utilisateur
    const result = await pool.query(
      'SELECT id, email, name, role FROM app_users WHERE id = $1',
      [payload.id]
    );
    
    return result.rows[0];
  } catch (error) {
    return null;
  }
}

// GET - Récupérer tous les mots-clés
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
      'SELECT * FROM search_keywords ORDER BY category, keyword'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des mots-clés' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un nouveau mot-clé
export async function POST(request: Request) {
  try {
    const user = await getUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { keyword, category, active } = await request.json();

    if (!keyword) {
      return NextResponse.json(
        { error: 'Le mot-clé est requis' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO search_keywords (keyword, category, active) VALUES ($1, $2, $3) RETURNING *',
      [keyword, category || null, active !== false]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating keyword:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du mot-clé' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un mot-clé
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM search_keywords WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Mot-clé supprimé' });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
