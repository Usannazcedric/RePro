-- Création de la table reviews pour les notes des formations
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  formation_id UUID REFERENCES formations(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, formation_id) -- Un utilisateur ne peut noter qu'une seule fois par formation
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reviews_formation_id ON reviews(formation_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Politique RLS : tout le monde peut voir les avis
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Politique RLS : les utilisateurs peuvent créer leurs propres avis
CREATE POLICY "Users can create their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique RLS : les utilisateurs peuvent modifier leurs propres avis
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Politique RLS : les utilisateurs peuvent supprimer leurs propres avis
CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Activer RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY; 