-- Ajouter une colonne role à la table app_users
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Mettre à jour l'utilisateur test pour qu'il soit admin
UPDATE app_users SET role = 'admin' WHERE email = 'test@example.com';

-- Créer la table pour les mots-clés de recherche
CREATE TABLE IF NOT EXISTS search_keywords (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur le mot-clé
CREATE INDEX IF NOT EXISTS idx_search_keywords_keyword ON search_keywords(keyword);

-- Insérer quelques mots-clés de test
INSERT INTO search_keywords (keyword, category, active) VALUES
  ('intelligence artificielle', 'Technologie', true),
  ('fintech', 'Finance', true),
  ('blockchain', 'Technologie', true),
  ('cybersécurité', 'Sécurité', true),
  ('application mobile', 'Produit', true),
  ('partenariat', 'Business', true);
