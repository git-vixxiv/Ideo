"use client";

import { usePromptContext } from "@/lib/prompt-context";
import { Button } from "@/components/ui/Button";

interface HistoryPanelProps {
  onClose: () => void;
}

export function HistoryPanel({ onClose }: HistoryPanelProps) {
  const { history, toggleFavorite, clearHistory, loadState } = usePromptContext();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleLoad = (item: (typeof history)[0]) => {
    loadState(item.state);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[80vh] shadow-2xl flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Prompt History
          </h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Clear all history except favorites?")) {
                    clearHistory();
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
                Clear History
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-zinc-500 dark:text-zinc-400">No history yet</p>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
                Your generated prompts will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatDate(item.timestamp)}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.isFavorite
                            ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            : "text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        }`}
                        title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <svg
                          className="w-4 h-4"
                          fill={item.isFavorite ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleLoad(item)}
                        className="p-1.5 text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                        title="Load this prompt"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="text-zinc-800 dark:text-zinc-200 line-clamp-3 mb-3">
                    {item.optimizedPrompt || item.generatedPrompt}
                  </p>

                  {item.generatedImages && item.generatedImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {item.generatedImages.slice(0, 4).map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Generated ${i + 1}`}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      ))}
                      {item.generatedImages.length > 4 && (
                        <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            +{item.generatedImages.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.state.subjectCategory && (
                      <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs rounded-full">
                        {item.state.subjectCategory}
                      </span>
                    )}
                    {item.state.artStyle && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        {item.state.artStyle}
                      </span>
                    )}
                    {item.state.mood && (
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                        {item.state.mood}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
