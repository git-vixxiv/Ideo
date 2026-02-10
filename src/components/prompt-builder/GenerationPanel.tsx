"use client";

import { useState } from "react";
import { usePromptContext } from "@/lib/prompt-context";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface GeneratedImage {
  url: string;
  seed: number;
}

export function GenerationPanel() {
  const { state, generatedPrompt, optimizedPrompt, apiKeys, hasApiKeys, addToHistory } = usePromptContext();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [describeResult, setDescribeResult] = useState<string | null>(null);

  // Get the effective prompt - prefer optimized, then generated, then subject
  const effectivePrompt = optimizedPrompt?.trim() || generatedPrompt?.trim() || state.subject?.trim() || "";

  const handleGenerate = async () => {
    if (!hasApiKeys.ideogram) {
      setError("Please add your Ideogram API key in settings first.");
      return;
    }

    // For generate mode, require a prompt
    if (state.mode === "generate") {
      if (!effectivePrompt) {
        setError("Please describe your subject in the Subject tab before generating.");
        return;
      }
    }

    // For other modes, require a source image
    if (state.mode !== "generate" && !state.sourceImage) {
      setError("Please upload an image first in the Reference tab.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setDescribeResult(null);

    try {
      let endpoint = "/api/ideogram/generate";
      let body: Record<string, unknown> = {};

      // Always build the common parameters
      const commonParams = {
        prompt: effectivePrompt,
        negative_prompt: state.negativePrompt || undefined,
        aspect_ratio: state.aspectRatio,
        style_type: state.styleType,
        magic_prompt_option: state.magicPrompt,
        seed: state.seed || undefined,
        num_images: state.numImages,
        color_palette: state.colorPalette
          ? state.colorPalette === "CUSTOM"
            ? { members: state.customColors.map((c) => ({ color: c })) }
            : { name: state.colorPalette }
          : undefined,
      };

      switch (state.mode) {
        case "generate":
          body = commonParams;
          break;

        case "remix":
          if (!state.sourceImage) {
            throw new Error("Please upload an image to remix.");
          }
          endpoint = "/api/ideogram/remix";
          body = {
            ...commonParams,
            image_file: state.sourceImage,
            image_weight: state.imageWeight,
          };
          break;

        case "edit":
          if (!state.sourceImage || !state.maskImage) {
            throw new Error("Please upload both an image and a mask to edit.");
          }
          endpoint = "/api/ideogram/edit";
          body = {
            ...commonParams,
            image_file: state.sourceImage,
            mask: state.maskImage,
          };
          break;

        case "upscale":
          if (!state.sourceImage) {
            throw new Error("Please upload an image to upscale.");
          }
          endpoint = "/api/ideogram/upscale";
          body = {
            image_file: state.sourceImage,
            prompt: effectivePrompt || undefined,
          };
          break;

        case "describe":
          if (!state.sourceImage) {
            throw new Error("Please upload an image to describe.");
          }
          endpoint = "/api/ideogram/describe";
          body = {
            image_file: state.sourceImage,
          };
          break;

        default:
          body = commonParams;
      }

      console.log("Sending request:", { endpoint, body: { ...body, image_file: body.image_file ? "[BASE64]" : undefined } });

      // Build headers - only include API key for local mode (server handles it for logged-in users)
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (!user && apiKeys.ideogram) {
        headers["x-ideogram-key"] = apiKeys.ideogram;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate image";
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text || `Request failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.data && Array.isArray(data.data)) {
        const images = data.data
          .map((img: Record<string, unknown>) => ({
            // Handle different possible URL property names
            url: (img.url || img.image_url || img.image || "") as string,
            seed: (img.seed || 0) as number,
          }))
          .filter((img: { url: string; seed: number }) => img.url && img.url.length > 0);

        console.log("Parsed images:", images);

        if (images.length === 0) {
          console.error("No valid image URLs in response:", data);
          setError("Images were generated but URLs are missing. Check console for details.");
          return;
        }

        setGeneratedImages(images);

        // Add to history
        addToHistory({
          state,
          generatedPrompt: effectivePrompt,
          generatedImages: images.map((img: GeneratedImage) => img.url),
          isFavorite: false,
        });
      } else if (data.descriptions) {
        // Handle describe response
        const description = data.descriptions[0]?.text || "No description generated";
        setDescribeResult(description);
      } else if (data.url) {
        // Handle single image response (e.g., upscale)
        setGeneratedImages([{ url: data.url, seed: data.seed || 0 }]);
      } else {
        console.error("Unexpected response format:", data);
        setError("Unexpected response format. Check console for details.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `ideogram-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  return (
    <div className="space-y-4 sticky top-24">
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Generate
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {state.mode === "generate" && "Create images from your prompt"}
            {state.mode === "remix" && "Transform an existing image"}
            {state.mode === "edit" && "Edit specific areas of an image"}
            {state.mode === "upscale" && "Enhance image resolution"}
            {state.mode === "describe" && "Get a prompt from an image"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Prompt Preview */}
          {state.mode === "generate" && (
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Current Prompt:</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
                {effectivePrompt || "No prompt yet - describe your subject to get started"}
              </p>
            </div>
          )}

          {/* Generation Info */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Mode</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium capitalize">
                {state.mode}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Images</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                {state.numImages}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Quality</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                {state.renderingSpeed}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Est. Cost</span>
              <span className="text-[#998748] dark:text-[#d1c69e] font-medium">
                $
                {(
                  state.numImages *
                  (state.renderingSpeed === "TURBO"
                    ? 0.03
                    : state.renderingSpeed === "BALANCED"
                    ? 0.06
                    : 0.09)
                ).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={
              (state.mode === "generate" && !effectivePrompt) ||
              (state.mode === "remix" && !state.sourceImage) ||
              (state.mode === "edit" && (!state.sourceImage || !state.maskImage)) ||
              (state.mode === "upscale" && !state.sourceImage) ||
              (state.mode === "describe" && !state.sourceImage)
            }
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              state.mode === "describe" ? "Analyzing..." :
              state.mode === "upscale" ? "Upscaling..." :
              state.mode === "remix" ? "Remixing..." :
              state.mode === "edit" ? "Editing..." :
              "Generating..."
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {state.mode === "describe" ? "Describe Image" :
                 state.mode === "upscale" ? "Upscale Image" :
                 state.mode === "remix" ? "Remix Image" :
                 state.mode === "edit" ? "Edit Image" :
                 "Generate with Ideogram"}
              </>
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Describe Result */}
          {describeResult && (
            <div className="p-3 bg-[#998748]/10 dark:bg-[#998748]/20 rounded-lg border border-[#998748]/30 dark:border-[#998748]/40">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-[#998748] dark:text-[#d1c69e]">Generated Description:</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(describeResult);
                  }}
                  className="text-xs text-[#2589bd] hover:underline"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{describeResult}</p>
            </div>
          )}

          {!hasApiKeys.ideogram && (
            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
              Add your Ideogram API key in settings to generate images
            </p>
          )}
        </CardContent>
      </Card>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Generated Images
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {generatedImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(img.url)}
                >
                  <img
                    src={img.url}
                    alt={`Generated ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(img.url);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-zinc-100 transition-colors"
                      title="Download"
                    >
                      <svg
                        className="w-4 h-4 text-zinc-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="absolute bottom-1 right-1 text-xs text-white/80 bg-black/50 px-1.5 py-0.5 rounded">
                    Seed: {img.seed}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Generated"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <button
              onClick={() => handleDownload(selectedImage)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-white hover:bg-zinc-100 rounded-lg text-zinc-900 font-medium flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
