-- Script pour créer les politiques nécessaires pour la page Community
-- Permet aux créateurs de formations de voir les profils des utilisateurs qui ont acheté leurs formations

-- Politique pour que les créateurs puissent voir les profils des acheteurs de leurs formations
CREATE POLICY "Formation creators can view buyer profiles"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (
        -- L'utilisateur peut voir son propre profil
        auth.uid() = id
        OR
        -- L'utilisateur peut voir les profils des gens qui ont acheté ses formations
        id IN (
            SELECT pf.user_id
            FROM purchased_formations pf
            INNER JOIN formations f ON f.id = pf.formation_id
            WHERE f.user_id = auth.uid()
            AND pf.status = 'active'
        )
    );

-- Vérifier les politiques existantes sur profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles'; 