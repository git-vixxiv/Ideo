"use client";

import { usePromptContext } from "@/lib/prompt-context";
import { OptionGrid } from "@/components/ui/OptionGrid";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { AnimationStyleSelector } from "./AnimationStyleSelector";
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
                  ? "border-[#998748] bg-[#d1c69e]/20 dark:bg-[#998748]/20"
                  : "border-zinc-200 dark:border-[#3a3a3a] hover:border-[#998748]"
              }`}
            >
              <span
                className={`font-medium text-sm ${
                  state.styleType === option.value
                    ? "text-[#998748] dark:text-[#d1c69e]"
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
        disabled={!!state.animationStyle}
      />

      {/* Animation Style */}
      <AnimationStyleSelector />

      {state.animationStyle && (
        <div className="p-3 bg-[#2589bd]/10 rounded-lg border border-[#2589bd]/30">
          <p className="text-xs text-[#2589bd]">
            Animation style is active and will override the Art Style selection above.
          </p>
        </div>
      )}

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
      <div className="p-4 bg-[#998748]/10 dark:bg-[#998748]/20 rounded-lg border border-[#998748]/30 dark:border-[#998748]/40">
        <h4 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#f4f4f4] mb-2">
          Style Tips
        </h4>
        <ul className="text-sm text-[#6b6b6b] dark:text-[#d1c69e] space-y-1">
          <li>• Choose ONE primary art style for best results</li>
          <li>• Mixing styles (e.g., &ldquo;cinematic watercolor&rdquo;) often creates muddy outputs</li>
          <li>• Mood words like &ldquo;whimsical&rdquo; or &ldquo;dramatic&rdquo; strongly influence results</li>
          <li>• Lighting terms help set the overall feel of the image</li>
        </ul>
      </div>
    </div>
  );
}
