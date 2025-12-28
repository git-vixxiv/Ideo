// Database types for iddy

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  claude_api_key: string | null;
  ideogram_api_key: string | null;
  default_style_type: string | null;
  default_aspect_ratio: string | null;
  default_rendering_speed: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedPrompt {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  negative_prompt: string | null;
  settings: Record<string, unknown>;
  rating: number | null; // 1-5 stars
  rating_notes: string | null;
  tags: string[];
  is_favorite: boolean;
  use_count: number;
  created_at: string;
  updated_at: string;
}

export interface PromptCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  prompt_count: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionPrompt {
  id: string;
  collection_id: string;
  prompt_id: string;
  order_index: number;
  created_at: string;
}

export interface SavedColorScheme {
  id: string;
  user_id: string;
  name: string;
  colors: string[]; // Array of hex colors
  description: string | null;
  is_favorite: boolean;
  use_count: number;
  created_at: string;
  updated_at: string;
}

export interface GenerationHistory {
  id: string;
  user_id: string;
  prompt_id: string | null;
  prompt_text: string;
  negative_prompt: string | null;
  settings: Record<string, unknown>;
  image_urls: string[];
  rating: number | null;
  rating_notes: string | null;
  created_at: string;
}

// Insert/Update types (omit auto-generated fields)
export type InsertProfile = Omit<Profile, "created_at" | "updated_at">;
export type InsertUserSettings = Omit<UserSettings, "id" | "created_at" | "updated_at">;
export type InsertSavedPrompt = Omit<SavedPrompt, "id" | "created_at" | "updated_at" | "use_count">;
export type InsertPromptCollection = Omit<PromptCollection, "id" | "created_at" | "updated_at" | "prompt_count">;
export type InsertCollectionPrompt = Omit<CollectionPrompt, "id" | "created_at">;
export type InsertSavedColorScheme = Omit<SavedColorScheme, "id" | "created_at" | "updated_at" | "use_count">;
export type InsertGenerationHistory = Omit<GenerationHistory, "id" | "created_at">;

export type UpdateSavedPrompt = Partial<Omit<SavedPrompt, "id" | "user_id" | "created_at">>;
export type UpdatePromptCollection = Partial<Omit<PromptCollection, "id" | "user_id" | "created_at">>;
export type UpdateSavedColorScheme = Partial<Omit<SavedColorScheme, "id" | "user_id" | "created_at">>;
