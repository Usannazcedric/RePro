-- Créer la table reactions
CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte unique pour éviter qu'un utilisateur réagisse plusieurs fois au même post
  UNIQUE(post_id, user_id)
);

-- Activer RLS
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre à tous les utilisateurs authentifiés de voir les réactions
CREATE POLICY "Anyone can view reactions"
ON reactions FOR SELECT
TO authenticated
USING (true);

-- Policy pour permettre aux utilisateurs de créer leurs propres réactions
CREATE POLICY "Users can create reactions"
ON reactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy pour permettre aux utilisateurs de modifier leurs propres réactions
CREATE POLICY "Users can update their own reactions"
ON reactions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy pour permettre aux utilisateurs de supprimer leurs propres réactions
CREATE POLICY "Users can delete their own reactions"
ON reactions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Créer un index pour améliorer les performances
CREATE INDEX idx_reactions_post_id ON reactions(post_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id); 