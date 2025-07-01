-- Script pour créer les politiques nécessaires pour la page Transactions
-- Permet aux créateurs de formations de voir les achats (transactions) de leurs formations

-- Politique pour que les créateurs puissent voir les achats de leurs formations avec JOIN
CREATE POLICY "Formation creators can view their sales transactions"
    ON purchased_formations
    FOR SELECT
    TO authenticated
    USING (
        formation_id IN (
            SELECT id 
            FROM formations 
            WHERE user_id = auth.uid()
        )
    );

-- Alternative: Politique plus explicite si la première ne fonctionne pas
-- DROP POLICY IF EXISTS "Formation creators can view their sales transactions" ON purchased_formations;
-- CREATE POLICY "Formation creators can view their sales transactions"
--     ON purchased_formations
--     FOR SELECT
--     TO authenticated
--     USING (
--         EXISTS (
--             SELECT 1 
--             FROM formations 
--             WHERE formations.id = purchased_formations.formation_id 
--             AND formations.user_id = auth.uid()
--         )
--     );

-- Vérifier les politiques existantes sur purchased_formations
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'purchased_formations'; 