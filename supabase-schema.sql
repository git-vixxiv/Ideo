-- iddy Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== PROFILES ====================
-- Automatically created when a user signs up
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== USER SETTINGS ====================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claude_api_key TEXT,
  ideogram_api_key TEXT,
  default_style_type TEXT,
  default_aspect_ratio TEXT,
  default_rendering_speed TEXT DEFAULT 'BALANCED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- ==================== SAVED PROMPTS ====================
CREATE TABLE IF NOT EXISTS saved_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  settings JSONB DEFAULT '{}',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  rating_notes TEXT,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_prompts_user ON saved_prompts(user_id);
CREATE INDEX idx_saved_prompts_favorite ON saved_prompts(user_id, is_favorite);
CREATE INDEX idx_saved_prompts_rating ON saved_prompts(user_id, rating);

ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prompts" ON saved_prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts" ON saved_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON saved_prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON saved_prompts
  FOR DELETE USING (auth.uid() = user_id);

-- Function to increment use count
CREATE OR REPLACE FUNCTION increment_prompt_use_count(prompt_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE saved_prompts
  SET use_count = use_count + 1, updated_at = NOW()
  WHERE id = prompt_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== PROMPT COLLECTIONS ====================
CREATE TABLE IF NOT EXISTS prompt_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  prompt_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collections_user ON prompt_collections(user_id);

ALTER TABLE prompt_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own collections" ON prompt_collections
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert own collections" ON prompt_collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections" ON prompt_collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections" ON prompt_collections
  FOR DELETE USING (auth.uid() = user_id);

-- ==================== COLLECTION PROMPTS (Junction Table) ====================
CREATE TABLE IF NOT EXISTS collection_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES prompt_collections(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES saved_prompts(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, prompt_id)
);

CREATE INDEX idx_collection_prompts ON collection_prompts(collection_id);

ALTER TABLE collection_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collection prompts" ON collection_prompts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prompt_collections
      WHERE id = collection_id AND (user_id = auth.uid() OR is_public = TRUE)
    )
  );

CREATE POLICY "Users can manage own collection prompts" ON collection_prompts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM prompt_collections
      WHERE id = collection_id AND user_id = auth.uid()
    )
  );

-- Trigger to update collection prompt count
CREATE OR REPLACE FUNCTION update_collection_prompt_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE prompt_collections SET prompt_count = prompt_count + 1 WHERE id = NEW.collection_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE prompt_collections SET prompt_count = prompt_count - 1 WHERE id = OLD.collection_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_collection_prompt_change
  AFTER INSERT OR DELETE ON collection_prompts
  FOR EACH ROW EXECUTE FUNCTION update_collection_prompt_count();

-- ==================== SAVED COLOR SCHEMES ====================
CREATE TABLE IF NOT EXISTS saved_color_schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  colors TEXT[] NOT NULL,
  description TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_color_schemes_user ON saved_color_schemes(user_id);

ALTER TABLE saved_color_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own color schemes" ON saved_color_schemes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own color schemes" ON saved_color_schemes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own color schemes" ON saved_color_schemes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own color schemes" ON saved_color_schemes
  FOR DELETE USING (auth.uid() = user_id);

-- ==================== GENERATION HISTORY ====================
CREATE TABLE IF NOT EXISTS generation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES saved_prompts(id) ON DELETE SET NULL,
  prompt_text TEXT NOT NULL,
  negative_prompt TEXT,
  settings JSONB DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  rating_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_history_user ON generation_history(user_id);
CREATE INDEX idx_history_created ON generation_history(user_id, created_at DESC);

ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history" ON generation_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON generation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own history" ON generation_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own history" ON generation_history
  FOR DELETE USING (auth.uid() = user_id);

-- ==================== VIEWS ====================

-- View for user's prompt statistics
CREATE OR REPLACE VIEW user_prompt_stats AS
SELECT
  user_id,
  COUNT(*) as total_prompts,
  COUNT(*) FILTER (WHERE is_favorite) as favorite_count,
  AVG(rating) as avg_rating,
  SUM(use_count) as total_uses
FROM saved_prompts
GROUP BY user_id;

-- ==================== COMPLETE ====================
-- Your iddy database is now set up!
--
-- Next steps:
-- 1. Enable Google OAuth in Supabase Dashboard -> Authentication -> Providers
-- 2. Set your Site URL and Redirect URLs in Authentication -> URL Configuration
-- 3. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local
