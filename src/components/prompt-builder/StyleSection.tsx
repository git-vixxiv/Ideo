"use client";

import { usePromptContext } from "@/lib/prompt-context";
import { OptionGrid } from "@/components/ui/OptionGrid";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { ART_STYLES, MOODS, LIGHTING_OPTIONS, STYLE_TYPE_OPTIONS } from "@/lib/constants";
import type { StyleType, ColorPalettePreset } from "@/types/ideogram";

export function StyleSection() {
  const { state, updateState } = usePromptContext();

  return (
    <div className="space-y-6">
      {/* Ideogram Style Type */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Ideogram Style Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STYLE_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateState("styleType", option.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                state.styleType === option.value
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-violet-300"
              }`}
            >
              <span
                className={`font-medium text-sm ${
                  state.styleType === option.value
                    ? "text-violet-700 dark:text-violet-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {option.label}
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Art Style */}
      <OptionGrid
        label="Art Style"
        options={ART_STYLES.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
        }))}
        value={state.artStyle}
        onChange={(value) => updateState("artStyle", value)}
        columns={4}
        size="sm"
      />

      {/* Mood */}
      <OptionGrid
        label="Mood & Atmosphere"
        options={MOODS.map((m) => ({
          id: m.id,
          name: m.name,
          description: m.description,
        }))}
        value={state.mood}
        onChange={(value) => updateState("mood", value)}
        columns={4}
        size="sm"
      />

      {/* Lighting */}
      <OptionGrid
        label="Lighting"
        options={LIGHTING_OPTIONS.map((l) => ({
          id: l.id,
          name: l.name,
        }))}
        value={state.lighting}
        onChange={(value) => updateState("lighting", value)}
        columns={4}
        size="sm"
      />

      {/* Color Palette */}
      <ColorPicker
        label="Color Palette"
        value={state.colorPalette}
        customColors={state.customColors}
        onChange={(value) => updateState("colorPalette", value)}
        onCustomColorsChange={(colors) => updateState("customColors", colors)}
      />

      {/* Tips */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
          Style Tips
        </h4>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
          <li>• Choose ONE primary art style for best results</li>
          <li>• Mixing styles (e.g., &ldquo;cinematic watercolor&rdquo;) often creates muddy outputs</li>
          <li>• Mood words like &ldquo;whimsical&rdquo; or &ldquo;dramatic&rdquo; strongly influence results</li>
          <li>• Lighting terms help set the overall feel of the image</li>
        </ul>
      </div>
    </div>
  );
}
