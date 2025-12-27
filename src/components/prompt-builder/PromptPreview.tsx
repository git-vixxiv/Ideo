"use client";

import { useState } from "react";
import { usePromptContext } from "@/lib/prompt-context";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { validatePrompt, calculateComplexity } from "@/lib/prompt-builder";

export function PromptPreview() {
  const { state, generatedPrompt, apiKeys } = usePromptContext();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const validation = validatePrompt(generatedPrompt);
  const complexity = calculateComplexity(state);

  const handleOptimize = async () => {
    if (!apiKeys.claude) {
      setError("Please add your Claude API key in settings first.");
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKeys.claude,
        },
        body: JSON.stringify({
          currentPrompt: generatedPrompt,
          state,
          action: "optimize",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to optimize prompt");
      }

      const data = await response.json();
      setOptimizedPrompt(data.optimizedPrompt);
      setExplanation(data.explanation);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to optimize prompt");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const displayPrompt = isEditing ? customPrompt : (optimizedPrompt || generatedPrompt);

  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Prompt Preview
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your generated prompt based on the selections above
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
          {isEditing ? (
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
              placeholder="Edit your prompt..."
            />
          ) : (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 min-h-[100px]">
              <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                {displayPrompt || "Start building your prompt by filling in the sections above..."}
              </p>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => {
                if (isEditing) {
                  setCustomPrompt("");
                  setIsEditing(false);
                } else {
                  setCustomPrompt(displayPrompt);
                  setIsEditing(true);
                }
              }}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
              title={isEditing ? "Cancel edit" : "Edit prompt"}
            >
              {isEditing ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => handleCopy(displayPrompt)}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Validation Warnings */}
        {validation.warnings.length > 0 && (
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

        {/* Optimize with Claude */}
        <div className="flex gap-2">
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
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Optimization Results */}
        {optimizedPrompt && !isEditing && (
          <div className="space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-green-800 dark:text-green-200">
                Prompt Optimized by Claude
              </span>
            </div>
            {explanation && (
              <p className="text-sm text-green-700 dark:text-green-300">{explanation}</p>
            )}
            {suggestions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">
                  Additional Suggestions:
                </p>
                <ul className="text-sm text-green-700 dark:text-green-300 list-disc list-inside">
                  {suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
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
