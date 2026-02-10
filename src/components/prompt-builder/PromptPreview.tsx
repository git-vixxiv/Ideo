"use client";

import { useState } from "react";
import { usePromptContext } from "@/lib/prompt-context";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { validatePrompt, calculateComplexity } from "@/lib/prompt-builder";

export function PromptPreview() {
  const { state, generatedPrompt, optimizedPrompt: contextOptimizedPrompt, setOptimizedPrompt: setContextOptimizedPrompt, apiKeys, hasApiKeys } = usePromptContext();
  const { user } = useAuth();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState<string | null>(null);
  const [promptVariations, setPromptVariations] = useState<string[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  const validation = validatePrompt(generatedPrompt);
  const complexity = calculateComplexity(state);

  const handleOptimize = async () => {
    if (!hasApiKeys.claude) {
      setError("Please add your Claude API key in settings first.");
      return;
    }

    setIsOptimizing(true);
    setError(null);
    setPromptVariations([]);
    setSelectedVariation(null);

    try {
      // Build headers - only include API key for local mode (server handles it for logged-in users)
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (!user && apiKeys.claude) {
        headers["x-api-key"] = apiKeys.claude;
      }

      // Strip out image data before sending to Claude (it only needs prompt-related state)
      const { sourceImage, maskImage, styleReferenceImage, characterReferenceImage, ...stateWithoutImages } = state;

      const response = await fetch("/api/claude", {
        method: "POST",
        headers,
        body: JSON.stringify({
          currentPrompt: generatedPrompt,
          state: stateWithoutImages,
          action: "optimize",
          requestVariations: true,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to optimize prompt";
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
      setOptimizedPrompt(data.optimizedPrompt);
      setExplanation(data.explanation);

      // Set variations if available
      if (data.variations && data.variations.length > 0) {
        setPromptVariations(data.variations);
      } else {
        // If no variations, use the main prompt as the only option
        setPromptVariations([data.optimizedPrompt]);
      }
      setSelectedVariation(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to optimize prompt");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRefine = async () => {
    if (!feedback.trim() || !hasApiKeys.claude) return;

    setIsRefining(true);
    setError(null);

    try {
      const currentPrompt = selectedVariation !== null && promptVariations[selectedVariation]
        ? promptVariations[selectedVariation]
        : optimizedPrompt || generatedPrompt;

      // Build headers - only include API key for local mode (server handles it for logged-in users)
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (!user && apiKeys.claude) {
        headers["x-api-key"] = apiKeys.claude;
      }

      // Strip out image data before sending to Claude
      const { sourceImage: _src, maskImage: _mask, styleReferenceImage: _style, characterReferenceImage: _char, ...stateWithoutImages } = state;

      const response = await fetch("/api/claude", {
        method: "POST",
        headers,
        body: JSON.stringify({
          currentPrompt,
          state: stateWithoutImages,
          action: "refine",
          feedback: feedback.trim(),
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to refine prompt";
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
      setOptimizedPrompt(data.optimizedPrompt);
      setExplanation(data.explanation);

      // Add the refined prompt as a new variation
      setPromptVariations(prev => [...prev, data.optimizedPrompt]);
      setSelectedVariation(promptVariations.length);
      setFeedback("");
      setShowFeedback(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refine prompt");
    } finally {
      setIsRefining(false);
    }
  };

  const handleUsePrompt = () => {
    const promptToUse = selectedVariation !== null && promptVariations[selectedVariation]
      ? promptVariations[selectedVariation]
      : optimizedPrompt || generatedPrompt;

    if (promptToUse && setContextOptimizedPrompt) {
      setContextOptimizedPrompt(promptToUse);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const displayPrompt = selectedVariation !== null && promptVariations[selectedVariation]
    ? promptVariations[selectedVariation]
    : (optimizedPrompt || generatedPrompt);

  const hasOptimizedPrompt = optimizedPrompt || promptVariations.length > 0;

  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Prompt Preview
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {hasOptimizedPrompt ? "Claude has optimized your prompt" : "Your generated prompt based on the selections above"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                complexity > 70
                  ? "bg-green-500"
                  : complexity > 40
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {complexity}% complete
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt Display */}
        <div className="relative">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 min-h-[100px]">
            <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
              {displayPrompt || "Start building your prompt by filling in the sections above..."}
            </p>
          </div>
          <button
            onClick={() => handleCopy(displayPrompt)}
            className="absolute top-2 right-2 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
            title="Copy to clipboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Prompt Variations */}
        {promptVariations.length > 1 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Choose a variation:
            </p>
            <div className="flex flex-wrap gap-2">
              {promptVariations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariation(index)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedVariation === index
                      ? "bg-[#998748] text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  Version {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Validation Warnings */}
        {validation.warnings.length > 0 && !hasOptimizedPrompt && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              {validation.warnings.map((warning, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!hasOptimizedPrompt ? (
            <Button
              onClick={handleOptimize}
              loading={isOptimizing}
              disabled={!generatedPrompt}
              className="flex-1"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Optimize with Claude
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setShowFeedback(!showFeedback)}
                variant="secondary"
                className="flex-1"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {showFeedback ? "Hide Feedback" : "Refine Prompt"}
              </Button>
              <Button
                onClick={handleOptimize}
                loading={isOptimizing}
                variant="secondary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
            </>
          )}
        </div>

        {/* Feedback Input */}
        {showFeedback && (
          <div className="space-y-3 p-4 bg-[#2589bd]/10 rounded-lg border border-[#2589bd]/30">
            <p className="text-sm font-medium text-[#2589bd]">
              How would you like to improve this prompt?
            </p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g., Make it more dramatic, add more detail about lighting, change the mood to be more mysterious..."
              rows={3}
            />
            <Button
              onClick={handleRefine}
              loading={isRefining}
              disabled={!feedback.trim()}
              size="sm"
            >
              Apply Feedback
            </Button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Claude Explanation */}
        {explanation && (
          <div className="p-3 bg-[#998748]/10 rounded-lg border border-[#998748]/30">
            <p className="text-xs font-medium text-[#998748] mb-1">Claude's Notes:</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{explanation}</p>
          </div>
        )}

        {/* Send to Ideogram CTA */}
        {hasOptimizedPrompt && (
          <div className="p-4 bg-gradient-to-r from-[#998748]/20 to-[#d1c69e]/20 rounded-lg border border-[#998748]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1A1A1A] dark:text-[#f4f4f4]">
                  Ready to generate!
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Use this optimized prompt with Ideogram
                </p>
              </div>
              <Button
                onClick={handleUsePrompt}
                className="bg-gradient-to-r from-[#998748] to-[#d1c69e] text-[#1A1A1A] hover:opacity-90"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Send to Ideogram
              </Button>
            </div>
          </div>
        )}

        {/* Negative Prompt */}
        {state.negativePrompt && (
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Negative Prompt:
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {state.negativePrompt}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
