-- Table pour stocker la progression des utilisateurs dans les formations
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  formation_id uuid REFERENCES formations(id) ON DELETE CASCADE,
  chapter_id text NOT NULL,
  course_id text,
  quiz_id text,
  type text NOT NULL CHECK (type IN ('course', 'quiz')),
  completed boolean DEFAULT false,
  score integer DEFAULT NULL, -- Pour les quiz, score obtenu
  completed_at timestamp with time zone DEFAULT NOW(),
  created_at timestamp with time zone DEFAULT NOW(),
  
  UNIQUE(user_id, formation_id, chapter_id, course_id, quiz_id, type)
);

-- Policies pour la sécurité
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy pour que les utilisateurs ne voient que leur propre progression
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Policy pour que les utilisateurs puissent créer leur propre progression
CREATE POLICY "Users can create their own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy pour que les utilisateurs puissent mettre à jour leur propre progression
CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id); 