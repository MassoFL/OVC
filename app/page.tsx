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
        setArticles(data);
        setFilteredArticles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
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
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Articles des Concurrents
          </h1>
          
          {filteredArticles.length === 0 ? (
            <p className="text-gray-600">
              {articles.length === 0 
                ? "Aucun article trouvé. Ajoutez des données à la base de données!"
                : "Aucun résultat pour cette recherche."}
            </p>
          ) : (
            <div className="grid gap-6">
              {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {article.title}
                  </h2>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {new Date(article.published_date).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{article.summary}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600">
                    {article.source}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
