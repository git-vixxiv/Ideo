"use client";

import { useState } from "react";
import { usePromptContext } from "@/lib/prompt-context";
import { ANIMATION_STYLES } from "@/lib/constants";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

type CategoryFilter = "all" | "western" | "anime" | "video_game" | "other";

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: "All Styles",
  western: "Western Animation",
  anime: "Anime & Manga",
  video_game: "Video Games",
  other: "Other Styles",
};

export function AnimationStyleSelector() {
  const { state, updateState } = usePromptContext();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStyles = ANIMATION_STYLES.filter((style) => {
    const matchesCategory = categoryFilter === "all" || style.category === categoryFilter;
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedStyle = ANIMATION_STYLES.find((s) => s.id === state.animationStyle);

  return (
    <Card variant="default">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Animation Style
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Choose a cartoon or anime style for your image
            </p>
          </div>
          {selectedStyle && (
            <button
              onClick={() => updateState("animationStyle", "")}
              className="text-xs text-red-500 hover:text-red-600 dark:text-red-400"
            >
              Clear
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search styles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-9 bg-white dark:bg-[#242424] border border-zinc-200 dark:border-[#3a3a3a] rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#998748]"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                categoryFilter === category
                  ? "bg-[#998748] text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        {/* Selected Style Display */}
        {selectedStyle && (
          <div className="p-3 bg-[#998748]/10 border border-[#998748]/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#998748] dark:text-[#d1c69e]">
                {selectedStyle.name}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                {selectedStyle.category.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
              {selectedStyle.promptText}
            </p>
          </div>
        )}

        {/* Style Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => updateState("animationStyle", style.id)}
              className={`p-2 rounded-lg text-center transition-all ${
                state.animationStyle === style.id
                  ? "bg-[#998748] text-white ring-2 ring-[#998748] ring-offset-2 dark:ring-offset-[#1A1A1A]"
                  : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
              }`}
              title={style.promptText}
            >
              <span className="text-xs font-medium line-clamp-2">{style.name}</span>
            </button>
          ))}
        </div>

        {filteredStyles.length === 0 && (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-4">
            No styles found matching "{searchTerm}"
          </p>
        )}

        {/* Info */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Selecting an animation style will add specific prompt keywords to generate images in that style.
        </p>
      </CardContent>
    </Card>
  );
}
