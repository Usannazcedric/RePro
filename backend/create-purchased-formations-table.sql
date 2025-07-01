-- Script pour créer la table purchased_formations
-- Cette table gère les achats de formations par les utilisateurs

-- Créer la table purchased_formations si elle n'existe pas
CREATE TABLE IF NOT EXISTS purchased_formations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    formation_id UUID REFERENCES formations(id) ON DELETE CASCADE NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Contrainte unique pour éviter les doublons
    UNIQUE(user_id, formation_id)
);

-- Activer RLS (Row Level Security)
ALTER TABLE purchased_formations ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité
CREATE POLICY "Users can view their own purchased formations"
    ON purchased_formations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchased formations"
    ON purchased_formations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchased formations"
    ON purchased_formations
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Créer la fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_purchased_formations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer le trigger pour mettre à jour updated_at
CREATE TRIGGER update_purchased_formations_updated_at
    BEFORE UPDATE
    ON purchased_formations
    FOR EACH ROW
EXECUTE PROCEDURE update_purchased_formations_updated_at();

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_purchased_formations_user_id ON purchased_formations(user_id);
CREATE INDEX IF NOT EXISTS idx_purchased_formations_formation_id ON purchased_formations(formation_id);
CREATE INDEX IF NOT EXISTS idx_purchased_formations_user_formation ON purchased_formations(user_id, formation_id);

-- Vérifier que la table a été créée
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'purchased_formations' 
ORDER BY ordinal_position; 