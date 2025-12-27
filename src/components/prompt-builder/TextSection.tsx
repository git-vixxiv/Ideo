"use client";

import { usePromptContext } from "@/lib/prompt-context";
import { Input } from "@/components/ui/Input";
import { OptionGrid } from "@/components/ui/OptionGrid";
import { TEXT_PLACEMENTS, TEXT_STYLES } from "@/lib/constants";

export function TextSection() {
  const { state, updateState } = usePromptContext();

  return (
    <div className="space-y-6">
      {/* Text Content */}
      <div>
        <Input
          label='Text to Include in Image'
          placeholder="HELLO WORLD"
          value={state.textContent}
          onChange={(e) => updateState("textContent", e.target.value)}
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          The text will automatically be wrapped in quotes in the final prompt
        </p>
      </div>

      {state.textContent && (
        <>
          {/* Text Placement */}
          <OptionGrid
            label="Text Placement"
            options={TEXT_PLACEMENTS.map((p) => ({
              id: p.id,
              name: p.name,
            }))}
            value={state.textPlacement}
            onChange={(value) => updateState("textPlacement", value)}
            columns={4}
            size="sm"
          />

          {/* Text Style */}
          <OptionGrid
            label="Text Style"
            options={TEXT_STYLES.map((s) => ({
              id: s.id,
              name: s.name,
            }))}
            value={state.textStyle}
            onChange={(value) => updateState("textStyle", value)}
            columns={4}
            size="sm"
          />
        </>
      )}

      {/* Tips */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Text Rendering Tips
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Keep text SHORT - longer text has higher error rates</li>
          <li>• Always specify text placement for better results</li>
          <li>• Use ALL CAPS or Title Case for clearer rendering</li>
          <li>• Add &ldquo;generous margins&rdquo; or &ldquo;wide tracking&rdquo; if text is cramped</li>
          <li>• If text is misspelled, regenerate before changing layout</li>
          <li>• Simple words work better than complex phrases</li>
        </ul>
      </div>

      {/* Preview */}
      {state.textContent && (
        <div className="p-6 bg-zinc-900 dark:bg-zinc-950 rounded-xl text-center">
          <p className="text-zinc-400 text-xs mb-2">Text Preview</p>
          <p className="text-white text-2xl font-bold">
            &ldquo;{state.textContent}&rdquo;
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            {state.textPlacement
              ? `${TEXT_PLACEMENTS.find((p) => p.id === state.textPlacement)?.name} placement`
              : "No placement specified"}
            {state.textStyle &&
              ` • ${TEXT_STYLES.find((s) => s.id === state.textStyle)?.name}`}
          </p>
        </div>
      )}
    </div>
  );
}
