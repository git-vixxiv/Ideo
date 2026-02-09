"use client";

import {
  createContext,
  useContext,
  useReducer,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import type { PromptBuilderState, PromptHistoryItem } from "@/types/prompt";
import { DEFAULT_PROMPT_STATE } from "./constants";
import { buildPrompt, generateNegativePrompt } from "./prompt-builder";
import { useAuth } from "./auth-context";

interface PromptContextValue {
  state: PromptBuilderState;
  generatedPrompt: string;
  optimizedPrompt: string | null;
  setOptimizedPrompt: (prompt: string | null) => void;
  updateState: <K extends keyof PromptBuilderState>(
    key: K,
    value: PromptBuilderState[K]
  ) => void;
  resetState: () => void;
  loadState: (state: PromptBuilderState) => void;
  history: PromptHistoryItem[];
  addToHistory: (item: Omit<PromptHistoryItem, "id" | "timestamp">) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  apiKeys: {
    claude: string;
    ideogram: string;
  };
  setApiKey: (key: "claude" | "ideogram", value: string) => void;
}

const PromptContext = createContext<PromptContextValue | null>(null);

type Action =
  | { type: "UPDATE"; key: keyof PromptBuilderState; value: unknown }
  | { type: "RESET" }
  | { type: "LOAD"; state: PromptBuilderState };

function promptReducer(
  state: PromptBuilderState,
  action: Action
): PromptBuilderState {
  switch (action.type) {
    case "UPDATE":
      return { ...state, [action.key]: action.value };
    case "RESET":
      return { ...DEFAULT_PROMPT_STATE };
    case "LOAD":
      return { ...action.state };
    default:
      return state;
  }
}

interface PromptProviderProps {
  children: ReactNode;
}

export function PromptProvider({ children }: PromptProviderProps) {
  const { user, settings, updateSettings, isConfigured } = useAuth();
  const [state, dispatch] = useReducer(promptReducer, DEFAULT_PROMPT_STATE);
  const [optimizedPrompt, setOptimizedPromptState] = useState<string | null>(null);
  const [history, setHistory] = useReducer(
    (
      state: PromptHistoryItem[],
      action:
        | { type: "ADD"; item: PromptHistoryItem }
        | { type: "TOGGLE_FAVORITE"; id: string }
        | { type: "CLEAR" }
        | { type: "LOAD"; items: PromptHistoryItem[] }
    ) => {
      switch (action.type) {
        case "ADD":
          return [action.item, ...state].slice(0, 50); // Keep last 50 items
        case "TOGGLE_FAVORITE":
          return state.map((item) =>
            item.id === action.id
              ? { ...item, isFavorite: !item.isFavorite }
              : item
          );
        case "CLEAR":
          return state.filter((item) => item.isFavorite);
        case "LOAD":
          return action.items;
        default:
          return state;
      }
    },
    []
  );

  const [localApiKeys, setLocalApiKeys] = useReducer(
    (
      state: { claude: string; ideogram: string },
      action: { type: "SET"; key: "claude" | "ideogram"; value: string } | { type: "LOAD"; keys: { claude: string; ideogram: string } }
    ) => {
      if (action.type === "LOAD") {
        return action.keys;
      }
      return { ...state, [action.key]: action.value };
    },
    { claude: "", ideogram: "" }
  );

  // Compute effective API keys: prefer auth context when logged in, fallback to localStorage
  const apiKeys = {
    claude: (user && settings?.claude_api_key) || localApiKeys.claude,
    ideogram: (user && settings?.ideogram_api_key) || localApiKeys.ideogram,
  };

  // Load from localStorage on mount (only for non-authenticated users or as fallback)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("ideogram-prompt-history");
      const savedKeys = localStorage.getItem("ideogram-api-keys");

      if (savedHistory) {
        try {
          setHistory({ type: "LOAD", items: JSON.parse(savedHistory) });
        } catch (e) {
          console.error("Failed to load history:", e);
        }
      }

      if (savedKeys) {
        try {
          setLocalApiKeys({ type: "LOAD", keys: JSON.parse(savedKeys) });
        } catch (e) {
          console.error("Failed to load API keys:", e);
        }
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && history.length > 0) {
      localStorage.setItem("ideogram-prompt-history", JSON.stringify(history));
    }
  }, [history]);

  // Save API keys to localStorage only when not logged in
  useEffect(() => {
    if (typeof window !== "undefined" && !user && (localApiKeys.claude || localApiKeys.ideogram)) {
      localStorage.setItem("ideogram-api-keys", JSON.stringify(localApiKeys));
    }
  }, [localApiKeys, user]);

  const updateState = useCallback(
    <K extends keyof PromptBuilderState>(
      key: K,
      value: PromptBuilderState[K]
    ) => {
      dispatch({ type: "UPDATE", key, value });
    },
    []
  );

  const resetState = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const loadState = useCallback((newState: PromptBuilderState) => {
    dispatch({ type: "LOAD", state: newState });
  }, []);

  const generatedPrompt = buildPrompt(state);

  const addToHistory = useCallback(
    (item: Omit<PromptHistoryItem, "id" | "timestamp">) => {
      setHistory({
        type: "ADD",
        item: {
          ...item,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      });
    },
    []
  );

  const toggleFavorite = useCallback((id: string) => {
    setHistory({ type: "TOGGLE_FAVORITE", id });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory({ type: "CLEAR" });
    localStorage.removeItem("ideogram-prompt-history");
  }, []);

  const setApiKey = useCallback(async (key: "claude" | "ideogram", value: string) => {
    // If user is logged in, save to database
    if (user && isConfigured) {
      try {
        const dbKey = key === "claude" ? "claude_api_key" : "ideogram_api_key";
        await updateSettings({ [dbKey]: value });
      } catch (err) {
        console.error("Failed to save API key to database:", err);
        // Still update local state as fallback
      }
    }
    // Always update local state (for immediate UI response and fallback)
    setLocalApiKeys({ type: "SET", key, value });
  }, [user, isConfigured, updateSettings]);

  const setOptimizedPrompt = useCallback((prompt: string | null) => {
    setOptimizedPromptState(prompt);
  }, []);

  // Clear optimized prompt when key state fields change
  useEffect(() => {
    setOptimizedPromptState(null);
  }, [state.subject, state.artStyle, state.setting]);

  return (
    <PromptContext.Provider
      value={{
        state,
        generatedPrompt,
        optimizedPrompt,
        setOptimizedPrompt,
        updateState,
        resetState,
        loadState,
        history,
        addToHistory,
        toggleFavorite,
        clearHistory,
        apiKeys,
        setApiKey,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

export function usePromptContext() {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePromptContext must be used within a PromptProvider");
  }
  return context;
}
