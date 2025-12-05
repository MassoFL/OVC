'use client';

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

interface Article {
  id: number;
  title: string;
  summary: string;
  source: string;
  url: string;
  published_date: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        // Vérifier que data est un tableau
        if (Array.isArray(data)) {
          setArticles(data);
          setFilteredArticles(data);
        } else {
          console.error('API returned non-array data:', data);
          setArticles([]);
          setFilteredArticles([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
        setArticles([]);
        setFilteredArticles([]);
        setLoading(false);
      });
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.summary.toLowerCase().includes(lowercaseQuery) ||
        article.source.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredArticles(filtered);
  };

  if (loading) {
    return (
      <>
        <Navbar onSearch={handleSearch} />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Chargement des articles...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <main className="min-h-screen p-8 bg-black">
        <div className="max-w-6xl mx-auto">
          {filteredArticles.length === 0 ? (
            <p className="text-gray-400">
              {articles.length === 0 
                ? "Aucun article trouvé. Ajoutez des données à la base de données!"
                : "Aucun résultat pour cette recherche."}
            </p>
          ) : (
            <div className="grid gap-6">
              {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:scale-[1.02] border border-gray-800"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-semibold text-white">
                    {article.title}
                  </h2>
                  <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                    {new Date(article.published_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">{article.summary}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                    {article.source}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ECC800] hover:text-[#ECC800]/80 text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    Lire plus →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
    </>
  );
}
