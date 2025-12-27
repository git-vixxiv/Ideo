"use client";

import { usePromptContext } from "@/lib/prompt-context";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Slider } from "@/components/ui/Slider";

export function ReferenceSection() {
  const { state, updateState } = usePromptContext();

  return (
    <div className="space-y-6">
      {/* Mode-specific content */}
      {(state.mode === "remix" || state.mode === "edit") && (
        <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800 mb-4">
          <p className="text-sm text-violet-700 dark:text-violet-300">
            {state.mode === "remix"
              ? "Upload an image to remix. The prompt will guide how the image is transformed."
              : "Upload an image and a mask to edit specific areas."}
          </p>
        </div>
      )}

      {/* Source Image (for Remix/Edit modes) */}
      {(state.mode === "remix" || state.mode === "edit" || state.mode === "upscale" || state.mode === "describe") && (
        <ImageUpload
          label={
            state.mode === "remix"
              ? "Image to Remix"
              : state.mode === "edit"
              ? "Image to Edit"
              : state.mode === "upscale"
              ? "Image to Upscale"
              : "Image to Describe"
          }
          description={
            state.mode === "remix"
              ? "Upload the image you want to remix/transform"
              : state.mode === "edit"
              ? "Upload the image you want to edit"
              : state.mode === "upscale"
              ? "Upload the image you want to upscale"
              : "Upload an image to get a prompt description"
          }
          value={state.sourceImage}
          onChange={(value) => updateState("sourceImage", value)}
        />
      )}

      {/* Mask Image (for Edit mode) */}
      {state.mode === "edit" && state.sourceImage && (
        <ImageUpload
          label="Mask Image"
          description="Upload a black and white mask. Black areas will be edited."
          value={state.maskImage}
          onChange={(value) => updateState("maskImage", value)}
        />
      )}

      {/* Image Weight (for Remix mode) */}
      {state.mode === "remix" && state.sourceImage && (
        <Slider
          label="Image Strength"
          value={state.imageWeight}
          min={0}
          max={100}
          step={5}
          onChange={(value) => updateState("imageWeight", value)}
          valueSuffix="%"
        />
      )}

      {/* Style Reference (for Generate mode) */}
      {state.mode === "generate" && (
        <>
          <ImageUpload
            label="Style Reference Image (optional)"
            description="Upload an image to use as a style reference. The AI will try to match this visual style."
            value={state.styleReferenceImage}
            onChange={(value) => updateState("styleReferenceImage", value)}
          />

          <ImageUpload
            label="Character Reference Image (optional)"
            description="Upload a character reference to maintain consistent facial features and traits."
            value={state.characterReferenceImage}
            onChange={(value) => updateState("characterReferenceImage", value)}
          />
        </>
      )}

      {/* Tips */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
          Reference Image Tips
        </h4>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <li>• Use JPEG, PNG, or WebP format (max 10MB)</li>
          <li>• Style references work best with clear, distinctive styles</li>
          <li>• Character references help maintain face consistency across images</li>
          <li>• For remix, lower image strength = more creative freedom</li>
          <li>• For edit masks, use pure black for areas to regenerate</li>
        </ul>
      </div>
    </div>
  );
}
