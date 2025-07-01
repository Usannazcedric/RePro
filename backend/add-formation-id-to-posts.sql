-- Ajouter la colonne formation_id à la table posts
ALTER TABLE posts ADD COLUMN formation_id UUID;

-- Ajouter une clé étrangère vers la table formations
ALTER TABLE posts ADD CONSTRAINT fk_posts_formation 
FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE;

-- Créer un index pour améliorer les performances des requêtes
CREATE INDEX idx_posts_formation_id ON posts(formation_id);

-- Optionnel : Mettre à jour les posts existants si vous voulez garder les données
-- UPDATE posts SET formation_id = (
--   SELECT id FROM formations WHERE formations.title = posts.formation_title LIMIT 1
-- ) WHERE formation_title IS NOT NULL; 