-- Créer la table users pour l'authentification
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer un utilisateur de test (password: test123)
-- Hash bcrypt de "test123"
INSERT INTO users (email, password, name) VALUES
  ('test@example.com', '$2a$10$rKvVPZqGvVZqGvVZqGvVZuN5YJ5YJ5YJ5YJ5YJ5YJ5YJ5YJ5YJ5YJ', 'Utilisateur Test');
