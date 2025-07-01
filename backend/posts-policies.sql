-- Supprimer les anciennes policies s'il y en a
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- Activer RLS sur la table posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre à tous les utilisateurs authentifiés de lire tous les posts
CREATE POLICY "Anyone can view posts"
ON posts FOR SELECT
TO authenticated
USING (true);

-- Policy pour permettre aux utilisateurs authentifiés de créer des posts
CREATE POLICY "Users can create posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy pour permettre aux utilisateurs de modifier leurs propres posts
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy pour permettre aux utilisateurs de supprimer leurs propres posts
CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Vérifier les policies créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'posts'; 