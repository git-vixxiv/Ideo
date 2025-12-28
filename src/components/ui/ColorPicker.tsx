"use client";

import { useState } from "react";
import { COLOR_PALETTE_PRESETS } from "@/lib/constants";
import type { ColorPalettePreset } from "@/types/ideogram";

interface ColorPickerProps {
  label?: string;
  value: ColorPalettePreset | "CUSTOM" | null;
  customColors: string[];
  onChange: (preset: ColorPalettePreset | "CUSTOM" | null) => void;
  onCustomColorsChange: (colors: string[]) => void;
  className?: string;
}

export function ColorPicker({
  label,
  value,
  customColors,
  onChange,
  onCustomColorsChange,
  className = "",
}: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(value === "CUSTOM");

  const handlePresetClick = (preset: ColorPalettePreset) => {
    if (value === preset) {
      onChange(null);
    } else {
      onChange(preset);
      setShowCustom(false);
    }
  };

  const handleCustomClick = () => {
    if (showCustom) {
      setShowCustom(false);
      onChange(null);
    } else {
      setShowCustom(true);
      onChange("CUSTOM");
    }
  };

  const handleAddColor = () => {
    if (customColors.length < 6) {
      onCustomColorsChange([...customColors, "#000000"]);
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...customColors];
    newColors[index] = color;
    onCustomColorsChange(newColors);
  };

  const handleRemoveColor = (index: number) => {
    const newColors = customColors.filter((_, i) => i !== index);
    onCustomColorsChange(newColors);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {label}
        </label>
      )}

      <div className="grid grid-cols-4 gap-2 mb-3">
        {COLOR_PALETTE_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            className={`p-2 rounded-lg border-2 transition-all duration-200 ${
              value === preset.value
                ? "border-[#998748] ring-2 ring-[#d1c69e] dark:ring-[#998748]/50"
                : "border-zinc-200 dark:border-[#3a3a3a] hover:border-[#998748]"
            }`}
          >
            <div className="flex gap-0.5 mb-1">
              {preset.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 h-4 first:rounded-l last:rounded-r"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {preset.label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={handleCustomClick}
        className={`w-full p-3 rounded-lg border-2 border-dashed transition-all duration-200 ${
          showCustom
            ? "border-[#998748] bg-[#d1c69e]/20 dark:bg-[#998748]/20"
            : "border-zinc-300 dark:border-[#3a3a3a] hover:border-[#998748]"
        }`}
      >
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {showCustom ? "Using Custom Colors" : "+ Custom Color Palette"}
        </span>
      </button>

      {showCustom && (
        <div className="mt-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="flex flex-wrap gap-2 mb-3">
            {customColors.map((color, index) => (
              <div key={index} className="relative group">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-zinc-200 dark:border-zinc-700"
                />
                <button
                  onClick={() => handleRemoveColor(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            {customColors.length < 6 && (
              <button
                onClick={handleAddColor}
                className="w-12 h-12 rounded-lg border-2 border-dashed border-zinc-300 dark:border-[#3a3a3a] flex items-center justify-center text-zinc-400 hover:border-[#998748] hover:text-[#998748] transition-colors"
              >
                +
              </button>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Add up to 6 colors for your custom palette
          </p>
        </div>
      )}
    </div>
  );
}
