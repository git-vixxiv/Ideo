"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { usePromptContext } from "@/lib/prompt-context";
import { Button } from "@/components/ui/Button";

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { user, isConfigured, signInWithGoogle } = useAuth();
  const { apiKeys, hasApiKeys, setApiKey, resetState } = usePromptContext();

  // For logged-in users, start with empty fields (keys are stored server-side)
  // For local mode, start with actual values
  const [claudeKey, setClaudeKey] = useState(user ? "" : apiKeys.claude);
  const [ideogramKey, setIdeogramKey] = useState(user ? "" : apiKeys.ideogram);
  const [showClaudeKey, setShowClaudeKey] = useState(false);
  const [showIdeogramKey, setShowIdeogramKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync form values with context when apiKeys change (only for local mode)
  useEffect(() => {
    if (!user) {
      setClaudeKey(apiKeys.claude || "");
      setIdeogramKey(apiKeys.ideogram || "");
    }
  }, [apiKeys.claude, apiKeys.ideogram, user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      // Only save keys that have been entered
      if (claudeKey) {
        await setApiKey("claude", claudeKey);
      }
      if (ideogramKey) {
        await setApiKey("ideogram", ideogramKey);
      }

      // Clear the input fields after saving (for security)
      if (user) {
        setClaudeKey("");
        setIdeogramKey("");
      }

      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setSaveError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-200 dark:border-[#3a3a3a]">
        <div className="p-6 border-b border-zinc-200 dark:border-[#3a3a3a] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] dark:text-[#f4f4f4]">
              Settings
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {user ? "API keys encrypted & stored securely" : "API keys stored locally in browser"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Auth Status Banner */}
          {isConfigured && !user && (
            <div className="p-4 bg-[#998748]/10 border border-[#998748]/30 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#998748] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1A1A1A] dark:text-[#f4f4f4]">
                    Sign in for secure encrypted storage
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Your keys will be encrypted and stored securely on our servers.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={signInWithGoogle}
                    className="mt-3 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </Button>
                </div>
              </div>
            </div>
          )}

          {user && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Signed in as {user.email}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Keys are encrypted with AES-256-GCM before storage
                </p>
              </div>
            </div>
          )}

          {/* API Keys */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              API Keys
            </h3>

            {/* Claude API Key */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Claude API Key
                </label>
                {user && hasApiKeys.claude && (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Configured
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showClaudeKey ? "text" : "password"}
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  placeholder={user && hasApiKeys.claude ? "Enter new key to replace existing" : "sk-ant-..."}
                  className="w-full px-3 py-2 pr-16 bg-white dark:bg-[#242424] border border-zinc-200 dark:border-[#3a3a3a] rounded-lg text-[#1A1A1A] dark:text-[#f4f4f4] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#998748]"
                />
                <button
                  type="button"
                  onClick={() => setShowClaudeKey(!showClaudeKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  {showClaudeKey ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Required for prompt optimization.{" "}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2589bd] hover:underline"
                >
                  Get your key
                </a>
              </p>
            </div>

            {/* Ideogram API Key */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ideogram API Key
                </label>
                {user && hasApiKeys.ideogram && (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Configured
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showIdeogramKey ? "text" : "password"}
                  value={ideogramKey}
                  onChange={(e) => setIdeogramKey(e.target.value)}
                  placeholder={user && hasApiKeys.ideogram ? "Enter new key to replace existing" : "Enter your Ideogram API key"}
                  className="w-full px-3 py-2 pr-16 bg-white dark:bg-[#242424] border border-zinc-200 dark:border-[#3a3a3a] rounded-lg text-[#1A1A1A] dark:text-[#f4f4f4] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#998748]"
                />
                <button
                  type="button"
                  onClick={() => setShowIdeogramKey(!showIdeogramKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  {showIdeogramKey ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Required for image generation.{" "}
                <a
                  href="https://ideogram.ai/manage-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2589bd] hover:underline"
                >
                  Get your key
                </a>
              </p>
            </div>
          </div>

          {/* Reset */}
          <div className="pt-4 border-t border-zinc-200 dark:border-[#3a3a3a]">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-2">
              Data
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm("Reset all prompt settings to defaults?")) {
                  resetState();
                }
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Reset Prompt Settings
            </Button>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-[#3a3a3a] flex items-center justify-between">
          <div className="text-sm">
            {saveSuccess && (
              <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Settings saved securely!
              </span>
            )}
            {saveError && (
              <span className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {saveError}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={isSaving}
              disabled={!claudeKey && !ideogramKey}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
