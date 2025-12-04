'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Keyword {
  id: number;
  keyword: string;
  category: string;
  active: boolean;
  created_at: string;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyword, setNewKeyword] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await fetch('/api/keywords');
      
      if (response.status === 403) {
        router.push('/');
        return;
      }
      
      const data = await response.json();
      setKeywords(data);
    } catch (error) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newKeyword.trim()) {
      setError('Le mot-clé est requis');
      return;
    }

    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: newKeyword,
          category: newCategory,
          active: true,
        }),
      });

      if (response.ok) {
        setNewKeyword('');
        setNewCategory('');
        fetchKeywords();
      } else {
        setError('Erreur lors de l\'ajout');
      }
    } catch (error) {
      setError('Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce mot-clé ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/keywords?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchKeywords();
      }
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Gestion des Mots-Clés
          </h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Retour aux articles
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formulaire d'ajout */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ajouter un mot-clé</h2>
          <form onSubmit={handleAddKeyword} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot-clé *
                </label>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: intelligence artificielle"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Technologie"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </form>
        </div>

        {/* Liste des mots-clés */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Mots-clés ({keywords.length})
          </h2>
          
          {keywords.length === 0 ? (
            <p className="text-gray-600">Aucun mot-clé pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {keywords.map((keyword) => (
                <div
                  key={keyword.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">
                      {keyword.keyword}
                    </span>
                    {keyword.category && (
                      <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {keyword.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(keyword.id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
