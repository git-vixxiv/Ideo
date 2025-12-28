"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  getCollections,
  createCollection,
  deleteCollection,
  getCollectionPrompts,
} from "@/lib/database";
import type { PromptCollection, SavedPrompt } from "@/types/database";

interface CollectionsPanelProps {
  onClose: () => void;
}

export function CollectionsPanel({ onClose }: CollectionsPanelProps) {
  const { user, isConfigured } = useAuth();
  const [collections, setCollections] = useState<PromptCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<PromptCollection | null>(null);
  const [collectionPrompts, setCollectionPrompts] = useState<SavedPrompt[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isConfigured) {
      loadCollections();
    } else {
      setIsLoading(false);
    }
  }, [user, isConfigured]);

  const loadCollections = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getCollections(user.id);
      setCollections(data);
    } catch (err) {
      setError("Failed to load collections");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user || !newName.trim()) return;

    try {
      const collection = await createCollection({
        user_id: user.id,
        name: newName.trim(),
        description: newDescription.trim() || null,
        cover_image_url: null,
        is_public: false,
      });

      setCollections((prev) => [collection, ...prev]);
      setNewName("");
      setNewDescription("");
      setShowCreate(false);
    } catch (err) {
      setError("Failed to create collection");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection? Prompts will not be deleted.")) return;

    try {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
      if (selectedCollection?.id === id) {
        setSelectedCollection(null);
      }
    } catch (err) {
      setError("Failed to delete collection");
      console.error(err);
    }
  };

  const handleSelectCollection = async (collection: PromptCollection) => {
    setSelectedCollection(collection);
    try {
      const prompts = await getCollectionPrompts(collection.id);
      setCollectionPrompts(prompts);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-4xl max-h-[80vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#e0e0e0] dark:border-[#3a3a3a] flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] dark:text-[#f4f4f4]">
              {selectedCollection ? selectedCollection.name : "Collections"}
            </h2>
            {selectedCollection && (
              <button
                onClick={() => setSelectedCollection(null)}
                className="text-sm text-[#2589bd] hover:underline mt-1"
              >
                ← Back to all collections
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!selectedCollection && user && isConfigured && (
              <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
                + New Collection
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#6b6b6b] hover:text-[#1A1A1A] dark:text-[#9a9a9a] dark:hover:text-[#f4f4f4] hover:bg-[#f4f4f4] dark:hover:bg-[#242424] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!user || !isConfigured ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-[#d1c69e] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-[#1A1A1A] dark:text-[#f4f4f4] font-medium mb-2">
                Sign in to save collections
              </p>
              <p className="text-sm text-[#6b6b6b] dark:text-[#9a9a9a]">
                Collections let you organize your prompts into groups
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-[#998748] border-t-transparent rounded-full" />
            </div>
          ) : selectedCollection ? (
            // Collection Prompts View
            <div>
              {selectedCollection.description && (
                <p className="text-[#6b6b6b] dark:text-[#9a9a9a] mb-4">
                  {selectedCollection.description}
                </p>
              )}

              {collectionPrompts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#6b6b6b] dark:text-[#9a9a9a]">
                    No prompts in this collection yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {collectionPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="p-4 bg-[#f4f4f4] dark:bg-[#242424] rounded-lg border border-[#e0e0e0] dark:border-[#3a3a3a]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#1A1A1A] dark:text-[#f4f4f4]">
                            {prompt.name}
                          </h4>
                          <p className="text-sm text-[#6b6b6b] dark:text-[#9a9a9a] line-clamp-2 mt-1">
                            {prompt.prompt}
                          </p>
                          {prompt.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= prompt.rating!
                                      ? "text-[#998748]"
                                      : "text-[#e0e0e0] dark:text-[#3a3a3a]"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Collections List View
            <div>
              {showCreate && (
                <div className="mb-6 p-4 bg-[#f4f4f4] dark:bg-[#242424] rounded-lg border border-[#998748]">
                  <h3 className="font-medium text-[#1A1A1A] dark:text-[#f4f4f4] mb-3">
                    Create New Collection
                  </h3>
                  <div className="space-y-3">
                    <Input
                      placeholder="Collection name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleCreate}>
                        Create
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {collections.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-[#e0e0e0] dark:text-[#3a3a3a] mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p className="text-[#6b6b6b] dark:text-[#9a9a9a]">
                    No collections yet. Create one to organize your prompts!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      onClick={() => handleSelectCollection(collection)}
                      className="p-4 bg-[#f4f4f4] dark:bg-[#242424] rounded-lg border border-[#e0e0e0] dark:border-[#3a3a3a] hover:border-[#998748] cursor-pointer transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-[#1A1A1A] dark:text-[#f4f4f4] group-hover:text-[#998748]">
                            {collection.name}
                          </h3>
                          {collection.description && (
                            <p className="text-sm text-[#6b6b6b] dark:text-[#9a9a9a] mt-1 line-clamp-2">
                              {collection.description}
                            </p>
                          )}
                          <p className="text-xs text-[#9a9a9a] mt-2">
                            {collection.prompt_count} prompt{collection.prompt_count !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(collection.id);
                          }}
                          className="p-1 text-[#9a9a9a] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
