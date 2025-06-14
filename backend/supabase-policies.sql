-- Désactiver temporairement RLS pour la configuration
ALTER TABLE formations DISABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Permettre l'insertion aux utilisateurs authentifiés" ON formations;
DROP POLICY IF EXISTS "Permettre la lecture de ses propres formations" ON formations;
DROP POLICY IF EXISTS "Permettre la mise à jour de ses propres formations" ON formations;
DROP POLICY IF EXISTS "Permettre la suppression de ses propres formations" ON formations;

-- Réactiver RLS
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre toutes les opérations au rôle service
CREATE POLICY "Permettre toutes les opérations au rôle service"
ON formations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Politique pour permettre la lecture aux utilisateurs authentifiés
CREATE POLICY "Permettre la lecture aux utilisateurs authentifiés"
ON formations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Vérifier que la table a les bonnes colonnes
DO $$ 
BEGIN
    -- Vérifier si la colonne user_id existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE formations ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$; 