"use client";

import { createClient } from "./supabase";
import type {
  SavedPrompt,
  PromptCollection,
  SavedColorScheme,
  GenerationHistory,
  InsertSavedPrompt,
  InsertPromptCollection,
  InsertSavedColorScheme,
  InsertGenerationHistory,
  UpdateSavedPrompt,
  UpdatePromptCollection,
  UpdateSavedColorScheme,
} from "@/types/database";

// ==================== PROMPTS ====================

export async function getSavedPrompts(userId: string): Promise<SavedPrompt[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_prompts")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSavedPromptById(id: string): Promise<SavedPrompt | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_prompts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createSavedPrompt(prompt: InsertSavedPrompt): Promise<SavedPrompt> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_prompts")
    .insert(prompt)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSavedPrompt(id: string, updates: UpdateSavedPrompt): Promise<SavedPrompt> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_prompts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSavedPrompt(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved_prompts")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function incrementPromptUseCount(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("increment_prompt_use_count", { prompt_id: id });
  if (error) throw error;
}

export async function ratePrompt(id: string, rating: number, notes?: string): Promise<SavedPrompt> {
  return updateSavedPrompt(id, { rating, rating_notes: notes || null });
}

// ==================== COLLECTIONS ====================

export async function getCollections(userId: string): Promise<PromptCollection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_collections")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCollectionById(id: string): Promise<PromptCollection | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getCollectionPrompts(collectionId: string): Promise<SavedPrompt[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("collection_prompts")
    .select(`
      prompt_id,
      order_index,
      saved_prompts (*)
    `)
    .eq("collection_id", collectionId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((item: any) => item.saved_prompts as SavedPrompt);
}

export async function createCollection(collection: InsertPromptCollection): Promise<PromptCollection> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_collections")
    .insert(collection)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCollection(id: string, updates: UpdatePromptCollection): Promise<PromptCollection> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_collections")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCollection(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("prompt_collections")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function addPromptToCollection(collectionId: string, promptId: string): Promise<void> {
  const supabase = createClient();

  // Get current max order index
  const { data: existing } = await supabase
    .from("collection_prompts")
    .select("order_index")
    .eq("collection_id", collectionId)
    .order("order_index", { ascending: false })
    .limit(1);

  const nextIndex = existing && existing.length > 0 ? existing[0].order_index + 1 : 0;

  const { error } = await supabase
    .from("collection_prompts")
    .insert({
      collection_id: collectionId,
      prompt_id: promptId,
      order_index: nextIndex,
    });

  if (error) throw error;
}

export async function removePromptFromCollection(collectionId: string, promptId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("collection_prompts")
    .delete()
    .eq("collection_id", collectionId)
    .eq("prompt_id", promptId);

  if (error) throw error;
}

// ==================== COLOR SCHEMES ====================

export async function getColorSchemes(userId: string): Promise<SavedColorScheme[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_color_schemes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createColorScheme(scheme: InsertSavedColorScheme): Promise<SavedColorScheme> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_color_schemes")
    .insert(scheme)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateColorScheme(id: string, updates: UpdateSavedColorScheme): Promise<SavedColorScheme> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_color_schemes")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteColorScheme(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved_color_schemes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ==================== GENERATION HISTORY ====================

export async function getGenerationHistory(userId: string, limit = 50): Promise<GenerationHistory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("generation_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function addToHistory(history: InsertGenerationHistory): Promise<GenerationHistory> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("generation_history")
    .insert(history)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function rateGeneration(id: string, rating: number, notes?: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("generation_history")
    .update({ rating, rating_notes: notes || null })
    .eq("id", id);

  if (error) throw error;
}

// ==================== FAVORITES ====================

export async function getFavoritePrompts(userId: string): Promise<SavedPrompt[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_prompts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_favorite", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function togglePromptFavorite(id: string, isFavorite: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved_prompts")
    .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}
