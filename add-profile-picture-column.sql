-- Ajouter la colonne profile_picture à la table profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_picture TEXT; 