-- Script pour ajouter la colonne is_published à la table formations
-- Ce script peut être exécuté dans Supabase SQL Editor

-- Ajouter la colonne is_published si elle n'existe pas
DO $$ 
BEGIN
    -- Ajouter la colonne is_published (statut de publication)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'is_published'
    ) THEN
        ALTER TABLE formations ADD COLUMN is_published BOOLEAN DEFAULT false;
        
        -- Mettre à jour les formations existantes pour qu'elles ne soient pas publiées par défaut
        UPDATE formations SET is_published = false WHERE is_published IS NULL;
        
        RAISE NOTICE 'Colonne is_published ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne is_published existe déjà';
    END IF;
END $$;

-- Vérifier que la colonne a été créée
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'formations' 
AND column_name = 'is_published'; 