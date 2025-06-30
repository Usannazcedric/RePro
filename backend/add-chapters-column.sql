-- Script pour ajouter la colonne chapters à la table formations
DO $$ 
BEGIN
    -- Ajouter la colonne chapters (structure complète des chapitres)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'chapters'
    ) THEN
        ALTER TABLE formations ADD COLUMN chapters JSONB;
        RAISE NOTICE 'Colonne chapters ajoutée avec succès';
    ELSE
        RAISE NOTICE 'Colonne chapters existe déjà';
    END IF;

    -- Ajouter les autres colonnes nécessaires si elles manquent
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'cover_image_url'
    ) THEN
        ALTER TABLE formations ADD COLUMN cover_image_url TEXT;
        RAISE NOTICE 'Colonne cover_image_url ajoutée';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'pdf_url'
    ) THEN
        ALTER TABLE formations ADD COLUMN pdf_url TEXT;
        RAISE NOTICE 'Colonne pdf_url ajoutée';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'configured_quiz_count'
    ) THEN
        ALTER TABLE formations ADD COLUMN configured_quiz_count INTEGER DEFAULT 5;
        RAISE NOTICE 'Colonne configured_quiz_count ajoutée';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'configured_chapter_count'
    ) THEN
        ALTER TABLE formations ADD COLUMN configured_chapter_count INTEGER DEFAULT 3;
        RAISE NOTICE 'Colonne configured_chapter_count ajoutée';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'quiz_count'
    ) THEN
        ALTER TABLE formations ADD COLUMN quiz_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Colonne quiz_count ajoutée';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'formations' 
        AND column_name = 'chapter_count'
    ) THEN
        ALTER TABLE formations ADD COLUMN chapter_count INTEGER DEFAULT 1;
        RAISE NOTICE 'Colonne chapter_count ajoutée';
    END IF;

END $$; 