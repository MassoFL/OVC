-- Créer la table app_users pour l'authentification de l'application
CREATE TABLE IF NOT EXISTS app_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur l'email pour des recherches rapides
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
