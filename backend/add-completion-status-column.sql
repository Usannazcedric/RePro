-- Ajouter la colonne is_completed à la table purchased_formations
ALTER TABLE purchased_formations ADD COLUMN is_completed BOOLEAN DEFAULT FALSE;

-- Mettre à jour les politiques pour permettre la mise à jour de is_completed
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre statut de complétion"
ON public.purchased_formations
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); 