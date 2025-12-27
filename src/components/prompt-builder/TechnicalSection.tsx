"use client";

import { usePromptContext } from "@/lib/prompt-context";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ASPECT_RATIO_OPTIONS, RENDERING_SPEED_OPTIONS } from "@/lib/constants";

export function TechnicalSection() {
  const { state, updateState } = usePromptContext();

  return (
    <div className="space-y-6">
      {/* Aspect Ratio */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {ASPECT_RATIO_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateState("aspectRatio", option.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                state.aspectRatio === option.value
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-violet-300"
              }`}
            >
              <span
                className={`font-medium text-sm block ${
                  state.aspectRatio === option.value
                    ? "text-violet-700 dark:text-violet-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {option.label}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {option.dimensions}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Rendering Speed */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Rendering Speed
        </label>
        <div className="grid grid-cols-3 gap-2">
          {RENDERING_SPEED_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateState("renderingSpeed", option.value)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                state.renderingSpeed === option.value
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-violet-300"
              }`}
            >
              <span
                className={`font-semibold text-sm block ${
                  state.renderingSpeed === option.value
                    ? "text-violet-700 dark:text-violet-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {option.label}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-1">
                {option.description}
              </span>
              <span className="text-xs font-medium text-violet-600 dark:text-violet-400 mt-1 block">
                {option.price}/image
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Number of Images */}
      <Slider
        label="Number of Images"
        value={state.numImages}
        min={1}
        max={8}
        step={1}
        onChange={(value) => updateState("numImages", value)}
      />

      {/* Magic Prompt */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Magic Prompt
        </label>
        <div className="flex gap-2">
          {(["AUTO", "ON", "OFF"] as const).map((option) => (
            <button
              key={option}
              onClick={() => updateState("magicPrompt", option)}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all duration-200 ${
                state.magicPrompt === option
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-violet-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Magic Prompt expands your prompt with additional details for better results
        </p>
      </div>

      {/* Seed */}
      <Input
        label="Seed (optional)"
        type="number"
        placeholder="Leave empty for random"
        value={state.seed ?? ""}
        onChange={(e) =>
          updateState("seed", e.target.value ? parseInt(e.target.value) : null)
        }
        hint="Use a specific seed for reproducible results"
      />

      {/* Negative Prompt */}
      <Textarea
        label="Negative Prompt"
        placeholder="blurry, low quality, distorted, ugly..."
        value={state.negativePrompt}
        onChange={(e) => updateState("negativePrompt", e.target.value)}
        rows={2}
        hint="Describe what you DON'T want in the image"
      />

      {/* Additional Details */}
      <Textarea
        label="Additional Details"
        placeholder="Any extra details or modifiers..."
        value={state.additionalDetails}
        onChange={(e) => updateState("additionalDetails", e.target.value)}
        rows={2}
        hint="Add any extra keywords or details to append to the prompt"
      />
    </div>
  );
}
