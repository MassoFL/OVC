-- Mettre à jour les articles en français
UPDATE articles SET 
  title = 'Concurrent lance une nouvelle fonctionnalité IA',
  summary = 'L''entreprise X a annoncé un outil d''analyse alimenté par l''IA révolutionnaire qui promet de transformer le traitement des données.'
WHERE id = 1;

UPDATE articles SET 
  title = 'Leader du marché s''étend en Asie',
  summary = 'Le concurrent principal ouvre trois nouveaux bureaux à Singapour, Tokyo et Séoul, signalant une expansion agressive.'
WHERE id = 2;

UPDATE articles SET 
  title = 'Nouvelle stratégie de prix annoncée',
  summary = 'Le concurrent Y réduit ses prix de 30% dans une tentative de capturer plus de parts de marché auprès des petits acteurs.'
WHERE id = 3;
