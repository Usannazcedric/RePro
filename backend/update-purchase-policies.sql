-- Script pour mettre à jour les politiques RLS sur purchased_formations
-- Permet aux créateurs de formations de voir les achats de leurs formations

-- Ajouter une politique pour que les créateurs de formations puissent voir les achats de leurs formations
CREATE POLICY "Formation creators can view purchases of their formations"
    ON purchased_formations
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM formations 
            WHERE formations.id = purchased_formations.formation_id 
            AND formations.user_id = auth.uid()
        )
    );

-- Vérifier les politiques existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'purchased_formations'; 