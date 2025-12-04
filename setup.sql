-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT NOT NULL,
  source VARCHAR(200) NOT NULL,
  url TEXT NOT NULL UNIQUE,
  published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on url for better performance
CREATE INDEX IF NOT EXISTS idx_articles_url ON articles(url);

-- Insert sample data (using ON CONFLICT to avoid errors if already exists)
INSERT INTO articles (title, summary, source, url, published_date) VALUES
  ('Competitor launches new AI feature', 'Company X announced a groundbreaking AI-powered analytics tool that promises to revolutionize data processing.', 'TechCrunch', 'https://example.com/article1', '2024-11-28'),
  ('Market leader expands to Asia', 'Leading competitor opens three new offices in Singapore, Tokyo, and Seoul, signaling aggressive expansion.', 'Bloomberg', 'https://example.com/article2', '2024-11-27'),
  ('New pricing strategy announced', 'Competitor Y reduces prices by 30% in attempt to capture more market share from smaller players.', 'Forbes', 'https://example.com/article3', '2024-11-26')
ON CONFLICT (url) DO NOTHING;
