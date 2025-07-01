-- Migration: Ajouter la colonne prix à la table formations
-- Date: 2024
-- Description: Ajoute une colonne 'price' de type DECIMAL pour stocker le prix des formations

-- Ajouter la colonne price à la table formations
ALTER TABLE formations 
ADD COLUMN price DECIMAL(10,2) DEFAULT 49.99 NOT NULL;

-- Commentaire pour documenter la colonne
COMMENT ON COLUMN formations.price IS 'Prix de la formation en euros';

-- Optionnel: Mettre à jour les formations existantes avec un prix par défaut si nécessaire
-- UPDATE formations SET price = 49.99 WHERE price IS NULL;

-- Vérifier que la colonne a été ajoutée
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'formations' AND column_name = 'price'; 