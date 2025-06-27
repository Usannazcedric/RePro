-- Désactiver temporairement RLS pour la configuration
ALTER TABLE formations DISABLE ROW LEVEL SECURITY;

-- Supprimer TOUTES les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Permettre l'insertion aux utilisateurs authentifiés" ON formations;
DROP POLICY IF EXISTS "Permettre la lecture de ses propres formations" ON formations;
DROP POLICY IF EXISTS "Permettre la mise à jour de ses propres formations" ON formations;
DROP POLICY IF EXISTS "Permettre la suppression de ses propres formations" ON formations;
DROP POLICY IF EXISTS "Permettre toutes les opérations au rôle service" ON formations;
DROP POLICY IF EXISTS "Permettre la lecture aux utilisateurs authentifiés" ON formations;

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

-- Politique pour permettre l'insertion aux utilisateurs authentifiés
CREATE POLICY "Permettre l'insertion aux utilisateurs authentifiés"
ON formations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Ajouter les colonnes nécessaires
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

    -- Ajouter une colonne JSON pour stocker toutes les données du wizard
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'formation_data'
    ) THEN
        ALTER TABLE formations ADD COLUMN formation_data JSONB;
    END IF;

    -- Ajouter une colonne pour le résumé (pour faciliter les recherches)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'summary'
    ) THEN
        ALTER TABLE formations ADD COLUMN summary TEXT;
    END IF;

    -- Ajouter une colonne pour les quiz (JSONB)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'quizzes'
    ) THEN
        ALTER TABLE formations ADD COLUMN quizzes JSONB;
    END IF;

    -- Ajouter une colonne pour les tips
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'tips'
    ) THEN
        ALTER TABLE formations ADD COLUMN tips TEXT;
    END IF;

    -- Ajouter la colonne pour la photo de couverture
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'cover_image_url'
    ) THEN
        ALTER TABLE formations ADD COLUMN cover_image_url TEXT;
    END IF;

    -- Ajouter la colonne pour le nombre de quiz configuré
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'configured_quiz_count'
    ) THEN
        ALTER TABLE formations ADD COLUMN configured_quiz_count INTEGER DEFAULT 5;
    END IF;

    -- Ajouter la colonne pour le nombre de chapitres configuré
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'configured_chapter_count'
    ) THEN
        ALTER TABLE formations ADD COLUMN configured_chapter_count INTEGER DEFAULT 1;
    END IF;

    -- Ajouter la colonne pour le fichier PDF
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'pdf_url'
    ) THEN
        ALTER TABLE formations ADD COLUMN pdf_url TEXT;
    END IF;

    -- Ajouter la colonne pour le résultat IA
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'ia_result'
    ) THEN
        ALTER TABLE formations ADD COLUMN ia_result JSONB;
    END IF;

    -- Ajouter la colonne certificate_available
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'certificate_available'
    ) THEN
        ALTER TABLE formations ADD COLUMN certificate_available BOOLEAN DEFAULT true;
    END IF;

    -- Ajouter la colonne quiz_count (nombre de quiz réellement générés)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'quiz_count'
    ) THEN
        ALTER TABLE formations ADD COLUMN quiz_count INTEGER DEFAULT 0;
    END IF;

    -- Ajouter la colonne chapter_count (nombre de chapitres réels)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'chapter_count'
    ) THEN
        ALTER TABLE formations ADD COLUMN chapter_count INTEGER DEFAULT 1;
    END IF;

    -- Ajouter la colonne chapters (structure complète des chapitres)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'chapters'
    ) THEN
        ALTER TABLE formations ADD COLUMN chapters JSONB;
    END IF;

    -- Mettre à jour les formations existantes
    UPDATE formations SET 
        certificate_available = COALESCE(certificate_available, true),
        quiz_count = COALESCE(quiz_count, 0),
        chapter_count = COALESCE(chapter_count, 1)
    WHERE certificate_available IS NULL OR quiz_count IS NULL OR chapter_count IS NULL;
END $$; 